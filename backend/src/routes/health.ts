import { Router, type Router as ExpressRouter } from "express";
import type { HealthStatus } from "@physio/contracts";

export const healthRouter: ExpressRouter = Router();

healthRouter.get("/health", (_request, response) => {
  const payload: HealthStatus = { status: "ok", service: "api" };
  response.json(payload);
});
