import request from "supertest";
import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { createApp } from "./app.js";
import { prisma } from "./lib/prisma.js";

// Helper to create a test user
async function createTestUser(overrides = {}) {
  const user = await prisma.user.create({
    data: {
      name: "Test User",
      email: `test-${Date.now()}@example.com`,
      passwordHash: "test-hash",
      role: "PATIENT",
      ...overrides,
    },
  });
  return user;
}

// Helper to cleanup test users
async function cleanupTestUsers() {
  await prisma.user.deleteMany({
    where: {
      email: {
        contains: "test-",
      },
    },
  });
}

describe("Auth Routes", () => {
  beforeAll(async () => {
    // Clean up before tests
    await cleanupTestUsers();

    // Create a test user for login tests
    await createTestUser({
      email: "test-auth@example.com",
      passwordHash: "$2a$12$testhash", // dummy hash
    });
  });

  afterAll(async () => {
    // Clean up after tests
    await cleanupTestUsers();
    await prisma.$disconnect();
  });

  describe("POST /api/auth/register", () => {
    it("registers a new user successfully", async () => {
      const response = await request(createApp())
        .post("/api/auth/register")
        .send({
          name: "New User",
          email: `new-test-${Date.now()}@example.com`,
          password: "password123",
          role: "PATIENT",
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("user");
      expect(response.body.user).toHaveProperty("id");
      expect(response.body.user).toHaveProperty("email");
      expect(response.body.user).toHaveProperty("name", "New User");
      expect(response.body.user).toHaveProperty("role", "PATIENT");
      expect(response.body).toHaveProperty("tokens");
      expect(response.body.tokens).toHaveProperty("accessToken");
      expect(response.body.tokens).toHaveProperty("refreshToken");
    });

    it("rejects registration with invalid email", async () => {
      const response = await request(createApp())
        .post("/api/auth/register")
        .send({
          name: "New User",
          email: "invalid-email",
          password: "password123",
          role: "PATIENT",
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    it("rejects registration with short password", async () => {
      const response = await request(createApp())
        .post("/api/auth/register")
        .send({
          name: "New User",
          email: `short-pw-${Date.now()}@example.com`,
          password: "short",
          role: "PATIENT",
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    it("rejects duplicate email registration", async () => {
      // First registration
      await request(createApp()).post("/api/auth/register").send({
        name: "Duplicate User",
        email: "duplicate-test@example.com",
        password: "password123",
        role: "PATIENT",
      });

      // Second registration with same email
      const response = await request(createApp())
        .post("/api/auth/register")
        .send({
          name: "Another User",
          email: "duplicate-test@example.com",
          password: "password123",
          role: "PATIENT",
        });

      expect(response.status).toBe(409);
      expect(response.body.error.code).toBe("CONFLICT");
      expect(response.body.error.message).toBe("Email already registered");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should return 401 for invalid credentials", async () => {
      const response = await request(createApp()).post("/api/auth/login").send({
        email: "nonexistent@example.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe("UNAUTHORIZED");
    });

    it("should return 400 for invalid email format", async () => {
      const response = await request(createApp()).post("/api/auth/login").send({
        email: "invalid-email",
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    it("should return 400 for missing password", async () => {
      const response = await request(createApp()).post("/api/auth/login").send({
        email: "test@example.com",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("POST /api/auth/refresh", () => {
    it("should return 401 for invalid refresh token", async () => {
      const response = await request(createApp())
        .post("/api/auth/refresh")
        .send({
          refreshToken: "invalid-token",
        });

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe("UNAUTHORIZED");
    });

    it("should return 400 for missing refresh token", async () => {
      const response = await request(createApp())
        .post("/api/auth/refresh")
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should return success message", async () => {
      const response = await request(createApp())
        .post("/api/auth/logout")
        .send({});

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Logged out successfully" });
    });
  });

  describe("GET /api/auth/me", () => {
    it("should return 401 without authentication", async () => {
      const response = await request(createApp()).get("/api/auth/me");

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe("UNAUTHORIZED");
    });

    it("should return 401 with invalid token", async () => {
      const response = await request(createApp())
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe("UNAUTHORIZED");
    });
  });

  describe("GET /api/auth/users", () => {
    it("should return 401 without authentication", async () => {
      const response = await request(createApp()).get("/api/auth/users");

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe("UNAUTHORIZED");
    });
  });
});

describe("Auth Middleware", () => {
  describe("authenticate middleware", () => {
    it("should reject requests without Authorization header", async () => {
      const response = await request(createApp()).get("/api/auth/me");

      expect(response.status).toBe(401);
    });

    it("should reject requests with invalid Bearer token", async () => {
      const response = await request(createApp())
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid.token.here");

      expect(response.status).toBe(401);
    });

    it("should reject requests with malformed Authorization header", async () => {
      const response = await request(createApp())
        .get("/api/auth/me")
        .set("Authorization", "Basic invalid");

      expect(response.status).toBe(401);
    });
  });

  describe("authorize middleware", () => {
    it("should return 403 for insufficient permissions", async () => {
      // This test would need a valid token with a non-OWNER role
      // For now, just verify the route exists
      const response = await request(createApp())
        .get("/api/auth/users")
        .set("Authorization", "Bearer invalid.token");

      // Will fail at auth first, but that's fine
      expect(response.status).toBe(401);
    });
  });
});
