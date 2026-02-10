import { NextResponse } from "next/server";
import { requireAdminKey } from "@/lib/adminAuth";
import { getPersistenceMode, getPrismaClient } from "@/lib/prisma";
import { ensureTpmoTables } from "@/lib/tpmo/db";

type LookupRecord = {
  id: string;
  timestamp: string;
  zip: string;
  planYear: number;
  orgCount: number;
  planCount: number;
  organizations: string[];
  source: string;
  datasetVersion: string;
  aliasMapVersion: string;
  callId: string;
  discussionStage: string;
  actorId: string;
  actorRole: string;
};

function parseJsonArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((item) => String(item));
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (Array.isArray(parsed)) return parsed.map((item) => String(item));
    } catch {
      return [];
    }
  }
  return [];
}

function parseJsonObject(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      return {};
    }
  }
  return {};
}

function toCsv(records: LookupRecord[]): string {
  const rows = [
    [
      "timestamp",
      "zip",
      "plan_year",
      "org_count",
      "plan_count",
      "organizations",
      "source",
      "dataset_version",
      "alias_map_version",
      "call_id",
      "discussion_stage",
      "actor_id",
      "actor_role",
    ].join(","),
  ];

  for (const row of records) {
    const values = [
      row.timestamp,
      row.zip,
      String(row.planYear),
      String(row.orgCount),
      String(row.planCount),
      row.organizations.join("|"),
      row.source,
      row.datasetVersion,
      row.aliasMapVersion,
      row.callId,
      row.discussionStage,
      row.actorId,
      row.actorRole,
    ].map((value) => `"${String(value).replaceAll("\"", "\"\"")}"`);
    rows.push(values.join(","));
  }

  return rows.join("\n");
}

export async function GET(req: Request) {
  const auth = requireAdminKey(req);
  if (!auth.ok) {
    return NextResponse.json(auth.body, { status: auth.status });
  }

  const prisma = getPrismaClient();
  const persistenceMode = getPersistenceMode();
  if (!prisma) {
    return NextResponse.json({ ok: true, lookups: [], count: 0, persistenceMode });
  }

  await ensureTpmoTables();

  const url = new URL(req.url);
  const limit = Math.min(Number(url.searchParams.get("limit")) || 200, 2000);
  const zip = (url.searchParams.get("zip") || "").replace(/\D/g, "").slice(0, 5) || undefined;
  const status = (url.searchParams.get("status") || "").toLowerCase().trim();
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const format = (url.searchParams.get("format") || "json").toLowerCase();

  if (status === "failed") {
    return NextResponse.json({ ok: true, count: 0, lookups: [], persistenceMode });
  }

  const rows = await prisma.tpmoCountLookupLog.findMany({
    where: {
      ...(zip ? { zip } : {}),
      ...((from || to)
        ? {
            timestamp: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
    },
    orderBy: { timestamp: "desc" },
    take: limit,
  });

  const records: LookupRecord[] = rows.map((row: (typeof rows)[number]) => {
    const context = parseJsonObject(row.requestContextJson);
    return {
      id: row.id,
      timestamp: row.timestamp.toISOString(),
      zip: row.zip,
      planYear: row.planYear,
      orgCount: row.orgCount,
      planCount: row.planCount,
      organizations: parseJsonArray(row.orgsJson),
      source: row.source,
      datasetVersion: row.datasetVersion,
      aliasMapVersion: row.aliasMapVersion,
      callId: String(context.callId || ""),
      discussionStage: String(context.discussionStage || ""),
      actorId: String(context.actorId || ""),
      actorRole: String(context.actorRole || ""),
    };
  });

  if (format === "csv") {
    return new NextResponse(toCsv(records), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="tpmo-lookups-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  return NextResponse.json({
    ok: true,
    count: records.length,
    lookups: records,
    persistenceMode,
  });
}
