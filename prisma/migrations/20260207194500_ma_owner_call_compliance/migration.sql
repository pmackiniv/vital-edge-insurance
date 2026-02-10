-- CreateTable
CREATE TABLE "CallComplianceAudit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
    "soaRequestedAt" DATETIME,
    "soaSignedAt" DATETIME,
    "appointmentAt" DATETIME,
    "soaTimingValid" BOOLEAN NOT NULL DEFAULT false,
    "callRecorded" BOOLEAN NOT NULL DEFAULT false,
    "retentionUntil" DATETIME,
    "sourceRoute" TEXT NOT NULL,
    "allowed" BOOLEAN NOT NULL DEFAULT false,
    "blockCode" TEXT,
    "requiredOwner" BOOLEAN NOT NULL DEFAULT false,
    "requestContextJson" JSON
);

-- CreateTable
CREATE TABLE "LeadDisclosureAudit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leadRequestId" TEXT NOT NULL,
    "leadTransferDisclosureAck" BOOLEAN NOT NULL DEFAULT false,
    "dataSharingConsent" BOOLEAN NOT NULL DEFAULT false,
    "dataSharingEntitiesJson" JSON NOT NULL,
    "beneficiaryInitiated" BOOLEAN NOT NULL DEFAULT false,
    "sourceRoute" TEXT NOT NULL,
    "zip" TEXT,
    "productInterest" TEXT
);

-- CreateIndex
CREATE INDEX "CallComplianceAudit_timestamp_idx" ON "CallComplianceAudit"("timestamp");

-- CreateIndex
CREATE INDEX "CallComplianceAudit_callId_idx" ON "CallComplianceAudit"("callId");

-- CreateIndex
CREATE INDEX "CallComplianceAudit_discussionStage_allowed_idx" ON "CallComplianceAudit"("discussionStage", "allowed");

-- CreateIndex
CREATE INDEX "CallComplianceAudit_zip_product_idx" ON "CallComplianceAudit"("zip", "product");

-- CreateIndex
CREATE INDEX "LeadDisclosureAudit_timestamp_idx" ON "LeadDisclosureAudit"("timestamp");

-- CreateIndex
CREATE INDEX "LeadDisclosureAudit_leadRequestId_idx" ON "LeadDisclosureAudit"("leadRequestId");
