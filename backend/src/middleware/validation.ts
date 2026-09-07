import type { Request, Response, NextFunction } from "express";
import { z, type ZodSchema } from "zod";

/**
 * Validation middleware that validates request body against a Zod schema
 */
export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Request body validation failed",
          details: result.error.flatten().fieldErrors,
        },
      });
    }
    
    req.body = result.data as T;
    next();
  };
}

/**
 * Validation middleware that validates request query parameters against a Zod schema
 */
export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    
    if (!result.success) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Request query validation failed",
          details: result.error.flatten().fieldErrors,
        },
      });
    }
    
    req.query = result.data as T;
    next();
  };
}

/**
 * Validation middleware that validates request params against a Zod schema
 */
export function validateParams<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    
    if (!result.success) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Request params validation failed",
          details: result.error.flatten().fieldErrors,
        },
      });
    }
    
    req.params = result.data as T;
    next();
  };
}

// Common schemas
export const idSchema = z.string().min(1, "ID is required");
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(10),
});

export const dateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});
