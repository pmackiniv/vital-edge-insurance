import { NextResponse } from "next/server";
import { requireAdminKey } from "@/lib/adminAuth";
import { ensureComplianceTables } from "@/lib/compliance/db";
import { getPersistenceMode, getPrismaClient } from "@/lib/prisma";

type LeadAuditRecord = {
  id: string;
  timestamp: string;
  leadRequestId: string;
  leadTransferDisclosureAck: boolean;
  dataSharingConsent: boolean;
  dataSharingEntities: string[];
  beneficiaryInitiated: boolean;
  sourceRoute: string;
  zip: string | null;
  productInterest: string | null;
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

function toCsv(records: LeadAuditRecord[]): string {
  const headers = [
    "timestamp",
    "lead_request_id",
    "lead_transfer_disclosure_ack",
    "data_sharing_consent",
    "data_sharing_entities",
    "beneficiary_initiated",
    "source_route",
    "zip",
    "product_interest",
  ];

  const lines = [headers.join(",")];
  for (const row of records) {
    const values = [
      row.timestamp,
      row.leadRequestId,
      String(row.leadTransferDisclosureAck),
      String(row.dataSharingConsent),
      row.dataSharingEntities.join("|"),
      String(row.beneficiaryInitiated),
      row.sourceRoute,
      row.zip || "",
      row.productInterest || "",
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
    return NextResponse.json({ ok: true, leads: [], count: 0, persistenceMode });
  }

  await ensureComplianceTables();

  const url = new URL(req.url);
  const limit = Math.min(Number(url.searchParams.get("limit")) || 200, 2000);
  const leadRequestId = url.searchParams.get("leadRequestId")?.trim() || undefined;
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const format = (url.searchParams.get("format") || "json").toLowerCase();

  const rows = await prisma.leadDisclosureAudit.findMany({
    where: {
      ...(leadRequestId ? { leadRequestId } : {}),
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

  const records: LeadAuditRecord[] = rows.map((row: (typeof rows)[number]) => ({
    id: row.id,
    timestamp: row.timestamp.toISOString(),
    leadRequestId: row.leadRequestId,
    leadTransferDisclosureAck: row.leadTransferDisclosureAck,
    dataSharingConsent: row.dataSharingConsent,
    dataSharingEntities: parseJsonArray(row.dataSharingEntitiesJson),
    beneficiaryInitiated: row.beneficiaryInitiated,
    sourceRoute: row.sourceRoute,
    zip: row.zip,
    productInterest: row.productInterest,
  }));

  if (format === "csv") {
    return new NextResponse(toCsv(records), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="lead-disclosure-audits-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  return NextResponse.json({ ok: true, count: records.length, leads: records, persistenceMode });
}
