import { Router, type Router as ExpressRouter } from "express";
import { healthRouter } from "./health.js";

const apiRouter: ExpressRouter = Router();

// Health check - mount at root of apiRouter
apiRouter.use(healthRouter);

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

export { apiRouter };
