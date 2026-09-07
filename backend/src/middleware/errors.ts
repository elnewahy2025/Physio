import type { NextFunction } from "express";
import { z } from "zod";

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Not Found Error
 */
export class NotFoundError extends ApiError {
  constructor(resource: string, id: string) {
    super(404, "NOT_FOUND", `${resource} with id ${id} not found`);
    this.name = "NotFoundError";
  }
}

/**
 * Conflict Error (e.g., duplicate email, overlapping appointments)
 */
export class ConflictError extends ApiError {
  constructor(message: string, details?: Record<string, string[]>) {
    super(409, "CONFLICT", message, details);
    this.name = "ConflictError";
  }
}

/**
 * Unauthorized Error
 */
export class UnauthorizedError extends ApiError {
  constructor(message: string = "Unauthorized") {
    super(401, "UNAUTHORIZED", message);
    this.name = "UnauthorizedError";
  }
}

/**
 * Forbidden Error
 */
export class ForbiddenError extends ApiError {
  constructor(message: string = "Forbidden") {
    super(403, "FORBIDDEN", message);
    this.name = "ForbiddenError";
  }
}

/**
 * Bad Request Error
 */
export class BadRequestError extends ApiError {
  constructor(message: string, details?: Record<string, string[]>) {
    super(400, "BAD_REQUEST", message, details);
    this.name = "BadRequestError";
  }
}

/**
 * Global error handler middleware
 * Must be registered last, after all routes
 */
export const errorHandler = (
  error: Error,
  _req: unknown,
  res: unknown,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  console.error("Error:", error);

  const response = res as {
    status: (code: number) => { json: (data: unknown) => void };
  };

  // Handle Zod validation errors
  if (error instanceof z.ZodError) {
    return response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed",
        details: error.flatten().fieldErrors,
      },
    });
  }

  // Handle custom API errors
  if (error instanceof ApiError) {
    return response.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    });
  }

  // Handle generic errors
  return response.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
    },
  });
};

/**
 * 404 handler for unmatched routes
 * Must be registered before the error handler
 */
export const notFoundHandler = (
  _req: unknown,
  res: unknown,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  const response = res as {
    status: (code: number) => { json: (data: unknown) => void };
  };
  response.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: "Resource not found",
    },
  });
};
