import { PrismaClient } from "@prisma/client";

declare global {
  var __vePrisma: PrismaClient | undefined;
}

export type PersistenceMode = "database" | "ephemeral";

/**
 * Return a Prisma client only when DATABASE_URL is configured.
 * This keeps production/local behavior fail-open for non-critical admin observability.
 */
export function getPrismaClient(): PrismaClient | null {
  if (!process.env.DATABASE_URL?.trim()) return null;

  if (!globalThis.__vePrisma) {
    globalThis.__vePrisma = new PrismaClient();
  }
  return globalThis.__vePrisma;
}

export function getPersistenceMode(): PersistenceMode {
  return process.env.DATABASE_URL?.trim() ? "database" : "ephemeral";
}
