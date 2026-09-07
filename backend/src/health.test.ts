import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "./app.js";

describe("health endpoint", () => {
  it("reports the API as healthy", async () => {
    const response = await request(createApp()).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok", service: "api" });
  });
});
