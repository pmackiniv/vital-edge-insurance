import { NextResponse } from "next/server";
import { buildAssistantResponse } from "@/lib/assistantKnowledge";

type AssistantPayload = {
  question?: string;
};

const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT_MAX = 12;
const rateLimitStore = new Map<string, number[]>();

const sensitivePatterns = [
  /\b\d{3}-?\d{2}-?\d{4}\b/, // SSN format
  /\b\d{9}\b/, // 9-digit sequences
  /\b\d{10,}\b/, // longer numeric sequences
  /\b[0-9A-Z]{11}\b/i, // Medicare-like identifiers (basic length)
  /\b(?=[0-9A-Z]*[A-Z])(?=[0-9A-Z]*\d)[0-9A-Z]{11}\b/i, // alphanumeric 11 chars
  /\b(ssn|social security|medicare id|mbi)\b/i,
];

export async function POST(request: Request) {
  const payload = (await request.json()) as AssistantPayload;
  const question = payload.question?.trim() || "";

  if (!question) {
    return NextResponse.json({ ok: false, error: "Please enter a question." }, { status: 400 });
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

  if (sensitivePatterns.some((pattern) => pattern.test(question))) {
    return NextResponse.json(
      {
        ok: true,
        answer: "Please remove sensitive identifiers like SSNs or Medicare IDs. I can still help with general guidance.",
        topic: "Privacy",
        resources: [],
        shouldEscalate: true,
        escalationReason: "Sensitive identifiers should never be shared in chat.",
      },
      { status: 200 },
    );
  }

  const response = buildAssistantResponse(question);

  return NextResponse.json({
    ok: true,
    ...response,
  });
}
