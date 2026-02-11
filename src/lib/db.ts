import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __veAdminDb: PrismaClient | undefined;
}

function normalizeUrl(value: string | undefined): string {
  return String(value || "").trim();
}

export function resolveDatabaseUrl(): string {
  const direct = normalizeUrl(process.env.DATABASE_URL);
  if (direct) return direct;

  const neon = normalizeUrl(process.env.NEON_DATABASE_URL);
  if (neon) {
    process.env.DATABASE_URL = neon;
    return neon;
  }

  return "";
}

export function getDb(): PrismaClient | null {
  const dbUrl = resolveDatabaseUrl();
  if (!dbUrl) return null;

  if (!globalThis.__veAdminDb) {
    globalThis.__veAdminDb = new PrismaClient();
  }

  return globalThis.__veAdminDb;
}
