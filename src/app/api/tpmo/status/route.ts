import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const planYear = Number(url.searchParams.get("planYear")) || new Date().getFullYear();

  return NextResponse.json({
    ok: true,
    planYear,
    source: "cms_landscape",
    datasetVersion: process.env.TPMO_DATASET_VERSION?.trim() || null,
    refreshedAt: process.env.TPMO_DATASET_REFRESHED_AT?.trim() || null,
    aliasMapVersion: process.env.TPMO_ALIAS_MAP_VERSION?.trim() || "tpmo-alias-v1",
    databaseConfigured: Boolean(process.env.DATABASE_URL?.trim()),
    persistenceMode: process.env.DATABASE_URL?.trim() ? "database" : "ephemeral",
  });
}
