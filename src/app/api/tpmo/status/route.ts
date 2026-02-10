import { NextResponse } from "next/server";
import { getTpmoStatus } from "@/lib/tpmo/tpmoCounts";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const planYearParam = Number(url.searchParams.get("planYear"));
  const planYear = Number.isFinite(planYearParam) && planYearParam > 0 ? planYearParam : undefined;
  const status = await getTpmoStatus(planYear);

  return NextResponse.json({
    ok: status.ok,
    planYear: status.planYear,
    source: status.source,
    datasetVersion: status.datasetVersion,
    refreshedAt: status.refreshedAt,
    aliasMapVersion: status.aliasMapVersion,
    databaseConfigured: status.databaseConfigured,
    persistenceMode: status.persistenceMode,
  });
}
