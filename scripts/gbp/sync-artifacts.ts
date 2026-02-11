// @ts-nocheck
import { createHash, randomUUID } from "node:crypto";
import { execSync } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { Prisma } from "@prisma/client";
import { getDb } from "../../src/lib/db";

type CadenceArg = "weekly" | "monthly";
type DbCadence = "WEEKLY" | "MONTHLY";

type SyncOptions = {
  root: string;
  cadence: CadenceArg;
  period: string;
  date: string;
};

type ParsedArgs = SyncOptions;

type ArtifactPayload = {
  fileName: string;
  absolutePath: string;
  relativePath: string;
  sha256: string;
  contentText: string | null;
  contentJson: Prisma.JsonValue | null;
  scorecardJson: Prisma.JsonValue | null;
  meta: Prisma.InputJsonValue;
};

type IngestStats = {
  inserted: number;
  skipped: number;
  errors: string[];
  missingExpectedFiles: string[];
};

type ShaStore<T> = {
  hasSha: (sha: string) => Promise<boolean>;
  insert: (entry: T) => Promise<void>;
};

const WEEKLY_EXPECTED = [
  "gbp.weekly-performance-memo.md",
  "gbp.review-response-library.md",
  "gbp.posts.md",
  "gbp.visual-shot-list.md",
  "gbp.handoff.weekly.md",
] as const;

const MONTHLY_EXPECTED = [
  "gbp.audit-a-access.md",
  "gbp.audit-b-business-info.md",
  "gbp.audit-c-sab.md",
  "gbp.audit-d-reviews.md",
  "gbp.audit-e-content.md",
  "gbp.audit-f-performance.md",
  "gbp.audit-scorecard.md",
  "gbp.fix-list.roi.md",
  "gbp.30-day-ops-plan.md",
  "gbp.handoff.monthly.md",
] as const;

function normalizeDate(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`Invalid date '${value}'. Expected YYYY-MM-DD.`);
  }
  return value;
}

function toCadenceEnum(value: CadenceArg): DbCadence {
  return value === "weekly" ? "WEEKLY" : "MONTHLY";
}

export function expectedArtifacts(cadence: CadenceArg): string[] {
  return cadence === "weekly" ? [...WEEKLY_EXPECTED] : [...MONTHLY_EXPECTED];
}

export function computeSha256(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}

export function parseHandoffTasks(markdown: string): string[] {
  const lines = markdown.split(/\r?\n/);
  const tasks: string[] = [];
  let inSection = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (/^##\s+Required manual actions/i.test(line)) {
      inSection = true;
      continue;
    }

    if (inSection && /^##\s+/.test(line)) {
      break;
    }

    if (!inSection) continue;

    if (line.startsWith("- ")) {
      const task = line.slice(2).trim();
      if (task) tasks.push(task);
    }
  }

  return tasks;
}

export function missingExpected(expected: string[], available: string[]): string[] {
  const present = new Set(available);
  return expected.filter((name) => !present.has(name));
}

function parseArgs(argv: string[]): ParsedArgs {
  const args = argv.slice(2);
  const parsed: Partial<ParsedArgs> = {
    date: new Date().toISOString().slice(0, 10),
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    const value = args[i + 1];

    if (arg === "--root") {
      parsed.root = value;
      i += 1;
      continue;
    }

    if (arg === "--cadence") {
      if (value !== "weekly" && value !== "monthly") {
        throw new Error("--cadence must be one of: weekly, monthly");
      }
      parsed.cadence = value;
      i += 1;
      continue;
    }

    if (arg === "--period") {
      parsed.period = value;
      i += 1;
      continue;
    }

    if (arg === "--date") {
      parsed.date = value;
      i += 1;
      continue;
    }
  }

  if (!parsed.root) throw new Error("Missing required argument --root");
  if (!parsed.cadence) throw new Error("Missing required argument --cadence");
  if (!parsed.period) throw new Error("Missing required argument --period");

  return {
    root: path.resolve(parsed.root),
    cadence: parsed.cadence,
    period: parsed.period,
    date: normalizeDate(parsed.date || new Date().toISOString().slice(0, 10)),
  };
}

function resolveArtifactDir(root: string, cadence: CadenceArg, period: string): string {
  const folder = cadence === "weekly" ? "weekly" : "monthly";
  return path.join(root, folder, period);
}

function toDateOnly(date: string): Date {
  return new Date(`${date}T00:00:00.000Z`);
}

function toRelativePath(filePath: string): string {
  return path.relative(process.cwd(), filePath).replace(/\\/g, "/");
}

function safeGitCommit(): string | null {
  try {
    return execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return null;
  }
}

export function parseArtifactContent(fileName: string, raw: string): {
  contentText: string | null;
  contentJson: Prisma.JsonValue | null;
  scorecardJson: Prisma.JsonValue | null;
} {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".md")) {
    return {
      contentText: raw,
      contentJson: null,
      scorecardJson: null,
    };
  }

  if (lower.endsWith(".json")) {
    const parsed = JSON.parse(raw) as Prisma.JsonValue;
    const isScorecard = fileName.includes("scorecard");
    return {
      contentText: null,
      contentJson: parsed,
      scorecardJson: isScorecard ? parsed : null,
    };
  }

  throw new Error(`Unsupported artifact file extension for ${fileName}`);
}

export async function upsertBySha<T extends { sha256: string }>(
  entries: T[],
  store: ShaStore<T>,
): Promise<{ inserted: number; skipped: number }> {
  let inserted = 0;
  let skipped = 0;

  for (const entry of entries) {
    const exists = await store.hasSha(entry.sha256);
    if (exists) {
      skipped += 1;
      continue;
    }

    await store.insert(entry);
    inserted += 1;
  }

  return { inserted, skipped };
}

async function collectArtifacts(directory: string): Promise<ArtifactPayload[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => name.endsWith(".md") || name.endsWith(".json"))
    .sort();

  const payloads: ArtifactPayload[] = [];

  for (const fileName of files) {
    const absolutePath = path.join(directory, fileName);
    const raw = await readFile(absolutePath, "utf8");
    const parsed = parseArtifactContent(fileName, raw);

    payloads.push({
      fileName,
      absolutePath,
      relativePath: toRelativePath(absolutePath),
      sha256: computeSha256(raw),
      contentText: parsed.contentText,
      contentJson: parsed.contentJson,
      scorecardJson: parsed.scorecardJson,
      meta: {
        bytes: Buffer.byteLength(raw),
        extension: path.extname(fileName).slice(1),
      },
    });
  }

  return payloads;
}

export async function runSyncArtifacts(options: SyncOptions): Promise<IngestStats> {
  const db = getDb();
  if (!db) {
    throw new Error("DATABASE_URL or NEON_DATABASE_URL is required for gbp:sync.");
  }

  const artifactDir = resolveArtifactDir(options.root, options.cadence, options.period);
  const payloads = await collectArtifacts(artifactDir);
  const availableNames = payloads.map((entry) => entry.fileName);
  const expected = expectedArtifacts(options.cadence);
  const missingExpectedFiles = missingExpected(expected, availableNames);

  let inserted = 0;
  let skipped = 0;
  const errors: string[] = [];
  const upserted = await upsertBySha(payloads, {
    hasSha: async (sha) => {
      const existing = await db.artifact.findUnique({ where: { sha256: sha } });
      return Boolean(existing);
    },
    insert: async (payload) => {
      const created = await db.artifact.create({
        data: {
          id: randomUUID(),
          runDate: toDateOnly(options.date),
          cadence: toCadenceEnum(options.cadence),
          periodKey: options.period,
          artifactType: payload.fileName,
          relativePath: payload.relativePath,
          sha256: payload.sha256,
          contentText: payload.contentText,
          contentJson: payload.contentJson ?? undefined,
          scorecardJson: payload.scorecardJson ?? undefined,
          status: "PENDING",
          source: "gbp-v2",
          meta: payload.meta,
        },
      });

      if (payload.fileName === "gbp.handoff.weekly.md" || payload.fileName === "gbp.handoff.monthly.md") {
        const tasks = parseHandoffTasks(payload.contentText || "");
        for (const title of tasks) {
          const exists = await db.handoffTask.findFirst({
            where: {
              periodKey: options.period,
              title,
              linkedArtifactId: created.id,
            },
          });

          if (exists) continue;

          await db.handoffTask.create({
            data: {
              id: randomUUID(),
              periodKey: options.period,
              title,
              stepsJson: { steps: [title] },
              status: "PENDING",
              linkedArtifactId: created.id,
            },
          });
        }
      }
    },
  });
  inserted = upserted.inserted;
  skipped = upserted.skipped;

  const runResult = errors.length > 0 || missingExpectedFiles.length > 0 ? "FAIL" : "PASS";
  const summary = `inserted=${inserted}; skipped=${skipped}; missingExpected=${missingExpectedFiles.length}; errors=${errors.length}`;

  await db.run.upsert({
    where: {
      cadence_periodKey_runDate: {
        cadence: toCadenceEnum(options.cadence),
        periodKey: options.period,
        runDate: toDateOnly(options.date),
      },
    },
    update: {
      result: runResult,
      summary,
      gitCommit: safeGitCommit(),
      packetDir: null,
      strict: false,
    },
    create: {
      id: randomUUID(),
      cadence: toCadenceEnum(options.cadence),
      periodKey: options.period,
      runDate: toDateOnly(options.date),
      packetDir: null,
      gitCommit: safeGitCommit(),
      strict: false,
      result: runResult,
      summary,
    },
  });

  return {
    inserted,
    skipped,
    errors,
    missingExpectedFiles,
  };
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv);
  const result = await runSyncArtifacts(options);
  const output = {
    ok: result.errors.length === 0,
    ...result,
    cadence: options.cadence,
    period: options.period,
    root: options.root,
    date: options.date,
  };

  console.log(JSON.stringify(output, null, 2));

  if (result.errors.length > 0) {
    process.exitCode = 1;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(JSON.stringify({ ok: false, error: message }));
    process.exitCode = 1;
  });
}
