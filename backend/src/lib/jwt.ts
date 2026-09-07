import jwt from "jsonwebtoken";
import { config } from "./config.js";
import type { TokenPayload } from "@physio/contracts";

const { secret, accessExpiresIn, refreshExpiresIn } = config.jwt;

/**
 * Generate JWT tokens (access + refresh)
 */
export function generateTokens(payload: TokenPayload) {
  const accessToken = jwt.sign(payload, secret, {
    expiresIn: accessExpiresIn / 1000, // Convert ms to seconds
  });

  const refreshToken = jwt.sign(payload, secret, {
    expiresIn: refreshExpiresIn / 1000,
  });

  return {
    accessToken,
    refreshToken,
    expiresIn: accessExpiresIn,
  };
}

/**
 * Verify JWT token and return payload
 */
export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, secret) as TokenPayload;
}

/**
 * Check if token is expired (without throwing)
 */
export function isTokenExpired(token: string): boolean {
  try {
    jwt.verify(token, secret, { ignoreExpiration: false });
    return false;
  } catch {
    // Token expired or invalid
    return true;
  }
}

/**
 * Decode token without verification (for debugging/logging)
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    return jwt.decode(token) as TokenPayload;
  } catch {
    return null;
  }
}

export { jwt };
