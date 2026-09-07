import { Router, type Router as ExpressRouter } from "express";
import { validateBody } from "../middleware/validation.js";
import { authenticate, requireOwner } from "../middleware/auth.js";
import * as authService from "../services/auth.js";
import { z } from "zod";
import type { AuthRequest } from "../middleware/auth.js";
import type {
  RegisterInput,
  LoginInput,
  RefreshTokenInput,
  MeResponse,
} from "@physio/contracts";

const authRouter: ExpressRouter = Router();

// Register a new user
// POST /api/auth/register
authRouter.post(
  "/register",
  validateBody(
    z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(8),
      role: z.enum(["OWNER", "THERAPIST", "SECRETARY", "PATIENT"]),
      phone: z.string().optional(),
    })
  ),
  async (req, res) => {
    const input = req.body as RegisterInput;
    const result = await authService.registerUser(input);
    res.json(result);
  }
);

// Login
// POST /api/auth/login
authRouter.post(
  "/login",
  validateBody(
    z.object({
      email: z.string().email(),
      password: z.string().min(1),
    })
  ),
  async (req, res) => {
    const input = req.body as LoginInput;
    const result = await authService.loginUser(input);
    res.json(result);
  }
);

// Logout
// POST /api/auth/logout
authRouter.post("/logout", (_req, res) => {
  // JWT tokens are stateless - client should discard them
  res.json({ message: "Logged out successfully" });
});

// Refresh token
// POST /api/auth/refresh
authRouter.post(
  "/refresh",
  validateBody(
    z.object({
      refreshToken: z.string().min(1),
    })
  ),
  async (req, res) => {
    const input = req.body as RefreshTokenInput;
    const result = await authService.refreshTokens(input);
    res.json(result);
  }
);

// Get current user
// GET /api/auth/me
authRouter.get("/me", authenticate, async (req: AuthRequest, res) => {
  const user = await authService.getUserById(req.user!.id);
  const result: MeResponse = { user };
  res.json(result);
});

// Get all users (OWNER only)
// GET /api/auth/users
authRouter.get(
  "/users",
  authenticate,
  requireOwner,
  async (req: AuthRequest, res) => {
    const users = await authService.getAllUsers();
    res.json({ users });
  }
);

export { authRouter };
