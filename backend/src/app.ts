import express, { type Express } from "express";
import { apiRouter } from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/index.js";

export function createApp(): Express {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json());
  
  // API routes under /api prefix
  app.use("/api", apiRouter);
  
  // 404 handler for unmatched routes
  app.use(notFoundHandler);
  
  // Global error handler (must be last)
  app.use(errorHandler);
  
  return app;
}
