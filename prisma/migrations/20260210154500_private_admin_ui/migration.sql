-- Private Admin UI artifact workflow tables.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ArtifactStatus') THEN
    CREATE TYPE "ArtifactStatus" AS ENUM ('PENDING', 'APPROVED', 'DENIED');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'DecisionType') THEN
    CREATE TYPE "DecisionType" AS ENUM ('APPROVE', 'DENY');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Cadence') THEN
    CREATE TYPE "Cadence" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'TaskStatus') THEN
    CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'DONE', 'SKIPPED');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'RunResult') THEN
    CREATE TYPE "RunResult" AS ENUM ('PASS', 'FAIL');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ApproverRole') THEN
    CREATE TYPE "ApproverRole" AS ENUM ('OWNER', 'ADMIN', 'VIEWER');
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS "Artifact" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "runDate" DATE NOT NULL,
  "cadence" "Cadence" NOT NULL,
  "periodKey" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "relativePath" TEXT NOT NULL,
  "sha256" TEXT NOT NULL,
  "contentText" TEXT,
  "contentJson" JSONB,
  "scorecardJson" JSONB,
  "status" "ArtifactStatus" NOT NULL DEFAULT 'PENDING',
  "source" TEXT NOT NULL,
  "meta" JSONB
);

CREATE TABLE IF NOT EXISTS "Decision" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "artifactId" TEXT NOT NULL,
  "decision" "DecisionType" NOT NULL,
  "notes" TEXT,
  "decidedBy" TEXT NOT NULL,
  "decidedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Decision_artifactId_fkey"
    FOREIGN KEY ("artifactId") REFERENCES "Artifact"("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "HandoffTask" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "periodKey" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "stepsJson" JSONB NOT NULL,
  "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
  "linkedArtifactId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "HandoffTask_linkedArtifactId_fkey"
    FOREIGN KEY ("linkedArtifactId") REFERENCES "Artifact"("id")
    ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Run" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "cadence" "Cadence" NOT NULL,
  "periodKey" TEXT NOT NULL,
  "runDate" DATE NOT NULL,
  "packetDir" TEXT,
  "gitCommit" TEXT,
  "strict" BOOLEAN NOT NULL DEFAULT false,
  "result" "RunResult" NOT NULL,
  "summary" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Approver" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "email" TEXT NOT NULL,
  "role" "ApproverRole" NOT NULL DEFAULT 'VIEWER',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS "Artifact_sha256_key" ON "Artifact"("sha256");
CREATE INDEX IF NOT EXISTS "Artifact_status_createdAt_idx" ON "Artifact"("status", "createdAt");
CREATE INDEX IF NOT EXISTS "Artifact_cadence_periodKey_idx" ON "Artifact"("cadence", "periodKey");

CREATE INDEX IF NOT EXISTS "Decision_artifactId_decidedAt_idx" ON "Decision"("artifactId", "decidedAt");

CREATE INDEX IF NOT EXISTS "HandoffTask_periodKey_status_idx" ON "HandoffTask"("periodKey", "status");

CREATE UNIQUE INDEX IF NOT EXISTS "Run_cadence_periodKey_runDate_key" ON "Run"("cadence", "periodKey", "runDate");
CREATE INDEX IF NOT EXISTS "Run_createdAt_idx" ON "Run"("createdAt");

CREATE UNIQUE INDEX IF NOT EXISTS "Approver_email_key" ON "Approver"("email");
