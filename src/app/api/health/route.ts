import { NextResponse } from "next/server";
import { CALL_RECORDING_POLICY_VERSION, RETENTION_POLICY_YEARS, TPMO_POLICY_VERSION } from "@/lib/compliance/policy";
import { getPersistenceMode } from "@/lib/prisma";
import { getTpmoStatus } from "@/lib/tpmo/tpmoCounts";

export async function GET() {
  const gitCommit = process.env.VERCEL_GIT_COMMIT_SHA || "unknown";
  const notionConfigured = Boolean(process.env.NOTION_API_KEY && process.env.NOTION_DATABASE_ID);
  const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
  const openaiConfigured = Boolean(process.env.OPENAI_API_KEY);
  const formSubmitConfigured = Boolean(process.env.FORMSUBMIT_TO || process.env.NEXT_PUBLIC_FORMSUBMIT_TO);
  const ownerEmailConfigured = Boolean(process.env.OWNER_EMAIL || process.env.LEAD_NOTIFY_TO_EMAIL);
  const databaseConfigured = Boolean(process.env.DATABASE_URL);
  const tpmoDisclaimerConfigured = Boolean(process.env.CMS_TPMO_DISCLAIMER?.trim());
  let tpmoStatus: Awaited<ReturnType<typeof getTpmoStatus>>;
  let tpmoStatusError: string | null = null;
  try {
    tpmoStatus = await getTpmoStatus();
  } catch (error) {
    tpmoStatusError = error instanceof Error ? error.message : String(error);
    tpmoStatus = {
      ok: true,
      planYear: new Date().getFullYear(),
      source: "cms_landscape",
      datasetVersion: null,
      refreshedAt: null,
      aliasMapVersion: process.env.TPMO_ALIAS_MAP_VERSION?.trim() || "tpmo-alias-v1",
      tpmoPolicyVersion: TPMO_POLICY_VERSION,
      callRecordingPolicyVersion: CALL_RECORDING_POLICY_VERSION,
      retentionPolicyYears: RETENTION_POLICY_YEARS,
      recordingArchiveMode: process.env.RECORDING_ARCHIVE_MODE?.trim() || "unconfigured",
      databaseConfigured: Boolean(process.env.DATABASE_URL),
      persistenceMode: getPersistenceMode(),
      appointmentSponsors: [],
      latestLookup: null,
    };
  }
  const tpmoPersistenceMode = getPersistenceMode();

  return NextResponse.json({
    ok: true,
    gitCommit,
    notionConfigured,
    smtpConfigured,
    openaiConfigured,
    formSubmitConfigured,
    formsSubmitConfigured: formSubmitConfigured,
    ownerEmailConfigured,
    databaseConfigured,
    tpmoDisclaimerConfigured,
    tpmoDatasetSource: tpmoStatus.source,
    tpmoDatasetVersion: tpmoStatus.datasetVersion,
    lastDatasetRefreshAt: tpmoStatus.refreshedAt,
    tpmoAliasMapVersion: tpmoStatus.aliasMapVersion,
    tpmoPolicyVersion: TPMO_POLICY_VERSION,
    callRecordingPolicyVersion: CALL_RECORDING_POLICY_VERSION,
    retentionPolicyYears: RETENTION_POLICY_YEARS,
    recordingArchiveMode: process.env.RECORDING_ARCHIVE_MODE?.trim() || "unconfigured",
    tpmoPersistenceMode,
    tpmoStatusError,
  });
}
