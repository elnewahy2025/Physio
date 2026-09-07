import type {
  HealthStatus,
  ApiError,
  RegisterInput,
  LoginInput,
  AuthResponse,
  RefreshTokenInput,
  MeResponse,
} from "@physio/contracts";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// Storage keys for auth tokens
const ACCESS_TOKEN_KEY = "physio_access_token";
const REFRESH_TOKEN_KEY = "physio_refresh_token";

/**
 * API Client for Physio Center Management System
 * Provides typed HTTP requests with error handling
 */

class ApiClient {
  private getAuthHeader(): Record<string, string> {
    if (typeof window === "undefined") return {};
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data?: unknown,
    params?: Record<string, string | number | undefined>
  ): Promise<T> {
    const url = new URL(`${API_BASE_URL}/api${endpoint}`);

    // Add query parameters
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      },
      body: data ? JSON.stringify(data) : undefined,
    };

    const response = await fetch(url.toString(), options);

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        error: {
          code: "UNKNOWN_ERROR",
          message: "Request failed",
        },
      }));
      throw error;
    }

    return response.json() as Promise<T>;
  }

  // GET request
  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | undefined>
  ): Promise<T> {
    return this.request<T>("GET", endpoint, undefined, params);
  }

  // POST request
  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>("POST", endpoint, data);
  }

  // PUT request
  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>("PUT", endpoint, data);
  }

  // PATCH request
  async patch<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>("PATCH", endpoint, data);
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>("DELETE", endpoint);
  }

  // Health check
  async health(): Promise<HealthStatus> {
    return this.get<HealthStatus>("/health");
  }

  // Authentication methods

  /**
   * Store auth tokens in localStorage
   */
  setTokens(tokens: { accessToken: string; refreshToken: string }): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    }
  }

  /**
   * Clear auth tokens from localStorage
   */
  clearTokens(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }

  /**
   * Get access token from localStorage
   */
  getAccessToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    }
    return null;
  }

  /**
   * Register a new user
   */
  async register(input: RegisterInput): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>("/auth/register", input);
    this.setTokens({
      accessToken: response.tokens.accessToken,
      refreshToken: response.tokens.refreshToken,
    });
    return response;
  }

  /**
   * Login user
   */
  async login(input: LoginInput): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>("/auth/login", input);
    this.setTokens({
      accessToken: response.tokens.accessToken,
      refreshToken: response.tokens.refreshToken,
    });
    return response;
  }

  /**
   * Logout user
   */
  async logout(): Promise<{ message: string }> {
    const result = await this.post<{ message: string }>("/auth/logout", {});
    this.clearTokens();
    return result;
  }

  /**
   * Refresh access token
   */
  async refreshToken(input: RefreshTokenInput): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>("/auth/refresh", input);
    this.setTokens(response.tokens);
    return response;
  }

  /**
   * Get current user
   */
  async me(): Promise<MeResponse> {
    return this.get<MeResponse>("/auth/me");
  }
}

export const apiClient = new ApiClient();
