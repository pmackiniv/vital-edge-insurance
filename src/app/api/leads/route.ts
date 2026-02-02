import { NextResponse } from "next/server";
import { findSensitiveIdentifier } from "@/lib/leadGuard";
import { sendLeadEmail, sendLeadSms } from "@/lib/notify";

type LeadPayload = {
  topic?: string;
  county?: string;
  contactMethod?: string;
  message?: string;
  consent?: boolean;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LeadPayload;
    const contactMethod = body.contactMethod?.trim() || "";

    if (!body.consent || !contactMethod) {
      return NextResponse.json({ ok: false, error: "Missing required fields." }, { status: 400 });
    }

    const topic = body.topic?.trim() || "General inquiry";
    const county = body.county?.trim() || "";
    const message = body.message?.trim() || "";

    const sensitiveError = findSensitiveIdentifier(message);
    if (sensitiveError) {
      return NextResponse.json({ ok: false, error: sensitiveError }, { status: 400 });
    }

    const receivedAtIso = new Date().toISOString();
    const payload = {
      topic,
      county,
      contactMethod,
      message,
      receivedAtIso,
    };

    const notifications: {
      email: { status: "sent" | "failed" | "skipped"; reason?: string };
      sms: { status: "sent" | "failed" | "skipped"; reason?: string };
    } = {
      email: { status: "skipped" },
      sms: { status: "skipped" },
    };

    try {
      notifications.email = await sendLeadEmail(payload);
    } catch (error) {
      console.error("Lead email notify failed:", error);
      notifications.email = { status: "failed" as const };
    }

    try {
      notifications.sms = await sendLeadSms(payload);
    } catch (error) {
      console.error("Lead SMS notify failed:", error);
      notifications.sms = { status: "failed" as const };
    }

    return NextResponse.json({ ok: true, message: "Got it, Patrick will follow up.", notifications });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: "Server error." }, { status: 500 });
  }
}
