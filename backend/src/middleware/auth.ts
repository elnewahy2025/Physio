import type { Request, Response, NextFunction } from "express";
import { verifyToken, decodeToken } from "../lib/jwt.js";
import { getUserById } from "../services/auth.js";
import { UnauthorizedError, ForbiddenError } from "./errors.js";
import type { User, UserRole, TokenPayload } from "@physio/contracts";

// Extend Express Request type to include user
export interface AuthRequest extends Request {
  user?: User;
}

// Extract token from Authorization header
function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Authentication middleware - verifies JWT and attaches user to request
 * Requires: Authorization: Bearer <token> header
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req);

  if (!token) {
    throw new UnauthorizedError("Authentication required");
  }

  try {
    const payload = verifyToken(token) as TokenPayload;
    (req as AuthRequest).user = payload as unknown as User;
    next();
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }
}

/**
 * Optional authentication middleware - attaches user if token is valid
 * Does not throw if no token or invalid token
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const token = extractToken(req);

  if (!token) {
    return next();
  }

  try {
    const payload = decodeToken(token);
    if (payload) {
      (req as AuthRequest).user = payload as unknown as User;
    }
    next();
  } catch {
    next();
  }
}

/**
 * Role-based authorization middleware
 * @param roles - Array of allowed roles
 */
export function authorize(roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      throw new UnauthorizedError("Authentication required");
    }

    if (!roles.includes(authReq.user.role)) {
      throw new ForbiddenError("Insufficient permissions");
    }

    next();
  };
}

/**
 * Convenience middleware for specific roles
 */
export const requireOwner = authorize(["OWNER"]);
export const requireTherapist = authorize(["OWNER", "THERAPIST"]);
export const requireSecretary = authorize(["OWNER", "SECRETARY"]);
export const requirePatient = authorize(["OWNER", "SECRETARY", "PATIENT"]);

/**
 * Get current user from request (throws if not authenticated)
 */
export async function getCurrentUser(req: Request): Promise<User> {
  const authReq = req as AuthRequest;
  if (!authReq.user) {
    throw new UnauthorizedError("Authentication required");
  }

  // Fetch fresh user data from database
  return getUserById(authReq.user.id);
}
