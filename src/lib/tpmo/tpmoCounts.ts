import type { Prisma } from "@prisma/client";
import { getPersistenceMode, getPrismaClient, type PersistenceMode } from "@/lib/prisma";
import { CALL_RECORDING_POLICY_VERSION, RETENTION_POLICY_YEARS, TPMO_POLICY_VERSION } from "@/lib/compliance/policy";
import { TPMO_ALIAS_MAP_VERSION, TPMO_DATASET_SOURCE, type SponsorKey } from "@/lib/tpmo/constants";
import { ensureTpmoTables } from "@/lib/tpmo/db";
import { buildTpmoDisclaimer } from "@/lib/tpmo/disclaimer";
import { normalizeSponsorName, type SponsorAliasRecord } from "@/lib/tpmo/sponsorNormalize";

export type TpmoCountContext = {
  channel?: string;
  discussionStage?: string;
  callId?: string;
  actorId?: string;
  actorRole?: string;
  callRecordingConsent?: boolean;
  soaOnFile?: boolean;
  cfuConfirmed?: boolean;
  beneficiaryInitiated?: boolean;
};

export type TpmoCountsInput = {
  zip: string;
  planYear: number;
  context?: TpmoCountContext;
  source?: string;
};

export type TpmoCountsSuccess = {
  ok: true;
  zip: string;
  planYear: number;
  org_count: number;
  plan_count: number;
  organizations: string[];
  plans_sample: string[];
  represents_all_plans: boolean;
  disclaimer: string;
  persistenceMode: PersistenceMode;
  dataset: {
    source: string;
    version: string;
    refreshedAt: string | null;
  };
  aliasMapVersion: string;
};

export type TpmoCountsFailure = {
  ok: false;
  error: string;
  zip: string;
  planYear: number;
  persistenceMode: PersistenceMode;
};

export type TpmoCountsResult = TpmoCountsSuccess | TpmoCountsFailure;

export type TpmoStatus = {
  ok: true;
  planYear: number;
  source: string;
  datasetVersion: string | null;
  refreshedAt: string | null;
  aliasMapVersion: string;
  tpmoPolicyVersion: string;
  callRecordingPolicyVersion: string;
  retentionPolicyYears: number;
  recordingArchiveMode: string;
  databaseConfigured: boolean;
  persistenceMode: PersistenceMode;
  appointmentSponsors: Array<{
    sponsorKey: string;
    displayName: string;
    status: string;
    countsAsSeparateOrg: boolean;
  }>;
  latestLookup: {
    zip: string;
    orgCount: number;
    planCount: number;
    timestamp: string;
  } | null;
};

function zip5(raw: string): string {
  return String(raw || "").replace(/\D/g, "").slice(0, 5);
}

function parseJsonInput(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function isCallChannel(channel: string): boolean {
  const normalized = channel.toLowerCase().trim();
  return normalized === "call" || normalized === "phone" || normalized === "call_task";
}

async function readAliasRows(): Promise<{ rows: SponsorAliasRecord[]; aliasMapVersion: string }> {
  const prisma = getPrismaClient();
  if (!prisma) {
    return { rows: [], aliasMapVersion: TPMO_ALIAS_MAP_VERSION };
  }

  const rows = await prisma.sponsorAlias.findMany({
    where: { active: true },
    orderBy: [{ priority: "asc" }, { alias: "asc" }],
  });
  const mapped: SponsorAliasRecord[] = rows.map((row) => ({
    alias: row.alias,
    sponsorKey: row.sponsorKey as SponsorAliasRecord["sponsorKey"],
    priority: row.priority,
    active: row.active,
    version: row.version,
  }));
  return {
    rows: mapped,
    aliasMapVersion: mapped[0]?.version || TPMO_ALIAS_MAP_VERSION,
  };
}

async function readActiveAppointments() {
  const prisma = getPrismaClient();
  if (!prisma) return [];
  const now = new Date();
  return prisma.appointmentSponsor.findMany({
    where: {
      state: "FL",
      status: "active",
      effectiveDate: { lte: now },
      OR: [{ terminationDate: null }, { terminationDate: { gte: now } }],
    },
    orderBy: [{ displayName: "asc" }],
  });
}

export async function getTpmoStatus(planYearInput?: number): Promise<TpmoStatus> {
  const persistenceMode = getPersistenceMode();
  const databaseConfigured = persistenceMode === "database";
  const planYear = Number(planYearInput) || new Date().getFullYear();
  const source = TPMO_DATASET_SOURCE;
  const prisma = getPrismaClient();

  if (!prisma) {
    return {
      ok: true,
      planYear,
      source,
      datasetVersion: null,
      refreshedAt: null,
      aliasMapVersion: TPMO_ALIAS_MAP_VERSION,
      tpmoPolicyVersion: TPMO_POLICY_VERSION,
      callRecordingPolicyVersion: CALL_RECORDING_POLICY_VERSION,
      retentionPolicyYears: RETENTION_POLICY_YEARS,
      recordingArchiveMode: process.env.RECORDING_ARCHIVE_MODE?.trim() || "unconfigured",
      databaseConfigured,
      persistenceMode,
      appointmentSponsors: [],
      latestLookup: null,
    };
  }

  await ensureTpmoTables();
  const [meta, alias, appointmentSponsors, latestLookup] = await Promise.all([
    prisma.tpmoDatasetMeta.findFirst({
      where: { planYear, source },
      orderBy: { refreshedAt: "desc" },
    }),
    prisma.sponsorAlias.findFirst({
      where: { active: true },
      orderBy: [{ version: "desc" }, { priority: "asc" }],
    }),
    readActiveAppointments(),
    prisma.tpmoCountLookupLog.findFirst({
      orderBy: { timestamp: "desc" },
    }),
  ]);

  return {
    ok: true,
    planYear,
    source,
    datasetVersion: meta?.datasetVersion || null,
    refreshedAt: meta?.refreshedAt.toISOString() || null,
    aliasMapVersion: alias?.version || TPMO_ALIAS_MAP_VERSION,
    tpmoPolicyVersion: TPMO_POLICY_VERSION,
    callRecordingPolicyVersion: CALL_RECORDING_POLICY_VERSION,
    retentionPolicyYears: RETENTION_POLICY_YEARS,
    recordingArchiveMode: process.env.RECORDING_ARCHIVE_MODE?.trim() || "unconfigured",
    databaseConfigured,
    persistenceMode,
    appointmentSponsors: appointmentSponsors.map((row) => ({
      sponsorKey: row.sponsorKey,
      displayName: row.displayName,
      status: row.status,
      countsAsSeparateOrg: row.countsAsSeparateOrg,
    })),
    latestLookup: latestLookup
      ? {
          zip: latestLookup.zip,
          orgCount: latestLookup.orgCount,
          planCount: latestLookup.planCount,
          timestamp: latestLookup.timestamp.toISOString(),
        }
      : null,
  };
}

export async function getTpmoCounts(input: TpmoCountsInput): Promise<TpmoCountsResult> {
  const persistenceMode = getPersistenceMode();
  const zip = zip5(input.zip);
  const planYear = Number(input.planYear) || new Date().getFullYear();
  const source = input.source?.trim() || TPMO_DATASET_SOURCE;
  const channel = input.context?.channel || "";
  const prisma = getPrismaClient();

  if (zip.length !== 5) {
    return { ok: false, error: "ZIP must be a 5-digit value.", zip, planYear, persistenceMode };
  }
  if (isCallChannel(channel) && input.context?.callRecordingConsent !== true) {
    return {
      ok: false,
      error: "Call-context TPMO count lookups require callRecordingConsent=true.",
      zip,
      planYear,
      persistenceMode,
    };
  }
  if (!prisma) {
    return {
      ok: false,
      error: "DATABASE_URL is not configured. TPMO counts require persistent storage.",
      zip,
      planYear,
      persistenceMode,
    };
  }

  await ensureTpmoTables();

  const [aliases, appointments, meta, zipRows] = await Promise.all([
    readAliasRows(),
    readActiveAppointments(),
    prisma.tpmoDatasetMeta.findFirst({
      where: { planYear, source },
      orderBy: { refreshedAt: "desc" },
    }),
    prisma.planIndex.findMany({
      where: {
        planYear,
        zip,
        state: "FL",
      },
      orderBy: [{ contractId: "asc" }, { planId: "asc" }],
    }),
  ]);

  if (zipRows.length === 0) {
    return {
      ok: false,
      error: "No indexed plans found for this ZIP and plan year. Run tpmo:ingest first.",
      zip,
      planYear,
      persistenceMode,
    };
  }

  const activeAppointmentKeys = new Set<string>(appointments.map((row) => String(row.sponsorKey)));
  const normalizedRows: Array<{ planId: string; sponsorKey: SponsorKey }> = zipRows.map((row) => {
    const fallbackNormalize = normalizeSponsorName(row.rawSponsorName, {
      aliases: aliases.rows,
      activeAppointmentSponsorKeys: activeAppointmentKeys,
      defaultAliasMapVersion: aliases.aliasMapVersion,
    });

    const sponsorKey = (row.sponsorKey || fallbackNormalize.sponsorKey) as SponsorKey;
    return {
      planId: row.planId,
      sponsorKey,
    };
  });

  const knownAllRows = normalizedRows.filter((row) => row.sponsorKey !== "unknown");
  const unknownRows = normalizedRows.filter((row) => row.sponsorKey === "unknown");
  const representedRows = knownAllRows.filter((row) => activeAppointmentKeys.has(row.sponsorKey));

  const allPlanSet = new Set<string>(knownAllRows.map((row) => row.planId));
  const representedPlanSet = new Set<string>(representedRows.map((row) => row.planId));
  const representedOrgSet = new Set<SponsorKey>(representedRows.map((row) => row.sponsorKey));

  const organizations = Array.from(representedOrgSet).sort();
  const plansSample = Array.from(representedPlanSet).sort().slice(0, 10);
  const representsAllPlans = allPlanSet.size > 0 && representedPlanSet.size === allPlanSet.size;

  const disclaimer = buildTpmoDisclaimer({
    orgCount: organizations.length,
    planCount: representedPlanSet.size,
    representsAllPlans,
  });

  await prisma.tpmoCountLookupLog.create({
    data: {
      planYear,
      zip,
      orgCount: organizations.length,
      planCount: representedPlanSet.size,
      orgsJson: parseJsonInput(organizations),
      source,
      datasetVersion: meta?.datasetVersion || "unknown",
      aliasMapVersion: aliases.aliasMapVersion,
      requestContextJson: parseJsonInput({
        callId: input.context?.callId || "",
        channel,
        discussionStage: input.context?.discussionStage || "",
        actorId: input.context?.actorId || "",
        actorRole: input.context?.actorRole || "",
        callRecordingConsent: input.context?.callRecordingConsent === true,
        soaOnFile: input.context?.soaOnFile === true,
        cfuConfirmed: input.context?.cfuConfirmed === true,
        beneficiaryInitiated: input.context?.beneficiaryInitiated === true,
        computedPostConsent: isCallChannel(channel) ? input.context?.callRecordingConsent === true : true,
        unknownSponsorCount: unknownRows.length,
      }),
      persistenceMode,
    },
  });

  return {
    ok: true,
    zip,
    planYear,
    org_count: organizations.length,
    plan_count: representedPlanSet.size,
    organizations,
    plans_sample: plansSample,
    represents_all_plans: representsAllPlans,
    disclaimer,
    persistenceMode,
    dataset: {
      source,
      version: meta?.datasetVersion || "unknown",
      refreshedAt: meta?.refreshedAt.toISOString() || null,
    },
    aliasMapVersion: aliases.aliasMapVersion,
  };
}
