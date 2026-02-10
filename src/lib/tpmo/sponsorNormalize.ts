import { TPMO_ALIAS_MAP_VERSION, type CanonicalSponsorKey, type SponsorKey } from "@/lib/tpmo/constants";

export type SponsorAliasRecord = {
  alias: string;
  sponsorKey: CanonicalSponsorKey;
  priority: number;
  active: boolean;
  version: string;
};

export type SponsorNormalizeOptions = {
  aliases?: SponsorAliasRecord[];
  activeAppointmentSponsorKeys?: Set<string>;
  defaultAliasMapVersion?: string;
};

export type SponsorNormalizeResult = {
  sponsorKey: SponsorKey;
  matchedAlias: string | null;
  aliasMapVersion: string;
  matchType: "exact_alias" | "rule" | "unknown";
};

function normalizeToken(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeAliasRows(input: SponsorAliasRecord[] | undefined): SponsorAliasRecord[] {
  return (input || [])
    .filter((row) => row.active)
    .slice()
    .sort((a, b) => a.priority - b.priority || a.alias.localeCompare(b.alias));
}

function builtInRuleMatch(normalizedName: string, activeKeys: Set<string>): SponsorNormalizeResult {
  if (!normalizedName) {
    return {
      sponsorKey: "unknown",
      matchedAlias: null,
      aliasMapVersion: TPMO_ALIAS_MAP_VERSION,
      matchType: "unknown",
    };
  }

  if (normalizedName.includes("careplus")) {
    if (activeKeys.has("careplus")) {
      return {
        sponsorKey: "careplus",
        matchedAlias: "CarePlus",
        aliasMapVersion: TPMO_ALIAS_MAP_VERSION,
        matchType: "rule",
      };
    }
    return {
      sponsorKey: "humana",
      matchedAlias: "CarePlus->Humana",
      aliasMapVersion: TPMO_ALIAS_MAP_VERSION,
      matchType: "rule",
    };
  }
  if (normalizedName.includes("humana")) {
    return { sponsorKey: "humana", matchedAlias: "Humana", aliasMapVersion: TPMO_ALIAS_MAP_VERSION, matchType: "rule" };
  }
  if (normalizedName.includes("unitedhealthcare") || normalizedName.includes("united healthcare")) {
    return { sponsorKey: "uhc", matchedAlias: "UnitedHealthcare", aliasMapVersion: TPMO_ALIAS_MAP_VERSION, matchType: "rule" };
  }
  if (normalizedName.includes("aetna")) {
    return { sponsorKey: "aetna", matchedAlias: "Aetna", aliasMapVersion: TPMO_ALIAS_MAP_VERSION, matchType: "rule" };
  }
  if (normalizedName.includes("freedom health")) {
    return { sponsorKey: "freedom", matchedAlias: "Freedom Health", aliasMapVersion: TPMO_ALIAS_MAP_VERSION, matchType: "rule" };
  }
  if (normalizedName.includes("optimum health")) {
    return { sponsorKey: "optimum", matchedAlias: "Optimum HealthCare", aliasMapVersion: TPMO_ALIAS_MAP_VERSION, matchType: "rule" };
  }
  if (
    normalizedName.includes("florida blue")
    || normalizedName.includes("blue cross blue shield of florida")
    || normalizedName.includes("bcbs florida")
  ) {
    return { sponsorKey: "florida_blue", matchedAlias: "Florida Blue", aliasMapVersion: TPMO_ALIAS_MAP_VERSION, matchType: "rule" };
  }
  if (normalizedName.includes("gold kidney")) {
    return { sponsorKey: "gold_kidney", matchedAlias: "Gold Kidney", aliasMapVersion: TPMO_ALIAS_MAP_VERSION, matchType: "rule" };
  }

  return {
    sponsorKey: "unknown",
    matchedAlias: null,
    aliasMapVersion: TPMO_ALIAS_MAP_VERSION,
    matchType: "unknown",
  };
}

export function normalizeSponsorName(rawName: string, options: SponsorNormalizeOptions = {}): SponsorNormalizeResult {
  const normalizedName = normalizeToken(rawName);
  const activeAppointmentSponsorKeys = options.activeAppointmentSponsorKeys || new Set<string>();
  const aliases = normalizeAliasRows(options.aliases);
  const defaultVersion = options.defaultAliasMapVersion || TPMO_ALIAS_MAP_VERSION;

  for (const aliasRow of aliases) {
    if (normalizeToken(aliasRow.alias) === normalizedName) {
      if (aliasRow.sponsorKey === "careplus" && !activeAppointmentSponsorKeys.has("careplus")) {
        return {
          sponsorKey: "humana",
          matchedAlias: `${aliasRow.alias}->Humana`,
          aliasMapVersion: aliasRow.version || defaultVersion,
          matchType: "exact_alias",
        };
      }
      return {
        sponsorKey: aliasRow.sponsorKey,
        matchedAlias: aliasRow.alias,
        aliasMapVersion: aliasRow.version || defaultVersion,
        matchType: "exact_alias",
      };
    }
  }

  const ruleMatch = builtInRuleMatch(normalizedName, activeAppointmentSponsorKeys);
  return {
    ...ruleMatch,
    aliasMapVersion: options.defaultAliasMapVersion || ruleMatch.aliasMapVersion || defaultVersion,
  };
}
