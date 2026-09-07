import { z } from "zod";

// Environment schema for validation
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  // JWT Configuration
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_ACCESS_EXPIRES_IN: z
    .string()
    .regex(/^\d+[smhd]$/, "Invalid duration format, use e.g., 15m, 1h, 1d")
    .default("15m"),
  JWT_REFRESH_EXPIRES_IN: z
    .string()
    .regex(/^\d+[smhd]$/, "Invalid duration format")
    .default("7d"),
  // Password Configuration
  BCRYPT_ROUNDS: z.coerce.number().default(12),
});

// Validate environment variables
const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error("❌ Invalid environment configuration:");
  console.error(env.error.flatten().fieldErrors);
  process.exit(1);
}

// Parse duration strings (e.g., "15m" -> 900000)
function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) return 900000; // default 15 minutes

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "d":
      return value * 24 * 60 * 60 * 1000;
    default:
      return 900000;
  }
}

export const config = {
  nodeEnv: env.data.NODE_ENV,
  port: env.data.PORT,
  databaseUrl: env.data.DATABASE_URL,
  jwt: {
    secret: env.data.JWT_SECRET,
    accessExpiresIn: parseDuration(env.data.JWT_ACCESS_EXPIRES_IN),
    refreshExpiresIn: parseDuration(env.data.JWT_REFRESH_EXPIRES_IN),
  },
  bcrypt: {
    rounds: env.data.BCRYPT_ROUNDS,
  },
  isProduction: env.data.NODE_ENV === "production",
  isTest: env.data.NODE_ENV === "test",
};

export type Config = typeof config;
