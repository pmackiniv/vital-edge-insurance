import { createHash, randomUUID } from "node:crypto";
import type {
  ApproverRole,
  Cadence,
  DecisionType,
  Prisma,
  PrismaClient,
  TaskStatus,
} from "@prisma/client";
import { getDb } from "@/lib/db";

export type AdminDb = PrismaClient;

export function requireDb(): AdminDb {
  const db = getDb();
  if (!db) {
    throw new Error("Admin database is not configured. Set DATABASE_URL or NEON_DATABASE_URL.");
  }
  return db;
}

function normalizeEmail(value: string): string {
  return String(value || "").trim().toLowerCase();
}

function sha256(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}

type ParsedBootstrap = { email: string; role: ApproverRole };

function parseBootstrapApprovers(): ParsedBootstrap[] {
  const raw = String(process.env.ADMIN_UI_BOOTSTRAP_APPROVERS || "").trim();
  if (!raw) return [];

  const items = raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  return items.map((entry, index) => {
    const [emailRaw, roleRaw] = entry.split(":").map((part) => part.trim());
    const email = normalizeEmail(emailRaw);
    const role = roleRaw === "OWNER" || roleRaw === "ADMIN" || roleRaw === "VIEWER"
      ? roleRaw
      : (index === 0 ? "OWNER" : "ADMIN");

    return { email, role } as ParsedBootstrap;
  });
}

export async function ensureBootstrapApprovers(db: AdminDb): Promise<void> {
  const bootstrap = parseBootstrapApprovers();
  if (bootstrap.length === 0) return;

  for (const entry of bootstrap) {
    const existing = await db.approver.findUnique({ where: { email: entry.email } });
    if (existing) continue;

    await db.approver.create({
      data: {
        id: randomUUID(),
        email: entry.email,
        role: entry.role,
      },
    });
  }
}

export async function getApproverByEmail(db: AdminDb, email: string) {
  await ensureBootstrapApprovers(db);
  const normalized = normalizeEmail(email);
  if (!normalized) return null;
  return db.approver.findUnique({ where: { email: normalized } });
}

export function canWriteArtifacts(role: ApproverRole): boolean {
  return role === "OWNER" || role === "ADMIN";
}

export async function listInboxArtifacts(db: AdminDb) {
  return db.artifact.findMany({
    where: { status: "PENDING" },
    include: {
      decisions: {
        orderBy: { decidedAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getArtifactDetail(db: AdminDb, id: string) {
  return db.artifact.findUnique({
    where: { id },
    include: {
      decisions: {
        orderBy: { decidedAt: "desc" },
      },
      handoffTasks: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function listRunArtifacts(db: AdminDb, cadence: Cadence, periodKey: string) {
  const run = await db.run.findFirst({
    where: { cadence, periodKey },
    orderBy: { runDate: "desc" },
  });

  const artifacts = await db.artifact.findMany({
    where: {
      cadence,
      periodKey,
    },
    orderBy: [{ createdAt: "desc" }, { artifactType: "asc" }],
  });

  const tasks = await db.handoffTask.findMany({
    where: { periodKey },
    orderBy: { createdAt: "asc" },
  });

  return { run, artifacts, tasks };
}

export async function listRunPeriods(db: AdminDb, cadence: Cadence) {
  return db.run.findMany({
    where: { cadence },
    orderBy: [{ runDate: "desc" }, { createdAt: "desc" }],
    take: 24,
  });
}

export async function getSettingsSummary(db: AdminDb) {
  const [approvers, recentRuns, artifacts] = await Promise.all([
    db.approver.findMany({ orderBy: [{ role: "asc" }, { email: "asc" }] }),
    db.run.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
    db.artifact.findMany({
      select: { artifactType: true },
      orderBy: { artifactType: "asc" },
    }),
  ]);

  const coverage = new Map<string, number>();
  for (const row of artifacts) {
    coverage.set(row.artifactType, (coverage.get(row.artifactType) || 0) + 1);
  }

  const artifactCoverage = Array.from(coverage.entries())
    .map(([artifactType, count]) => ({ artifactType, count }))
    .sort((a, b) => b.count - a.count || a.artifactType.localeCompare(b.artifactType));

  return {
    approvers,
    recentRuns,
    artifactCoverage,
  };
}

export async function applyArtifactDecision(db: AdminDb, input: {
  artifactId: string;
  decision: DecisionType;
  notes: string;
  decidedBy: string;
  role: ApproverRole;
}) {
  if (!canWriteArtifacts(input.role)) {
    throw new Error("Approver role is not allowed to mutate artifact decisions.");
  }

  const status = input.decision === "APPROVE" ? "APPROVED" : "DENIED";

  return db.$transaction(async (tx) => {
    const artifact = await tx.artifact.update({
      where: { id: input.artifactId },
      data: { status },
    });

    const decision = await tx.decision.create({
      data: {
        id: randomUUID(),
        artifactId: input.artifactId,
        decision: input.decision,
        notes: input.notes,
        decidedBy: input.decidedBy,
      },
    });

    return { artifact, decision };
  });
}

export async function updateTaskStatus(db: AdminDb, input: {
  taskId: string;
  status: TaskStatus;
  role: ApproverRole;
}) {
  if (!canWriteArtifacts(input.role)) {
    throw new Error("Approver role is not allowed to update handoff tasks.");
  }

  return db.handoffTask.update({
    where: { id: input.taskId },
    data: { status: input.status },
  });
}

export function renderChecklistMarkdown(input: {
  cadence: Cadence;
  periodKey: string;
  artifacts: Array<{ artifactType: string; status: string }>;
  tasks: Array<{ title: string; status: string }>;
}): string {
  const lines: string[] = [
    `# GBP Handoff Checklist Export (${input.cadence} | ${input.periodKey})`,
    "",
    "## Artifact statuses",
  ];

  if (input.artifacts.length === 0) {
    lines.push("- No artifacts found for this run.");
  } else {
    for (const artifact of input.artifacts) {
      lines.push(`- ${artifact.artifactType}: ${artifact.status}`);
    }
  }

  lines.push("");
  lines.push("## Task statuses");

  if (input.tasks.length === 0) {
    lines.push("- No handoff tasks found.");
  } else {
    for (const task of input.tasks) {
      lines.push(`- ${task.title}: ${task.status}`);
    }
  }

  return `${lines.join("\n")}\n`;
}

export async function exportChecklistArtifact(db: AdminDb, input: {
  cadence: Cadence;
  periodKey: string;
  runDate: Date;
  decidedBy: string;
  role: ApproverRole;
}) {
  if (!canWriteArtifacts(input.role)) {
    throw new Error("Approver role is not allowed to export checklists.");
  }

  const [artifacts, tasks] = await Promise.all([
    db.artifact.findMany({
      where: { cadence: input.cadence, periodKey: input.periodKey },
      orderBy: { createdAt: "desc" },
      select: { artifactType: true, status: true },
    }),
    db.handoffTask.findMany({
      where: { periodKey: input.periodKey },
      orderBy: { createdAt: "asc" },
      select: { title: true, status: true },
    }),
  ]);

  const markdown = renderChecklistMarkdown({
    cadence: input.cadence,
    periodKey: input.periodKey,
    artifacts,
    tasks,
  });

  const record = await db.artifact.create({
    data: {
      id: randomUUID(),
      runDate: input.runDate,
      cadence: input.cadence,
      periodKey: input.periodKey,
      artifactType: "gbp.handoff-checklist.export.md",
      relativePath: `exports/${input.periodKey}/gbp.handoff-checklist.export.md`,
      sha256: sha256(markdown),
      contentText: markdown,
      contentJson: undefined,
      scorecardJson: undefined,
      status: "PENDING",
      source: "gbp-v2-admin",
      meta: {
        exportedBy: input.decidedBy,
      } satisfies Prisma.JsonObject,
    },
  });

  await db.decision.create({
    data: {
      id: randomUUID(),
      artifactId: record.id,
      decision: "APPROVE",
      notes: "Checklist export generated.",
      decidedBy: input.decidedBy,
    },
  });

  return record;
}
