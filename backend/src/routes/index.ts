import { Router } from "express";
import { healthRouter } from "./health.js";

export const apiRouter = Router();

// Health check
apiRouter.use("/health", healthRouter);

// Core domain routes (stubs for M1)
// These will be implemented in subsequent milestones
apiRouter.use("/users", Router());
apiRouter.use("/patients", Router());
apiRouter.use("/appointments", Router());
apiRouter.use("/therapy-sessions", Router());
apiRouter.use("/invoices", Router());
apiRouter.use("/payments", Router());
apiRouter.use("/rooms", Router());
apiRouter.use("/settings", Router());
