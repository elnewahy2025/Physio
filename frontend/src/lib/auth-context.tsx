import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./api-client";
import type {
  User,
  UserRole,
  RegisterInput,
  LoginInput,
  AuthResponse,
} from "@physio/contracts";

// Auth Context Types
type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

type AuthContextType = AuthState & {
  login: (input: LoginInput) => Promise<AuthResponse>;
  register: (input: RegisterInput) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refresh: () => Promise<AuthResponse | null>;
  clearError: () => void;
};

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider props
type AuthProviderProps = {
  children: ReactNode;
};

// Auth Provider Component
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(initialState);
  const queryClient = useQueryClient();

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const hasToken = apiClient.getAccessToken();
        if (hasToken) {
          const response = await apiClient.me();
          setState({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setState({
            ...initialState,
            isLoading: false,
          });
        }
      } catch {
        // Token might be expired, clear it
        apiClient.clearTokens();
        setState({
          ...initialState,
          isLoading: false,
        });
      }
    };

    if (typeof window !== "undefined") {
      checkAuth();
    } else {
      setState({ ...initialState, isLoading: false });
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Login mutation
  const login = useCallback(
    async (input: LoginInput): Promise<AuthResponse> => {
      try {
        const response = await apiClient.login(input);
        setState({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return response;
      } catch (err) {
        const error = err as { error?: { message?: string } };
        const message = error.error?.message || "Login failed";
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: message,
        }));
        throw err;
      }
    },
    []
  );

  // Register mutation
  const register = useCallback(
    async (input: RegisterInput): Promise<AuthResponse> => {
      try {
        const response = await apiClient.register(input);
        setState({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return response;
      } catch (err) {
        const error = err as { error?: { message?: string } };
        const message = error.error?.message || "Registration failed";
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: message,
        }));
        throw err;
      }
    },
    []
  );

  // Logout mutation
  const logout = useCallback(async () => {
    try {
      await apiClient.logout();
    } catch {
      // Ignore logout errors
    } finally {
      apiClient.clearTokens();
      queryClient.clear();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, [queryClient]);

  // Refresh token
  const refresh = useCallback(async (): Promise<AuthResponse | null> => {
    try {
      if (typeof window === "undefined") return null;
      const refreshToken = localStorage.getItem("physio_refresh_token");
      if (!refreshToken) {
        await logout();
        return null;
      }

      const response = await apiClient.refreshToken({ refreshToken });
      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return response;
    } catch {
      await logout();
      return null;
    }
  }, [logout]);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refresh,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook to get current user
export function useCurrentUser(): User | null {
  const { user } = useAuth();
  return user;
}

// Hook to check if authenticated
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}

// Hook to check user role
export function useHasRole(role: UserRole | UserRole[]): boolean {
  const { user } = useAuth();
  if (!user) return false;
  if (Array.isArray(role)) {
    return role.includes(user.role);
  }
  return user.role === role;
}
