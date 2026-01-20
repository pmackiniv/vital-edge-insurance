import { NextResponse } from "next/server";

type LeadPayload = {
  topic?: string;
  county?: string;
  contactMethod?: string;
  message?: string;
  consent?: boolean;
  coverageType?: string;
  zipCode?: string;
  goal?: string;
};

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateLimitStore = new Map<string, number[]>();

export async function POST(request: Request) {
  const payload = (await request.json()) as LeadPayload;

  const topic = payload.topic || payload.coverageType || "";
  const county = payload.county || payload.zipCode || "";
  const contactMethod = payload.contactMethod || "";
  const message = payload.message || payload.goal || "";

  if (!topic || !county || !contactMethod || !message || !payload.consent) {
    return NextResponse.json({ ok: false, error: "Missing required fields." }, { status: 400 });
  }

  const ipHeader = request.headers.get("x-forwarded-for") || "";
  const ip = ipHeader.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const history = (rateLimitStore.get(ip) || []).filter((timestamp) => timestamp > windowStart);
  if (history.length >= RATE_LIMIT_MAX) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please wait a few minutes and try again." },
      { status: 429 },
    );
  }
  history.push(now);
  rateLimitStore.set(ip, history);

  const sensitivePatterns = [
    /\b\d{3}-?\d{2}-?\d{4}\b/, // SSN format
    /\b\d{9}\b/, // 9-digit sequences
    /\b\d{10,}\b/, // longer numeric sequences
    /\b[0-9A-Z]{11}\b/i, // Medicare-like identifiers (basic length)
    /\b(?=[0-9A-Z]*[A-Z])(?=[0-9A-Z]*\d)[0-9A-Z]{11}\b/i, // alphanumeric 11 chars
    /\b(ssn|social security|medicare id|mbi)\b/i,
  ];

  const combined = [topic, county, contactMethod, message].join(" ");
  if (sensitivePatterns.some((pattern) => pattern.test(combined))) {
    return NextResponse.json({ ok: false, error: "Please remove sensitive identifiers." }, { status: 400 });
  }

  console.log("Lead triage submission:", {
    topic,
    county,
    contactMethod,
    message,
    consent: payload.consent,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
