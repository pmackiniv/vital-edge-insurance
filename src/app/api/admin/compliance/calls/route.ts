import { NextResponse } from "next/server";
import { requireAdminKey } from "@/lib/adminAuth";
import { ensureComplianceTables } from "@/lib/compliance/db";
import { getPersistenceMode, getPrismaClient } from "@/lib/prisma";

type CallAuditRecord = {
  id: string;
  timestamp: string;
  callId: string;
  product: string;
  discussionStage: string;
  actorId: string;
  actorRole: string;
  allowed: boolean;
  blockCode: string | null;
  requiredOwner: boolean;
  recordingRequired: boolean;
  callRecordingConsent: boolean;
  soaOnFile: boolean;
};

function toCsv(records: CallAuditRecord[]): string {
  const headers = [
    "timestamp",
    "call_id",
    "product",
    "discussion_stage",
    "actor_id",
    "actor_role",
    "allowed",
    "block_code",
    "required_owner",
    "recording_required",
    "call_recording_consent",
    "soa_on_file",
  ];

  const lines = [headers.join(",")];
  for (const row of records) {
    const values = [
      row.timestamp,
      row.callId,
      row.product,
      row.discussionStage,
      row.actorId,
      row.actorRole,
      String(row.allowed),
      row.blockCode || "",
      String(row.requiredOwner),
      String(row.recordingRequired),
      String(row.callRecordingConsent),
      String(row.soaOnFile),
    ].map((value) => `"${value.replaceAll("\"", "\"\"")}"`);
    lines.push(values.join(","));
  }
  return lines.join("\n");
}

export async function GET(req: Request) {
  const auth = requireAdminKey(req);
  if (!auth.ok) {
    return NextResponse.json(auth.body, { status: auth.status });
  }

  const prisma = getPrismaClient();
  const persistenceMode = getPersistenceMode();
  if (!prisma) {
    return NextResponse.json({ ok: true, calls: [], count: 0, persistenceMode });
  }

  await ensureComplianceTables();

  const url = new URL(req.url);
  const limit = Math.min(Number(url.searchParams.get("limit")) || 200, 2000);
  const stage = url.searchParams.get("stage")?.trim() || undefined;
  const callId = url.searchParams.get("callId")?.trim() || undefined;
  const product = url.searchParams.get("product")?.trim() || undefined;
  const status = url.searchParams.get("status")?.trim() || undefined;
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const format = (url.searchParams.get("format") || "json").toLowerCase();

  const rows = await prisma.callComplianceAudit.findMany({
    where: {
      ...(stage ? { discussionStage: stage } : {}),
      ...(callId ? { callId } : {}),
      ...(product ? { product } : {}),
      ...(status === "ok" ? { allowed: true } : {}),
      ...(status === "failed" ? { allowed: false } : {}),
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

  const records: CallAuditRecord[] = rows.map((row: (typeof rows)[number]) => ({
    id: row.id,
    timestamp: row.timestamp.toISOString(),
    callId: row.callId,
    product: row.product,
    discussionStage: row.discussionStage,
    actorId: row.actorId,
    actorRole: row.actorRole,
    allowed: row.allowed,
    blockCode: row.blockCode,
    requiredOwner: row.requiredOwner,
    recordingRequired: row.recordingRequired,
    callRecordingConsent: row.callRecordingConsent,
    soaOnFile: row.soaOnFile,
  }));

  if (format === "csv") {
    return new NextResponse(toCsv(records), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="call-compliance-audits-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  return NextResponse.json({ ok: true, count: records.length, calls: records, persistenceMode });
}
