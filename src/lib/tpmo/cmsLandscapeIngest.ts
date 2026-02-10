import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { getPersistenceMode, getPrismaClient } from "@/lib/prisma";
import { TPMO_ALIAS_MAP_VERSION, TPMO_DATASET_SOURCE } from "@/lib/tpmo/constants";
import { ensureTpmoTables } from "@/lib/tpmo/db";
import { normalizeSponsorName, type SponsorAliasRecord } from "@/lib/tpmo/sponsorNormalize";

type CsvRow = Record<string, string>;

export type IngestCmsLandscapeInput = {
  filePath: string;
  planYear: number;
  datasetVersion: string;
  source?: string;
  stateDefault?: string;
};

export type IngestCmsLandscapeResult = {
  ok: boolean;
  source: string;
  planYear: number;
  datasetVersion: string;
  rowCount: number;
  insertedCount: number;
  skippedCount: number;
  fileChecksum: string;
  aliasMapVersion: string;
  persistenceMode: "database" | "ephemeral";
};

function normalizeHeader(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === "\"") {
      const next = line[i + 1];
      if (inQuotes && next === "\"") {
        current += "\"";
        i += 1;
        continue;
      }
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === "," && !inQuotes) {
      out.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  out.push(current);
  return out.map((s) => s.trim());
}

function parseCsvRows(raw: string): CsvRow[] {
  const lines = raw
    .replace(/\uFEFF/g, "")
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);

  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]).map((h) => normalizeHeader(h));
  const rows: CsvRow[] = [];

  for (let i = 1; i < lines.length; i += 1) {
    const values = parseCsvLine(lines[i]);
    const row: CsvRow = {};
    for (let j = 0; j < headers.length; j += 1) {
      row[headers[j]] = values[j] ?? "";
    }
    rows.push(row);
  }
  return rows;
}

function pickField(row: CsvRow, keys: string[]): string {
  for (const key of keys) {
    const normalizedKey = normalizeHeader(key);
    const value = row[normalizedKey];
    if (value && value.trim()) return value.trim();
  }
  return "";
}

function normalizeZip(value: string): string {
  const digits = String(value || "").replace(/\D/g, "");
  return digits.slice(0, 5);
}

function normalizePlanId(contractId: string, planValue: string): string {
  const contract = contractId.trim().toUpperCase();
  const cleanPlan = planValue.trim().toUpperCase().replace(/\s+/g, "");
  if (!contract && !cleanPlan) return "";
  if (!contract) return cleanPlan;
  if (!cleanPlan) return contract;
  return cleanPlan.startsWith(`${contract}-`) ? cleanPlan : `${contract}-${cleanPlan}`;
}

async function loadAliasRows(): Promise<SponsorAliasRecord[]> {
  const prisma = getPrismaClient();
  if (!prisma) return [];
  await ensureTpmoTables();
  const rows = await prisma.sponsorAlias.findMany({
    where: { active: true },
    orderBy: [{ priority: "asc" }, { alias: "asc" }],
  });
  return rows.map((row: any) => ({
    alias: row.alias,
    sponsorKey: row.sponsorKey as SponsorAliasRecord["sponsorKey"],
    priority: row.priority,
    active: row.active,
    version: row.version,
  }));
}

async function loadActiveAppointments(): Promise<Set<string>> {
  const prisma = getPrismaClient();
  if (!prisma) return new Set();
  await ensureTpmoTables();
  const now = new Date();
  const rows = await prisma.appointmentSponsor.findMany({
    where: {
      state: "FL",
      status: "active",
      effectiveDate: { lte: now },
      OR: [{ terminationDate: null }, { terminationDate: { gte: now } }],
    },
    select: { sponsorKey: true },
  });
  return new Set(rows.map((row: any) => row.sponsorKey));
}

export async function ingestCmsLandscape(input: IngestCmsLandscapeInput): Promise<IngestCmsLandscapeResult> {
  const prisma = getPrismaClient();
  const persistenceMode = getPersistenceMode();
  if (!prisma) {
    throw new Error("DATABASE_URL is required to ingest CMS landscape data.");
  }

  await ensureTpmoTables();

  const source = input.source?.trim() || TPMO_DATASET_SOURCE;
  const planYear = Math.trunc(input.planYear);
  const datasetVersion = input.datasetVersion.trim();
  const stateDefault = input.stateDefault?.trim().toUpperCase() || "FL";

  const raw = await readFile(input.filePath, "utf8");
  const fileChecksum = createHash("sha256").update(raw).digest("hex");
  const parsed = parseCsvRows(raw);
  const aliases = await loadAliasRows();
  const aliasMapVersion = aliases[0]?.version || TPMO_ALIAS_MAP_VERSION;
  const activeAppointments = await loadActiveAppointments();

  const dedup = new Map<string, {
    planYear: number;
    zip: string;
    countyFips: string | null;
    state: string;
    contractId: string;
    planId: string;
    rawSponsorName: string;
    sponsorKey: string | null;
    datasetVersion: string;
  }>();

  for (const row of parsed) {
    const zip = normalizeZip(pickField(row, ["zip", "zip_code", "zipcode"]));
    if (zip.length !== 5) continue;

    const state = pickField(row, ["state", "state_abbreviation", "state_abbr"]).toUpperCase() || stateDefault;
    const contractId = pickField(row, ["contract_id", "contract", "contract_number"]).toUpperCase();
    const planValue = pickField(row, ["plan_id", "plan", "pbp", "pbp_id", "plan_number"]);
    const planId = normalizePlanId(contractId, planValue);
    if (!contractId || !planId) continue;

    const rawSponsorName = pickField(row, [
      "raw_sponsor_name",
      "organization_name",
      "organization",
      "sponsor_name",
      "sponsor",
      "issuer_name",
      "parent_organization",
    ]);
    if (!rawSponsorName) continue;

    const normalizedSponsor = normalizeSponsorName(rawSponsorName, {
      aliases,
      activeAppointmentSponsorKeys: activeAppointments,
      defaultAliasMapVersion: aliasMapVersion,
    });

    const normalizedRecord = {
      planYear,
      zip,
      countyFips: pickField(row, ["county_fips", "fips", "county_code"]) || null,
      state,
      contractId,
      planId,
      rawSponsorName,
      sponsorKey: normalizedSponsor.sponsorKey === "unknown" ? null : normalizedSponsor.sponsorKey,
      datasetVersion,
    };

    const uniqueKey = [
      normalizedRecord.planYear,
      normalizedRecord.zip,
      normalizedRecord.state,
      normalizedRecord.contractId,
      normalizedRecord.planId,
      normalizedRecord.datasetVersion,
    ].join("|");
    dedup.set(uniqueKey, normalizedRecord);
  }

  const records = Array.from(dedup.values());

  await prisma.planIndex.deleteMany({
    where: { planYear, datasetVersion },
  });

  let insertedCount = 0;
  const batchSize = 1000;
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    const result = await prisma.planIndex.createMany({ data: batch });
    insertedCount += result.count;
  }

  await prisma.tpmoDatasetMeta.upsert({
    where: {
      source_planYear_datasetVersion: {
        source,
        planYear,
        datasetVersion,
      },
    },
    create: {
      source,
      planYear,
      datasetVersion,
      refreshedAt: new Date(),
      fileChecksum,
      rowCount: records.length,
    },
    update: {
      refreshedAt: new Date(),
      fileChecksum,
      rowCount: records.length,
    },
  });

  return {
    ok: true,
    source,
    planYear,
    datasetVersion,
    rowCount: records.length,
    insertedCount,
    skippedCount: Math.max(0, parsed.length - records.length),
    fileChecksum,
    aliasMapVersion,
    persistenceMode,
  };
}
