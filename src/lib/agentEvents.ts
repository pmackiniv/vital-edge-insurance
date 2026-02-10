import { getPrismaClient } from "@/lib/prisma";

export type AgentEventType =
  | "draft_created"
  | "handoff_sent"
  | "lead_received"
  | "agent_error"
  | "agent_status_check"
  | "compliance_check"
  | "tpmo_count_lookup";

export type AgentEventStatus = "ok" | "failed" | "skipped";

export type AgentEvent = {
  timestamp: string;
  event_type: AgentEventType | string;
  agent_name?: string;
  request_id?: string;
  summary: string;
  status: AgentEventStatus | string;
  meta?: Record<string, unknown>;
  route?: string;
  compliance_result?: "pass" | "block" | "review" | "none" | string;
};

export type GetAgentEventsOptions = {
  limit?: number;
  type?: string;
  status?: string;
  from?: string;
  to?: string;
};

const maxEvents = 500;
const fallbackEvents: AgentEvent[] = [];
let tableInitPromise: Promise<void> | null = null;

function toIsoOrNull(value: string | undefined): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function toDateOrNull(value: string | undefined): Date | null {
  const iso = toIsoOrNull(value);
  return iso ? new Date(iso) : null;
}

function pushFallback(event: AgentEvent) {
  fallbackEvents.push(event);
  if (fallbackEvents.length > maxEvents) {
    fallbackEvents.splice(0, fallbackEvents.length - maxEvents);
  }
}

function mapDbEvent(row: {
  timestamp: Date;
  eventType: string;
  agentName: string | null;
  requestId: string | null;
  summary: string;
  status: string;
  metaJson: unknown;
  route: string | null;
  complianceResult: string | null;
}): AgentEvent {
  const maybeMeta = row.metaJson;
  const meta = maybeMeta && typeof maybeMeta === "object" && !Array.isArray(maybeMeta)
    ? (maybeMeta as Record<string, unknown>)
    : undefined;

  return {
    timestamp: row.timestamp.toISOString(),
    event_type: row.eventType,
    agent_name: row.agentName || undefined,
    request_id: row.requestId || undefined,
    summary: row.summary,
    status: row.status,
    meta,
    route: row.route || undefined,
    compliance_result: row.complianceResult || undefined,
  };
}

function parseMeta(meta: AgentEvent["meta"]): any {
  if (!meta) return undefined;
  // Normalize unknown values into JSON-compatible data for Prisma Json fields.
  return JSON.parse(JSON.stringify(meta));
}

async function ensureAgentEventTable() {
  const prisma = getPrismaClient();
  if (!prisma) return;

  if (!tableInitPromise) {
    tableInitPromise = (async () => {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "AgentEvent" (
          "id" TEXT PRIMARY KEY NOT NULL,
          "timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "eventType" TEXT NOT NULL,
          "status" TEXT NOT NULL,
          "agentName" TEXT,
          "requestId" TEXT,
          "summary" TEXT NOT NULL,
          "metaJson" TEXT,
          "route" TEXT,
          "complianceResult" TEXT
        )
      `);
      await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "AgentEvent_timestamp_idx" ON "AgentEvent"("timestamp")`);
      await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "AgentEvent_eventType_status_idx" ON "AgentEvent"("eventType", "status")`);
      await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "AgentEvent_requestId_idx" ON "AgentEvent"("requestId")`);
    })().catch((error) => {
      tableInitPromise = null;
      throw error;
    });
  }

  await tableInitPromise;
}

export async function appendAgentEvent(event: Omit<AgentEvent, "timestamp">): Promise<void> {
  const timestamp = new Date().toISOString();
  const normalized: AgentEvent = { ...event, timestamp };
  const prisma = getPrismaClient();

  if (!prisma) {
    pushFallback(normalized);
    return;
  }

  try {
    await ensureAgentEventTable();
    await prisma.agentEvent.create({
      data: {
        timestamp: new Date(timestamp),
        eventType: String(event.event_type),
        agentName: event.agent_name || null,
        requestId: event.request_id || null,
        summary: event.summary,
        status: String(event.status),
        metaJson: parseMeta(event.meta),
        route: event.route || null,
        complianceResult: event.compliance_result || null,
      },
    });
  } catch (error) {
    console.warn("agent_event_persist_failed", {
      reason: error instanceof Error ? error.message : String(error),
      eventType: event.event_type,
    });
    pushFallback(normalized);
  }
}

export async function getAgentEvents(options: GetAgentEventsOptions = {}): Promise<AgentEvent[]> {
  const limit = Math.min(Math.max(Number(options.limit) || 100, 1), 500);
  const prisma = getPrismaClient();
  const fromDate = toDateOrNull(options.from);
  const toDate = toDateOrNull(options.to);

  if (!prisma) {
    return fallbackEvents
      .slice()
      .reverse()
      .filter((evt) => {
        if (options.type && evt.event_type !== options.type) return false;
        if (options.status && evt.status !== options.status) return false;
        if (fromDate && new Date(evt.timestamp).getTime() < fromDate.getTime()) return false;
        if (toDate && new Date(evt.timestamp).getTime() > toDate.getTime()) return false;
        return true;
      })
      .slice(0, limit);
  }

  try {
    await ensureAgentEventTable();
    const rows = await prisma.agentEvent.findMany({
      where: {
        ...(options.type ? { eventType: options.type } : {}),
        ...(options.status ? { status: options.status } : {}),
        ...((fromDate || toDate)
          ? {
              timestamp: {
                ...(fromDate ? { gte: fromDate } : {}),
                ...(toDate ? { lte: toDate } : {}),
              },
            }
          : {}),
      },
      orderBy: { timestamp: "desc" },
      take: limit,
    });

    return rows.map(mapDbEvent);
  } catch (error) {
    console.warn("agent_event_query_failed", {
      reason: error instanceof Error ? error.message : String(error),
    });
    return fallbackEvents.slice(-limit).reverse();
  }
}

function csvCell(value: unknown): string {
  const raw = value == null ? "" : String(value);
  const escaped = raw.replaceAll("\"", "\"\"");
  return `"${escaped}"`;
}

export function agentEventsToCsv(events: AgentEvent[]): string {
  const headers = [
    "timestamp",
    "event_type",
    "status",
    "agent_name",
    "request_id",
    "summary",
    "route",
    "compliance_result",
    "meta_json",
  ];
  const lines = [headers.join(",")];

  for (const evt of events) {
    lines.push(
      [
        csvCell(evt.timestamp),
        csvCell(evt.event_type),
        csvCell(evt.status),
        csvCell(evt.agent_name || ""),
        csvCell(evt.request_id || ""),
        csvCell(evt.summary),
        csvCell(evt.route || ""),
        csvCell(evt.compliance_result || ""),
        csvCell(evt.meta ? JSON.stringify(evt.meta) : ""),
      ].join(","),
    );
  }

  return lines.join("\n");
}
