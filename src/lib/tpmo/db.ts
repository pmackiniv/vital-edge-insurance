import { getPrismaClient } from "@/lib/prisma";

const tpmoInitByUrl = new Map<string, Promise<void>>();

export async function ensureTpmoTables(): Promise<void> {
  const prisma = getPrismaClient();
  const dbUrl = process.env.DATABASE_URL?.trim();
  if (!prisma || !dbUrl) return;

  if (!tpmoInitByUrl.has(dbUrl)) {
    tpmoInitByUrl.set(
      dbUrl,
      (async () => {
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "AppointmentSponsor" (
            "id" TEXT PRIMARY KEY NOT NULL,
            "sponsorKey" TEXT NOT NULL,
            "displayName" TEXT NOT NULL,
            "status" TEXT NOT NULL,
            "state" TEXT NOT NULL,
            "effectiveDate" TIMESTAMP NOT NULL,
            "terminationDate" TIMESTAMP,
            "countsAsSeparateOrg" BOOLEAN NOT NULL DEFAULT TRUE,
            "notes" TEXT,
            "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `);
        await prisma.$executeRawUnsafe(`
          CREATE UNIQUE INDEX IF NOT EXISTS "AppointmentSponsor_sponsorKey_state_key"
          ON "AppointmentSponsor"("sponsorKey", "state")
        `);
        await prisma.$executeRawUnsafe(`
          CREATE INDEX IF NOT EXISTS "AppointmentSponsor_state_status_idx"
          ON "AppointmentSponsor"("state", "status")
        `);

        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "SponsorAlias" (
            "id" TEXT PRIMARY KEY NOT NULL,
            "alias" TEXT NOT NULL,
            "sponsorKey" TEXT NOT NULL,
            "priority" INTEGER NOT NULL DEFAULT 100,
            "active" BOOLEAN NOT NULL DEFAULT TRUE,
            "version" TEXT NOT NULL,
            "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `);
        await prisma.$executeRawUnsafe(`
          CREATE UNIQUE INDEX IF NOT EXISTS "SponsorAlias_alias_sponsorKey_version_key"
          ON "SponsorAlias"("alias", "sponsorKey", "version")
        `);
        await prisma.$executeRawUnsafe(`
          CREATE INDEX IF NOT EXISTS "SponsorAlias_active_version_idx"
          ON "SponsorAlias"("active", "version")
        `);
        await prisma.$executeRawUnsafe(`
          CREATE INDEX IF NOT EXISTS "SponsorAlias_sponsorKey_active_idx"
          ON "SponsorAlias"("sponsorKey", "active")
        `);

        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "PlanIndex" (
            "id" TEXT PRIMARY KEY NOT NULL,
            "planYear" INTEGER NOT NULL,
            "zip" TEXT NOT NULL,
            "countyFips" TEXT,
            "state" TEXT NOT NULL,
            "contractId" TEXT NOT NULL,
            "planId" TEXT NOT NULL,
            "rawSponsorName" TEXT NOT NULL,
            "sponsorKey" TEXT,
            "datasetVersion" TEXT NOT NULL,
            "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `);
        await prisma.$executeRawUnsafe(`
          CREATE UNIQUE INDEX IF NOT EXISTS "PlanIndex_planYear_zip_state_contractId_planId_datasetVersion_key"
          ON "PlanIndex"("planYear", "zip", "state", "contractId", "planId", "datasetVersion")
        `);
        await prisma.$executeRawUnsafe(`
          CREATE INDEX IF NOT EXISTS "PlanIndex_planYear_zip_idx"
          ON "PlanIndex"("planYear", "zip")
        `);
        await prisma.$executeRawUnsafe(`
          CREATE INDEX IF NOT EXISTS "PlanIndex_planYear_sponsorKey_idx"
          ON "PlanIndex"("planYear", "sponsorKey")
        `);
        await prisma.$executeRawUnsafe(`
          CREATE INDEX IF NOT EXISTS "PlanIndex_planYear_zip_sponsorKey_idx"
          ON "PlanIndex"("planYear", "zip", "sponsorKey")
        `);

        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "TpmoCountLookupLog" (
            "id" TEXT PRIMARY KEY NOT NULL,
            "timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "planYear" INTEGER NOT NULL,
            "zip" TEXT NOT NULL,
            "orgCount" INTEGER NOT NULL,
            "planCount" INTEGER NOT NULL,
            "orgsJson" TEXT NOT NULL,
            "source" TEXT NOT NULL,
            "datasetVersion" TEXT NOT NULL,
            "aliasMapVersion" TEXT NOT NULL,
            "requestContextJson" TEXT NOT NULL,
            "persistenceMode" TEXT NOT NULL
          )
        `);
        await prisma.$executeRawUnsafe(`
          CREATE INDEX IF NOT EXISTS "TpmoCountLookupLog_timestamp_idx"
          ON "TpmoCountLookupLog"("timestamp")
        `);
        await prisma.$executeRawUnsafe(`
          CREATE INDEX IF NOT EXISTS "TpmoCountLookupLog_planYear_zip_idx"
          ON "TpmoCountLookupLog"("planYear", "zip")
        `);

        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "TpmoDatasetMeta" (
            "id" TEXT PRIMARY KEY NOT NULL,
            "source" TEXT NOT NULL,
            "planYear" INTEGER NOT NULL,
            "datasetVersion" TEXT NOT NULL,
            "refreshedAt" TIMESTAMP NOT NULL,
            "fileChecksum" TEXT,
            "rowCount" INTEGER NOT NULL,
            "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `);
        await prisma.$executeRawUnsafe(`
          CREATE UNIQUE INDEX IF NOT EXISTS "TpmoDatasetMeta_source_planYear_datasetVersion_key"
          ON "TpmoDatasetMeta"("source", "planYear", "datasetVersion")
        `);
        await prisma.$executeRawUnsafe(`
          CREATE INDEX IF NOT EXISTS "TpmoDatasetMeta_source_planYear_refreshedAt_idx"
          ON "TpmoDatasetMeta"("source", "planYear", "refreshedAt")
        `);
      })(),
    );
  }

  await tpmoInitByUrl.get(dbUrl);
}
