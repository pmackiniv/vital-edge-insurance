import { NextResponse } from "next/server";
import { appendAgentEvent } from "@/lib/agentEvents";
import { getTpmoCounts, type TpmoCountContext } from "@/lib/tpmo/tpmoCounts";

type TpmoCountsRequest = {
  zip?: string;
  planYear?: number;
  context?: TpmoCountContext;
};

function statusCodeForError(error: string): number {
  if (error.includes("ZIP must be")) return 400;
  if (error.includes("callRecordingConsent")) return 400;
  if (error.includes("No indexed plans")) return 404;
  if (error.includes("DATABASE_URL")) return 503;
  return 400;
}

export async function POST(req: Request) {
  let body: TpmoCountsRequest;
  try {
    body = (await req.json()) as TpmoCountsRequest;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const zip = String(body.zip || "");
  const planYear = Number(body.planYear) || new Date().getFullYear();
  const context: TpmoCountContext = body.context || {};

  const result = await getTpmoCounts({
    zip,
    planYear,
    context,
  });

  if (!result.ok) {
    await appendAgentEvent({
      event_type: "tpmo_count_lookup",
      status: "failed",
      summary: `TPMO count lookup failed for ZIP ${zip || "unknown"}`,
      route: "/api/tpmo/counts",
      compliance_result: "none",
      meta: {
        error: result.error,
        planYear,
        callId: context.callId || "",
        discussionStage: context.discussionStage || "",
        actorId: context.actorId || "",
        actorRole: context.actorRole || "",
        persistenceMode: result.persistenceMode,
      },
    });

    return NextResponse.json(
      {
        ok: false,
        error: result.error,
        zip: result.zip,
        planYear: result.planYear,
        persistenceMode: result.persistenceMode,
      },
      { status: statusCodeForError(result.error) },
    );
  }

  await appendAgentEvent({
    event_type: "tpmo_count_lookup",
    status: "ok",
    summary: `TPMO count lookup ${result.zip}: ${result.org_count} orgs / ${result.plan_count} plans`,
    route: "/api/tpmo/counts",
    compliance_result: "none",
    meta: {
      zip: result.zip,
      planYear: result.planYear,
      callId: context.callId || "",
      discussionStage: context.discussionStage || "",
      actorId: context.actorId || "",
      actorRole: context.actorRole || "",
      orgCount: result.org_count,
      planCount: result.plan_count,
      persistenceMode: result.persistenceMode,
      aliasMapVersion: result.aliasMapVersion,
    },
  });

  return NextResponse.json(result);
}
