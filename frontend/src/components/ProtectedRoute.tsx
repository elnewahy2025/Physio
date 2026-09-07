import { Navigate, useLocation } from "react-router-dom";
import { useIsAuthenticated, useHasRole } from "../lib/auth-context";
import type { UserRole } from "@physio/contracts";

/**
 * Protected Route wrapper
 * Redirects to login if not authenticated
 */
type ProtectedRouteProps = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login, save the current location for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

/**
 * Role-based protected route
 * Redirects to login if not authenticated, or to home if wrong role
 */
type RoleProtectedRouteProps = {
  children: React.ReactNode;
  roles: UserRole | UserRole[];
  redirectTo?: string;
};

export function RoleProtectedRoute({
  children,
  roles,
  redirectTo = "/",
}: RoleProtectedRouteProps) {
  const isAuthenticated = useIsAuthenticated();
  const hasRole = useHasRole(roles);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasRole) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}

/**
 * Public route that redirects authenticated users to home
 */
type PublicRouteProps = {
  children: React.ReactNode;
};

export function PublicRoute({ children }: PublicRouteProps) {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();

  if (isAuthenticated) {
    // Redirect to home or to the intended destination
    const from =
      (location.state as { from?: { pathname: string } })?.from?.pathname ||
      "/";
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}

/**
 * Owner-only route
 */
type OwnerRouteProps = {
  children: React.ReactNode;
};

export function OwnerRoute({ children }: OwnerRouteProps) {
  return (
    <RoleProtectedRoute roles="OWNER" redirectTo="/">
      {children}
    </RoleProtectedRoute>
  );
}

/**
 * Therapist or Owner route
 */
export function TherapistRoute({ children }: OwnerRouteProps) {
  return (
    <RoleProtectedRoute roles={["OWNER", "THERAPIST"]} redirectTo="/">
      {children}
    </RoleProtectedRoute>
  );
}

/**
 * Secretary or Owner route
 */
export function SecretaryRoute({ children }: OwnerRouteProps) {
  return (
    <RoleProtectedRoute roles={["OWNER", "SECRETARY"]} redirectTo="/">
      {children}
    </RoleProtectedRoute>
  );
}

/**
 * Patient, Secretary, or Owner route
 */
export function PatientRoute({ children }: OwnerRouteProps) {
  return (
    <RoleProtectedRoute
      roles={["OWNER", "SECRETARY", "PATIENT"]}
      redirectTo="/"
    >
      {children}
    </RoleProtectedRoute>
  );
}
