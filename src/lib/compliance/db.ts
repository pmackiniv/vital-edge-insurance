import { getPrismaClient } from "@/lib/prisma";

const complianceInitByUrl = new Map<string, Promise<void>>();

export async function ensureComplianceTables(): Promise<void> {
  const prisma = getPrismaClient();
  const dbUrl = process.env.DATABASE_URL?.trim();
  if (!prisma || !dbUrl) return;

  if (!complianceInitByUrl.has(dbUrl)) {
    complianceInitByUrl.set(
      dbUrl,
      (async () => {
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "CallComplianceAudit" (
            "id" TEXT PRIMARY KEY NOT NULL,
            "timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "callId" TEXT NOT NULL,
            "product" TEXT NOT NULL,
            "discussionStage" TEXT NOT NULL,
            "actorId" TEXT NOT NULL,
            "actorRole" TEXT NOT NULL,
            "recordingRequired" BOOLEAN NOT NULL DEFAULT FALSE,
            "callRecordingConsent" BOOLEAN NOT NULL DEFAULT FALSE,
            "callRecordingActive" BOOLEAN NOT NULL DEFAULT FALSE,
            "zip" TEXT,
            "planYear" INTEGER,
            "orgCount" INTEGER,
            "planCount" INTEGER,
            "disclaimerText" TEXT,
            "disclaimerVariant" TEXT,
            "cfuConfirmed" BOOLEAN NOT NULL DEFAULT FALSE,
            "soaOnFile" BOOLEAN NOT NULL DEFAULT FALSE,
            "soaRequestedAt" TIMESTAMP,
            "soaSignedAt" TIMESTAMP,
            "appointmentAt" TIMESTAMP,
            "soaTimingValid" BOOLEAN NOT NULL DEFAULT FALSE,
            "callRecorded" BOOLEAN NOT NULL DEFAULT FALSE,
            "retentionUntil" TIMESTAMP,
            "sourceRoute" TEXT NOT NULL,
            "allowed" BOOLEAN NOT NULL DEFAULT FALSE,
            "blockCode" TEXT,
            "requiredOwner" BOOLEAN NOT NULL DEFAULT FALSE,
            "requestContextJson" TEXT
          )
        `);
        await prisma.$executeRawUnsafe(`
          CREATE INDEX IF NOT EXISTS "CallComplianceAudit_timestamp_idx"
          ON "CallComplianceAudit"("timestamp")
        `);
        await prisma.$executeRawUnsafe(`
          CREATE INDEX IF NOT EXISTS "CallComplianceAudit_callId_idx"
          ON "CallComplianceAudit"("callId")
        `);
        await prisma.$executeRawUnsafe(`
          CREATE INDEX IF NOT EXISTS "CallComplianceAudit_stage_allowed_idx"
          ON "CallComplianceAudit"("discussionStage", "allowed")
        `);
        await prisma.$executeRawUnsafe(`
          CREATE INDEX IF NOT EXISTS "CallComplianceAudit_zip_product_idx"
          ON "CallComplianceAudit"("zip", "product")
        `);

        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "LeadDisclosureAudit" (
            "id" TEXT PRIMARY KEY NOT NULL,
            "timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "leadRequestId" TEXT NOT NULL,
            "leadTransferDisclosureAck" BOOLEAN NOT NULL DEFAULT FALSE,
            "permissionToContact" BOOLEAN NOT NULL DEFAULT FALSE,
            "permissionToContactMethod" TEXT,
            "permissionToContactText" TEXT,
            "permissionToContactVersion" TEXT,
            "automatedContactConsent" BOOLEAN NOT NULL DEFAULT FALSE,
            "automatedContactConsentText" TEXT,
            "automatedContactConsentVersion" TEXT,
            "dataSharingConsent" BOOLEAN NOT NULL DEFAULT FALSE,
            "dataSharingEntitiesJson" TEXT NOT NULL,
            "beneficiaryInitiated" BOOLEAN NOT NULL DEFAULT FALSE,
            "sourceRoute" TEXT NOT NULL,
            "leadSource" TEXT,
            "pageSource" TEXT,
            "utmSource" TEXT,
            "utmMedium" TEXT,
            "utmCampaign" TEXT,
            "linkedinReferral" BOOLEAN NOT NULL DEFAULT FALSE,
            "eventReferral" BOOLEAN NOT NULL DEFAULT FALSE,
            "partnerReferral" BOOLEAN NOT NULL DEFAULT FALSE,
            "leadCategory" TEXT,
            "state" TEXT,
            "zip" TEXT,
            "productInterest" TEXT,
            "consentTimestamp" TIMESTAMP
          )
        `);
        await prisma.$executeRawUnsafe(`ALTER TABLE "LeadDisclosureAudit" ADD COLUMN IF NOT EXISTS "permissionToContact" BOOLEAN NOT NULL DEFAULT FALSE`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "LeadDisclosureAudit" ADD COLUMN IF NOT EXISTS "permissionToContactMethod" TEXT`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "LeadDisclosureAudit" ADD COLUMN IF NOT EXISTS "permissionToContactText" TEXT`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "LeadDisclosureAudit" ADD COLUMN IF NOT EXISTS "permissionToContactVersion" TEXT`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "LeadDisclosureAudit" ADD COLUMN IF NOT EXISTS "automatedContactConsent" BOOLEAN NOT NULL DEFAULT FALSE`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "LeadDisclosureAudit" ADD COLUMN IF NOT EXISTS "automatedContactConsentText" TEXT`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "LeadDisclosureAudit" ADD COLUMN IF NOT EXISTS "automatedContactConsentVersion" TEXT`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "LeadDisclosureAudit" ADD COLUMN IF NOT EXISTS "leadSource" TEXT`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "LeadDisclosureAudit" ADD COLUMN IF NOT EXISTS "pageSource" TEXT`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "LeadDisclosureAudit" ADD COLUMN IF NOT EXISTS "utmSource" TEXT`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "LeadDisclosureAudit" ADD COLUMN IF NOT EXISTS "utmMedium" TEXT`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "LeadDisclosureAudit" ADD COLUMN IF NOT EXISTS "utmCampaign" TEXT`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "LeadDisclosureAudit" ADD COLUMN IF NOT EXISTS "linkedinReferral" BOOLEAN NOT NULL DEFAULT FALSE`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "LeadDisclosureAudit" ADD COLUMN IF NOT EXISTS "eventReferral" BOOLEAN NOT NULL DEFAULT FALSE`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "LeadDisclosureAudit" ADD COLUMN IF NOT EXISTS "partnerReferral" BOOLEAN NOT NULL DEFAULT FALSE`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "LeadDisclosureAudit" ADD COLUMN IF NOT EXISTS "leadCategory" TEXT`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "LeadDisclosureAudit" ADD COLUMN IF NOT EXISTS "state" TEXT`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "LeadDisclosureAudit" ADD COLUMN IF NOT EXISTS "consentTimestamp" TIMESTAMP`);
        await prisma.$executeRawUnsafe(`
          CREATE INDEX IF NOT EXISTS "LeadDisclosureAudit_timestamp_idx"
          ON "LeadDisclosureAudit"("timestamp")
        `);
        await prisma.$executeRawUnsafe(`
          CREATE INDEX IF NOT EXISTS "LeadDisclosureAudit_leadRequestId_idx"
          ON "LeadDisclosureAudit"("leadRequestId")
        `);
      })(),
    );
  }

  await complianceInitByUrl.get(dbUrl);
}
