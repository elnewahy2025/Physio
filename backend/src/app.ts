import express, { type Express } from "express";
import { healthRouter } from "./routes/health.js";

export function createApp(): Express {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json());
  app.use(healthRouter);
  return app;
}
