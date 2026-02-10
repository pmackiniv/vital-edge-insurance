export const TPMO_ALIAS_MAP_VERSION = "tpmo-alias-v1";
export const TPMO_DATASET_SOURCE = "cms_landscape";

export type SponsorKey =
  | "florida_blue"
  | "gold_kidney"
  | "humana"
  | "uhc"
  | "aetna"
  | "freedom"
  | "optimum"
  | "careplus"
  | "unknown";

export type CanonicalSponsorKey = Exclude<SponsorKey, "unknown">;

export type SponsorSeed = {
  sponsorKey: CanonicalSponsorKey;
  displayName: string;
  countsAsSeparateOrg: boolean;
  status?: "active" | "inactive";
  state?: string;
};

export const APPOINTMENT_SPONSOR_SEEDS: SponsorSeed[] = [
  { sponsorKey: "florida_blue", displayName: "Florida Blue", countsAsSeparateOrg: true },
  { sponsorKey: "gold_kidney", displayName: "Gold Kidney", countsAsSeparateOrg: true },
  { sponsorKey: "humana", displayName: "Humana", countsAsSeparateOrg: true },
  { sponsorKey: "uhc", displayName: "UnitedHealthcare", countsAsSeparateOrg: true },
  { sponsorKey: "aetna", displayName: "Aetna", countsAsSeparateOrg: true },
  { sponsorKey: "freedom", displayName: "Freedom Health", countsAsSeparateOrg: true },
  { sponsorKey: "optimum", displayName: "Optimum HealthCare", countsAsSeparateOrg: true },
];

export type SponsorAliasSeed = {
  alias: string;
  sponsorKey: CanonicalSponsorKey;
  priority?: number;
  active?: boolean;
  version?: string;
};

export const SPONSOR_ALIAS_SEEDS: SponsorAliasSeed[] = [
  { alias: "Florida Blue", sponsorKey: "florida_blue" },
  { alias: "Blue Cross Blue Shield of Florida", sponsorKey: "florida_blue" },
  { alias: "Gold Kidney", sponsorKey: "gold_kidney" },
  { alias: "Humana", sponsorKey: "humana" },
  { alias: "Humana Insurance Company", sponsorKey: "humana" },
  { alias: "CarePlus", sponsorKey: "humana" },
  { alias: "CarePlus Health Plans, Inc.", sponsorKey: "humana" },
  { alias: "UnitedHealthcare", sponsorKey: "uhc" },
  { alias: "United HealthCare", sponsorKey: "uhc" },
  { alias: "Aetna", sponsorKey: "aetna" },
  { alias: "Aetna Medicare", sponsorKey: "aetna" },
  { alias: "Freedom Health", sponsorKey: "freedom" },
  { alias: "Freedom Health, Inc.", sponsorKey: "freedom" },
  { alias: "Optimum HealthCare", sponsorKey: "optimum" },
  { alias: "Optimum HealthCare, Inc.", sponsorKey: "optimum" },
];
