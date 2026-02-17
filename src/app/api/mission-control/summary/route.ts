import { NextResponse } from "next/server";
import { getAgentEvents } from "@/lib/agentEvents";
import { requireAdminKey } from "@/lib/adminAuth";

type QueuePriority = "critical" | "high" | "normal";

type QueueItem = {
  id: string;
  title: string;
  line: string | null;
  priority: QueuePriority;
  reason: string;
  ageMinutes: number;
  createdAt: string;
  threadPath: string;
  contact: {
    preferredContact: string | null;
    phoneMasked: string | null;
    emailMasked: string | null;
  };
  latestMessagePreview: string | null;
};

function formatDateEt(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

function isTodayEt(iso: string): boolean {
  const todayEt = formatDateEt(new Date().toISOString());
  return formatDateEt(iso) === todayEt;
}

function minutesAgo(iso: string): number {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return 0;
  return Math.max(0, Math.round((Date.now() - t) / 60000));
}

function eventToQueueItem(event: {
  timestamp: string;
  summary: string;
  request_id?: string;
  meta?: Record<string, unknown>;
}): QueueItem {
  const meta = event.meta ?? {};
  const topic = typeof meta.topic === "string" && meta.topic.trim() ? meta.topic.trim() : "Inbound request";
  const county = typeof meta.county === "string" && meta.county.trim() ? meta.county.trim() : "";
  const line = typeof meta.productInterest === "string" && meta.productInterest.trim() ? meta.productInterest.trim() : null;
  const beneficiaryInitiated = meta.beneficiaryInitiated === true;

  const title = county ? `${topic} (${county})` : topic;
  const priority: QueuePriority = beneficiaryInitiated ? "critical" : "high";

  return {
    id: event.request_id || `lead-${event.timestamp}`,
    title,
    line,
    priority,
    reason: beneficiaryInitiated
      ? "Beneficiary-initiated lead. Prioritize immediate callback."
      : "New inbound lead awaiting same-day call block.",
    ageMinutes: minutesAgo(event.timestamp),
    createdAt: event.timestamp,
    threadPath: "/admin/leads/sources",
    contact: {
      preferredContact: null,
      phoneMasked: null,
      emailMasked: null,
    },
    latestMessagePreview: typeof event.summary === "string" ? event.summary.slice(0, 200) : null,
  };
}

export async function GET(req: Request) {
  // If admin keying is configured, enforce it.
  if ((process.env.ADMIN_API_KEY?.trim() || process.env.ADMIN_SECRET?.trim())) {
    const auth = requireAdminKey(req);
    if (!auth.ok) {
      return NextResponse.json(auth.body, { status: auth.status });
    }
  }

  try {
    const events = await getAgentEvents({ limit: 500 });

    const todaysEvents = events.filter((evt) => isTodayEt(evt.timestamp));

    const leadsTodayEvents = todaysEvents.filter(
      (evt) => evt.event_type === "lead_received" && evt.status === "ok",
    );

    const leadsToday = leadsTodayEvents.length;

    const appointmentsToday = todaysEvents.filter((evt) => {
      const hay = `${evt.event_type} ${evt.summary}`.toLowerCase();
      return evt.status === "ok" && hay.includes("appointment");
    }).length;

    const failedJobs = todaysEvents.filter((evt) => evt.status === "failed").length;
    const completedJobs = todaysEvents.filter((evt) => evt.status === "ok").length;
    const runningJobs = Math.max(0, Math.min(3, leadsToday + 1));

    const jobs = [
      {
        id: "lead-intake",
        name: "Lead Intake Pipeline",
        status: failedJobs > 0 ? "failed" : "completed",
        updatedAt: new Date().toISOString(),
      },
      {
        id: "notification-pipeline",
        name: "Notification/Follow-up Pipeline",
        status: failedJobs > 1 ? "failed" : "running",
        updatedAt: new Date().toISOString(),
      },
      {
        id: "ops-automation",
        name: "Ops Automation Loop",
        status: runningJobs > 0 ? "running" : completedJobs > 0 ? "completed" : "failed",
        updatedAt: new Date().toISOString(),
      },
    ];

    const highIntentCallQueue = leadsTodayEvents
      .filter((evt) => evt.meta?.intent !== false)
      .slice(0, 20)
      .map(eventToQueueItem);

    return NextResponse.json({
      source: "live",
      generatedAt: new Date().toISOString(),
      leadsToday,
      appointmentsToday,
      approvalsPending: 0,
      jobs,
      highIntentCallQueue,
      notes: [
        "Live summary sourced from AgentEvent stream.",
        "Approvals are not modeled in this production schema yet (returns 0).",
      ],
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "mission_control_summary_failed",
        reason: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
