-- Postgres runtime alignment baseline.
-- NOTE: legacy SQLite-era migrations remain in history and should be resolved as applied
-- for Postgres environments before this migration is deployed.

CREATE TABLE IF NOT EXISTS "AgentEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "agentName" TEXT,
    "requestId" TEXT,
    "summary" TEXT NOT NULL,
    "metaJson" JSONB,
    "route" TEXT,
    "complianceResult" TEXT
);

CREATE TABLE IF NOT EXISTS "AppointmentSponsor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sponsorKey" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "effectiveDate" TIMESTAMP(3) NOT NULL,
    "terminationDate" TIMESTAMP(3),
    "countsAsSeparateOrg" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS "SponsorAlias" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "alias" TEXT NOT NULL,
    "sponsorKey" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 100,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "version" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS "PlanIndex" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "planYear" INTEGER NOT NULL,
    "zip" TEXT NOT NULL,
    "countyFips" TEXT,
    "state" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "rawSponsorName" TEXT NOT NULL,
    "sponsorKey" TEXT,
    "datasetVersion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS "TpmoCountLookupLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "planYear" INTEGER NOT NULL,
    "zip" TEXT NOT NULL,
    "orgCount" INTEGER NOT NULL,
    "planCount" INTEGER NOT NULL,
    "orgsJson" JSONB NOT NULL,
    "source" TEXT NOT NULL,
    "datasetVersion" TEXT NOT NULL,
    "aliasMapVersion" TEXT NOT NULL,
    "requestContextJson" JSONB NOT NULL,
    "persistenceMode" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "TpmoDatasetMeta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "source" TEXT NOT NULL,
    "planYear" INTEGER NOT NULL,
    "datasetVersion" TEXT NOT NULL,
    "refreshedAt" TIMESTAMP(3) NOT NULL,
    "fileChecksum" TEXT,
    "rowCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS "CallComplianceAudit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "callId" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "discussionStage" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "actorRole" TEXT NOT NULL,
    "recordingRequired" BOOLEAN NOT NULL DEFAULT false,
    "callRecordingConsent" BOOLEAN NOT NULL DEFAULT false,
    "callRecordingActive" BOOLEAN NOT NULL DEFAULT false,
    "zip" TEXT,
    "planYear" INTEGER,
    "orgCount" INTEGER,
    "planCount" INTEGER,
    "disclaimerText" TEXT,
    "disclaimerVariant" TEXT,
    "cfuConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "soaOnFile" BOOLEAN NOT NULL DEFAULT false,
    "soaRequestedAt" TIMESTAMP(3),
    "soaSignedAt" TIMESTAMP(3),
    "appointmentAt" TIMESTAMP(3),
    "soaTimingValid" BOOLEAN NOT NULL DEFAULT false,
    "callRecorded" BOOLEAN NOT NULL DEFAULT false,
    "retentionUntil" TIMESTAMP(3),
    "sourceRoute" TEXT NOT NULL,
    "allowed" BOOLEAN NOT NULL DEFAULT false,
    "blockCode" TEXT,
    "requiredOwner" BOOLEAN NOT NULL DEFAULT false,
    "requestContextJson" JSONB
);

CREATE TABLE IF NOT EXISTS "LeadDisclosureAudit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leadRequestId" TEXT NOT NULL,
    "leadTransferDisclosureAck" BOOLEAN NOT NULL DEFAULT false,
    "dataSharingConsent" BOOLEAN NOT NULL DEFAULT false,
    "dataSharingEntitiesJson" JSONB NOT NULL,
    "beneficiaryInitiated" BOOLEAN NOT NULL DEFAULT false,
    "sourceRoute" TEXT NOT NULL,
    "zip" TEXT,
    "productInterest" TEXT
);

CREATE INDEX IF NOT EXISTS "AgentEvent_timestamp_idx" ON "AgentEvent"("timestamp");
CREATE INDEX IF NOT EXISTS "AgentEvent_eventType_status_idx" ON "AgentEvent"("eventType", "status");
CREATE INDEX IF NOT EXISTS "AgentEvent_requestId_idx" ON "AgentEvent"("requestId");

CREATE INDEX IF NOT EXISTS "AppointmentSponsor_state_status_idx" ON "AppointmentSponsor"("state", "status");
CREATE UNIQUE INDEX IF NOT EXISTS "AppointmentSponsor_sponsorKey_state_key" ON "AppointmentSponsor"("sponsorKey", "state");

CREATE INDEX IF NOT EXISTS "SponsorAlias_active_version_idx" ON "SponsorAlias"("active", "version");
CREATE INDEX IF NOT EXISTS "SponsorAlias_sponsorKey_active_idx" ON "SponsorAlias"("sponsorKey", "active");
CREATE UNIQUE INDEX IF NOT EXISTS "SponsorAlias_alias_sponsorKey_version_key" ON "SponsorAlias"("alias", "sponsorKey", "version");

CREATE INDEX IF NOT EXISTS "PlanIndex_planYear_zip_idx" ON "PlanIndex"("planYear", "zip");
CREATE INDEX IF NOT EXISTS "PlanIndex_planYear_sponsorKey_idx" ON "PlanIndex"("planYear", "sponsorKey");
CREATE INDEX IF NOT EXISTS "PlanIndex_planYear_zip_sponsorKey_idx" ON "PlanIndex"("planYear", "zip", "sponsorKey");
CREATE UNIQUE INDEX IF NOT EXISTS "PlanIndex_planYear_zip_state_contractId_planId_datasetVersion_key" ON "PlanIndex"("planYear", "zip", "state", "contractId", "planId", "datasetVersion");

CREATE INDEX IF NOT EXISTS "TpmoCountLookupLog_timestamp_idx" ON "TpmoCountLookupLog"("timestamp");
CREATE INDEX IF NOT EXISTS "TpmoCountLookupLog_planYear_zip_idx" ON "TpmoCountLookupLog"("planYear", "zip");

CREATE INDEX IF NOT EXISTS "TpmoDatasetMeta_source_planYear_refreshedAt_idx" ON "TpmoDatasetMeta"("source", "planYear", "refreshedAt");
CREATE UNIQUE INDEX IF NOT EXISTS "TpmoDatasetMeta_source_planYear_datasetVersion_key" ON "TpmoDatasetMeta"("source", "planYear", "datasetVersion");

CREATE INDEX IF NOT EXISTS "CallComplianceAudit_timestamp_idx" ON "CallComplianceAudit"("timestamp");
CREATE INDEX IF NOT EXISTS "CallComplianceAudit_callId_idx" ON "CallComplianceAudit"("callId");
CREATE INDEX IF NOT EXISTS "CallComplianceAudit_discussionStage_allowed_idx" ON "CallComplianceAudit"("discussionStage", "allowed");
CREATE INDEX IF NOT EXISTS "CallComplianceAudit_zip_product_idx" ON "CallComplianceAudit"("zip", "product");

CREATE INDEX IF NOT EXISTS "LeadDisclosureAudit_timestamp_idx" ON "LeadDisclosureAudit"("timestamp");
CREATE INDEX IF NOT EXISTS "LeadDisclosureAudit_leadRequestId_idx" ON "LeadDisclosureAudit"("leadRequestId");
