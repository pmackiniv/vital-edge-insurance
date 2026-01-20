import { NextResponse } from "next/server";

type LeadPayload = {
  coverageType?: string;
  zipCode?: string;
  contactMethod?: string;
  goal?: string;
  consent?: boolean;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as LeadPayload;

  if (!payload.coverageType || !payload.zipCode || !payload.contactMethod || !payload.goal || !payload.consent) {
    return NextResponse.json({ ok: false, error: "Missing required fields." }, { status: 400 });
  }

  const sensitivePatterns = [
    /\b\d{3}-?\d{2}-?\d{4}\b/, // SSN format
    /\b\d{9}\b/, // 9-digit sequences
    /\b[0-9A-Z]{11}\b/i, // Medicare-like identifiers (basic)
  ];

  const combined = [payload.coverageType, payload.zipCode, payload.contactMethod, payload.goal].join(" ");
  if (sensitivePatterns.some((pattern) => pattern.test(combined))) {
    return NextResponse.json({ ok: false, error: "Please remove sensitive identifiers." }, { status: 400 });
  }

  console.log("Lead triage submission:", {
    coverageType: payload.coverageType,
    zipCode: payload.zipCode,
    contactMethod: payload.contactMethod,
    goal: payload.goal,
    consent: payload.consent,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
