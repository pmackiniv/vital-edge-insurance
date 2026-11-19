import { getPrismaClient } from "@/lib/prisma";

/**
 * Storage for signed Scope of Appointment records.
 *
 * Created with raw DDL and IF NOT EXISTS, matching `compliance/db.ts`. The
 * project provisions compliance tables at first use rather than through a
 * migration, so the two stay consistent.
 *
 * Deliberately NOT stored: SSN, Medicare Beneficiary Identifier, date of birth,
 * or any payment detail. The CMS model form does not ask for them and the
 * project's standing rule forbids holding them. `leadGuard` screens the free-text
 * fields on the way in.
 *
 * `retentionUntil` is stamped from RETENTION_POLICY_YEARS at write time so the
 * obligation travels with the row even if the policy constant later changes.
 */
const soaInitByUrl = new Map<string, Promise<void>>();

export async function ensureSoaTables(): Promise<void> {
  const prisma = getPrismaClient();
  const dbUrl = process.env.DATABASE_URL?.trim();
  if (!prisma || !dbUrl) return;

  if (!soaInitByUrl.has(dbUrl)) {
    soaInitByUrl.set(
      dbUrl,
      (async () => {
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "SoaSubmission" (
            "id" TEXT PRIMARY KEY NOT NULL,
            "timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "formVersion" TEXT NOT NULL,
            "beneficiaryFirstName" TEXT NOT NULL,
            "beneficiaryLastName" TEXT NOT NULL,
            "beneficiaryPhone" TEXT,
            "streetAddress" TEXT,
            "addressLine2" TEXT,
            "city" TEXT,
            "zip" TEXT NOT NULL,
            "county" TEXT,
            "state" TEXT,
            "preferredLanguage" TEXT,
            "productKeysJson" TEXT NOT NULL,
            "discussionStage" TEXT NOT NULL,
            "initialContactMethod" TEXT NOT NULL,
            "agentName" TEXT NOT NULL,
            "agentNpn" TEXT,
            "signature" TEXT NOT NULL,
            "signedAt" TIMESTAMP NOT NULL,
            "appointmentAt" TIMESTAMP NOT NULL,
            "hoursBeforeAppointment" DOUBLE PRECISION,
            "soaTimingValid" BOOLEAN NOT NULL DEFAULT FALSE,
            "soaTimingReason" TEXT NOT NULL,
            "under48HourReason" TEXT,
            "isAuthorizedRepresentative" BOOLEAN NOT NULL DEFAULT FALSE,
            "representativeName" TEXT,
            "representativeRelationship" TEXT,
            "sourceRoute" TEXT,
            "userAgent" TEXT,
            "ipHash" TEXT,
            "retentionUntil" TIMESTAMP NOT NULL
          )
        `);
        await prisma.$executeRawUnsafe(`
          CREATE INDEX IF NOT EXISTS "SoaSubmission_timestamp_idx"
          ON "SoaSubmission"("timestamp")
        `);
        await prisma.$executeRawUnsafe(`
          CREATE INDEX IF NOT EXISTS "SoaSubmission_appointment_idx"
          ON "SoaSubmission"("appointmentAt")
        `);
        await prisma.$executeRawUnsafe(`
          CREATE INDEX IF NOT EXISTS "SoaSubmission_name_zip_idx"
          ON "SoaSubmission"("beneficiaryLastName", "zip")
        `);
        await prisma.$executeRawUnsafe(`
          CREATE INDEX IF NOT EXISTS "SoaSubmission_timing_idx"
          ON "SoaSubmission"("soaTimingValid", "discussionStage")
        `);
      })().catch((error) => {
        // Match the fail-open posture of the other compliance tables: a storage
        // outage must not take the public form down. The route reports
        // persisted:false so the caller knows the row is not durable.
        soaInitByUrl.delete(dbUrl);
        throw error;
      }),
    );
  }

  await soaInitByUrl.get(dbUrl);
}
