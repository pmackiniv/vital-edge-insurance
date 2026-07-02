import { NextResponse } from "next/server";
import { requireAdminKey } from "@/lib/adminAuth";
import { ensureComplianceTables } from "@/lib/compliance/db";
import { getPersistenceMode, getPrismaClient } from "@/lib/prisma";

type LeadAuditRecord = {
  id: string;
  timestamp: string;
  leadRequestId: string;
  leadTransferDisclosureAck: boolean;
  permissionToContact: boolean;
  permissionToContactMethod: string | null;
  permissionToContactText: string | null;
  permissionToContactVersion: string | null;
  automatedContactConsent: boolean;
  automatedContactConsentText: string | null;
  automatedContactConsentVersion: string | null;
  dataSharingConsent: boolean;
  dataSharingEntities: string[];
  beneficiaryInitiated: boolean;
  sourceRoute: string;
  leadSource: string | null;
  pageSource: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  linkedinReferral: boolean;
  eventReferral: boolean;
  partnerReferral: boolean;
  leadCategory: string | null;
  state: string | null;
  zip: string | null;
  productInterest: string | null;
  consentTimestamp: string | null;
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
    "permission_to_contact",
    "permission_to_contact_method",
    "permission_to_contact_text",
    "permission_to_contact_version",
    "automated_contact_consent",
    "automated_contact_consent_text",
    "automated_contact_consent_version",
    "data_sharing_consent",
    "data_sharing_entities",
    "beneficiary_initiated",
    "source_route",
    "lead_source",
    "page_source",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "linkedin_referral",
    "event_referral",
    "partner_referral",
    "lead_category",
    "state",
    "zip",
    "product_interest",
    "consent_timestamp",
  ];

  const lines = [headers.join(",")];
  for (const row of records) {
    const values = [
      row.timestamp,
      row.leadRequestId,
      String(row.leadTransferDisclosureAck),
      String(row.permissionToContact),
      row.permissionToContactMethod || "",
      row.permissionToContactText || "",
      row.permissionToContactVersion || "",
      String(row.automatedContactConsent),
      row.automatedContactConsentText || "",
      row.automatedContactConsentVersion || "",
      String(row.dataSharingConsent),
      row.dataSharingEntities.join("|"),
      String(row.beneficiaryInitiated),
      row.sourceRoute,
      row.leadSource || "",
      row.pageSource || "",
      row.utmSource || "",
      row.utmMedium || "",
      row.utmCampaign || "",
      String(row.linkedinReferral),
      String(row.eventReferral),
      String(row.partnerReferral),
      row.leadCategory || "",
      row.state || "",
      row.zip || "",
      row.productInterest || "",
      row.consentTimestamp || "",
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
    permissionToContact: row.permissionToContact,
    permissionToContactMethod: row.permissionToContactMethod,
    permissionToContactText: row.permissionToContactText,
    permissionToContactVersion: row.permissionToContactVersion,
    automatedContactConsent: row.automatedContactConsent,
    automatedContactConsentText: row.automatedContactConsentText,
    automatedContactConsentVersion: row.automatedContactConsentVersion,
    dataSharingConsent: row.dataSharingConsent,
    dataSharingEntities: parseJsonArray(row.dataSharingEntitiesJson),
    beneficiaryInitiated: row.beneficiaryInitiated,
    sourceRoute: row.sourceRoute,
    leadSource: row.leadSource,
    pageSource: row.pageSource,
    utmSource: row.utmSource,
    utmMedium: row.utmMedium,
    utmCampaign: row.utmCampaign,
    linkedinReferral: row.linkedinReferral,
    eventReferral: row.eventReferral,
    partnerReferral: row.partnerReferral,
    leadCategory: row.leadCategory,
    state: row.state,
    zip: row.zip,
    productInterest: row.productInterest,
    consentTimestamp: row.consentTimestamp?.toISOString() || null,
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
