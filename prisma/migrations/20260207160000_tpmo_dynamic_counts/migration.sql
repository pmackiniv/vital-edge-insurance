-- CreateTable
CREATE TABLE "AgentEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "agentName" TEXT,
    "requestId" TEXT,
    "summary" TEXT NOT NULL,
    "metaJson" JSON,
    "route" TEXT,
    "complianceResult" TEXT
);

-- CreateTable
CREATE TABLE "AppointmentSponsor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sponsorKey" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "effectiveDate" DATETIME NOT NULL,
    "terminationDate" DATETIME,
    "countsAsSeparateOrg" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SponsorAlias" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "alias" TEXT NOT NULL,
    "sponsorKey" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 100,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "version" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PlanIndex" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TpmoCountLookupLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "planYear" INTEGER NOT NULL,
    "zip" TEXT NOT NULL,
    "orgCount" INTEGER NOT NULL,
    "planCount" INTEGER NOT NULL,
    "orgsJson" JSON NOT NULL,
    "source" TEXT NOT NULL,
    "datasetVersion" TEXT NOT NULL,
    "aliasMapVersion" TEXT NOT NULL,
    "requestContextJson" JSON NOT NULL,
    "persistenceMode" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TpmoDatasetMeta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "source" TEXT NOT NULL,
    "planYear" INTEGER NOT NULL,
    "datasetVersion" TEXT NOT NULL,
    "refreshedAt" DATETIME NOT NULL,
    "fileChecksum" TEXT,
    "rowCount" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "AgentEvent_timestamp_idx" ON "AgentEvent"("timestamp");

-- CreateIndex
CREATE INDEX "AgentEvent_eventType_status_idx" ON "AgentEvent"("eventType", "status");

-- CreateIndex
CREATE INDEX "AgentEvent_requestId_idx" ON "AgentEvent"("requestId");

-- CreateIndex
CREATE INDEX "AppointmentSponsor_state_status_idx" ON "AppointmentSponsor"("state", "status");

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentSponsor_sponsorKey_state_key" ON "AppointmentSponsor"("sponsorKey", "state");

-- CreateIndex
CREATE INDEX "SponsorAlias_active_version_idx" ON "SponsorAlias"("active", "version");

-- CreateIndex
CREATE INDEX "SponsorAlias_sponsorKey_active_idx" ON "SponsorAlias"("sponsorKey", "active");

-- CreateIndex
CREATE UNIQUE INDEX "SponsorAlias_alias_sponsorKey_version_key" ON "SponsorAlias"("alias", "sponsorKey", "version");

-- CreateIndex
CREATE INDEX "PlanIndex_planYear_zip_idx" ON "PlanIndex"("planYear", "zip");

-- CreateIndex
CREATE INDEX "PlanIndex_planYear_sponsorKey_idx" ON "PlanIndex"("planYear", "sponsorKey");

-- CreateIndex
CREATE INDEX "PlanIndex_planYear_zip_sponsorKey_idx" ON "PlanIndex"("planYear", "zip", "sponsorKey");

-- CreateIndex
CREATE UNIQUE INDEX "PlanIndex_planYear_zip_state_contractId_planId_datasetVersion_key" ON "PlanIndex"("planYear", "zip", "state", "contractId", "planId", "datasetVersion");

-- CreateIndex
CREATE INDEX "TpmoCountLookupLog_timestamp_idx" ON "TpmoCountLookupLog"("timestamp");

-- CreateIndex
CREATE INDEX "TpmoCountLookupLog_planYear_zip_idx" ON "TpmoCountLookupLog"("planYear", "zip");

-- CreateIndex
CREATE INDEX "TpmoDatasetMeta_source_planYear_refreshedAt_idx" ON "TpmoDatasetMeta"("source", "planYear", "refreshedAt");

-- CreateIndex
CREATE UNIQUE INDEX "TpmoDatasetMeta_source_planYear_datasetVersion_key" ON "TpmoDatasetMeta"("source", "planYear", "datasetVersion");
