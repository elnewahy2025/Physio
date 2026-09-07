import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { hashPassword, verifyPassword } from "../lib/password.js";
import { generateTokens, verifyToken } from "../lib/jwt.js";
import {
  UnauthorizedError,
  ConflictError,
  NotFoundError,
} from "../middleware/errors.js";
import type {
  User,
  UserRole,
  LoginInput,
  TokenPayload,
  RefreshTokenInput,
} from "@physio/contracts";

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["OWNER", "THERAPIST", "SECRETARY", "PATIENT"]),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// Helper to map Prisma User to contract User type
function mapPrismaUser(prismaUser: {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}): User {
  return {
    id: prismaUser.id,
    name: prismaUser.name,
    email: prismaUser.email,
    phone: prismaUser.phone,
    role: prismaUser.role,
    createdAt: prismaUser.createdAt.toISOString(),
    updatedAt: prismaUser.updatedAt.toISOString(),
  };
}

/**
 * Register a new user
 */
export async function registerUser(input: RegisterInput) {
  // Validate input
  const validated = registerSchema.parse(input);

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: validated.email },
  });

  if (existingUser) {
    throw new ConflictError("Email already registered", {
      email: ["This email is already in use"],
    });
  }

  // Hash password
  const passwordHash = await hashPassword(validated.password);

  // Create user
  const user = await prisma.user.create({
    data: {
      name: validated.name,
      email: validated.email,
      phone: validated.phone,
      passwordHash,
      role: validated.role as UserRole,
    },
  });

  // Generate tokens
  const tokens = generateTokens({
    userId: user.id,
    role: user.role,
    email: user.email,
  });

  return {
    user: mapPrismaUser(user),
    tokens,
  };
}

/**
 * Login user and return tokens
 */
export async function loginUser(input: LoginInput) {
  const validated = loginSchema.parse(input);

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: validated.email },
  });

  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  // Verify password
  const isValidPassword = await verifyPassword(
    validated.password,
    user.passwordHash
  );

  if (!isValidPassword) {
    throw new UnauthorizedError("Invalid email or password");
  }

  // Generate tokens
  const tokens = generateTokens({
    userId: user.id,
    role: user.role,
    email: user.email,
  });

  return {
    user: mapPrismaUser(user),
    tokens,
  };
}

/**
 * Refresh access token using refresh token
 */
export async function refreshTokens(input: RefreshTokenInput) {
  const validated = refreshTokenSchema.parse(input);

  // Verify refresh token
  let payload: TokenPayload;
  try {
    payload = verifyToken(validated.refreshToken) as TokenPayload;
  } catch {
    throw new UnauthorizedError("Invalid or expired refresh token");
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user) {
    throw new NotFoundError("User", payload.userId);
  }

  // Generate new tokens
  const tokens = generateTokens({
    userId: user.id,
    role: user.role,
    email: user.email,
  });

  return {
    user: mapPrismaUser(user),
    tokens,
  };
}

/**
 * Get current user by ID
 */
export async function getUserById(userId: string): Promise<User> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundError("User", userId);
  }

  return mapPrismaUser(user);
}

/**
 * Get all users (for admin/owner)
 */
export async function getAllUsers(): Promise<User[]> {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return users.map(mapPrismaUser);
}

/**
 * Delete a user
 */
export async function deleteUser(userId: string): Promise<User> {
  const user = await prisma.user.delete({
    where: { id: userId },
  });

  return mapPrismaUser(user);
}

// Re-export middleware helpers
export {
  authenticate,
  optionalAuth,
  authorize,
  requireOwner,
  requireTherapist,
  requireSecretary,
  requirePatient,
  getCurrentUser,
} from "../middleware/auth.js";
