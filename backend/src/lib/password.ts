import bcrypt from "bcryptjs";
import { config } from "./config.js";

const { rounds } = config.bcrypt;

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, rounds);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Check if a password needs rehashing (upgraded security)
 */
export async function needsRehash(
  password: string,
  hash: string
): Promise<boolean> {
  // bcrypt.compare will rehash if needed internally
  // We just check if the hash uses the current cost
  const hashRounds = getHashRounds(hash);
  return hashRounds !== rounds;
}

/**
 * Extract the cost factor from a bcrypt hash
 */
function getHashRounds(hash: string): number {
  // bcrypt hash format: $2a$12$... where 12 is the cost
  const match = hash.match(/\$2[aby]\$(\d+)\$/);
  if (match) {
    return parseInt(match[1], 10);
  }
  return 0;
}

export { bcrypt };
