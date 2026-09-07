import type { Request, Response, NextFunction } from "express";
import { z, type ZodSchema } from "zod";

/**
 * Validation middleware that validates request body against a Zod schema
 * Returns parsed data via res.locals.parsedBody
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

    (res as Response & { locals: { parsedBody?: T } }).locals.parsedBody =
      result.data;
    next();
  };
}

/**
 * Validation middleware that validates request query parameters against a Zod schema
 * Returns parsed data via res.locals.parsedQuery
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

    (res as Response & { locals: { parsedQuery?: T } }).locals.parsedQuery =
      result.data;
    next();
  };
}

/**
 * Validation middleware that validates request params against a Zod schema
 * Returns parsed data via res.locals.parsedParams
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

    (res as Response & { locals: { parsedParams?: T } }).locals.parsedParams =
      result.data;
    next();
  };
}

// Common schemas
export const idSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(10),
});

export const dateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});
