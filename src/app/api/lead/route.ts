import { NextResponse } from "next/server";

type LeadPayload = {
  coverageType?: string;
  zipCode?: string;
  contactMethod?: string;
  consent?: boolean;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as LeadPayload;

  if (!payload.coverageType || !payload.zipCode || !payload.contactMethod || !payload.consent) {
    return NextResponse.json({ ok: false, error: "Missing required fields." }, { status: 400 });
  }

  console.log("Lead triage submission:", {
    coverageType: payload.coverageType,
    zipCode: payload.zipCode,
    contactMethod: payload.contactMethod,
    consent: payload.consent,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
