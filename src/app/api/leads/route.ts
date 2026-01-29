import { NextResponse } from "next/server";
import { Resend } from "resend";

type LeadPayload = {
  topic?: string;
  county?: string;
  contactMethod?: string;
  message?: string;
  consent?: boolean;
};

const sensitivePatterns = [
  /\b\d{3}-?\d{2}-?\d{4}\b/, // SSN format
  /\b\d{9}\b/, // 9-digit sequences
  /\b\d{10,}\b/, // longer numeric sequences
  /\b[0-9A-Z]{11}\b/i, // Medicare-like identifiers (basic length)
  /\b(?=[0-9A-Z]*[A-Z])(?=[0-9A-Z]*\d)[0-9A-Z]{11}\b/i, // alphanumeric 11 chars
  /\b(ssn|social security|medicare id|mbi)\b/i,
];

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LeadPayload;
    const topic = body.topic?.trim() || "";
    const county = body.county?.trim() || "";
    const contactMethod = body.contactMethod?.trim() || "";
    const message = body.message?.trim() || "";

    if (!topic || !county || !contactMethod || !message || !body.consent) {
      return NextResponse.json({ ok: false, error: "Missing required fields." }, { status: 400 });
    }

    const combined = [topic, county, contactMethod, message].join(" ");
    if (sensitivePatterns.some((pattern) => pattern.test(combined))) {
      return NextResponse.json({ ok: false, error: "Please remove sensitive identifiers." }, { status: 400 });
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      return NextResponse.json({ ok: false, error: "Notification service is not configured." }, { status: 500 });
    }

    const resend = new Resend(resendKey);
    const to = process.env.LEAD_NOTIFY_TO_EMAIL || "pmackiniv27@icloud.com";
    const from = process.env.LEAD_NOTIFY_FROM_EMAIL || "Vital Edge Leads <leads@vitaledgeinsurance.com>";

    await resend.emails.send({
      from,
      to,
      subject: `New lead: ${topic} (${county})`,
      text:
        `New lead submission\n\n` +
        `Topic: ${topic}\n` +
        `County: ${county}\n` +
        `Contact method: ${contactMethod}\n` +
        `Message: ${message}\n` +
        `Consent: ${String(body.consent)}\n` +
        `Received: ${new Date().toISOString()}\n`,
    });

    return NextResponse.json({ ok: true, message: "Got it, Patrick will follow up." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: "Server error." }, { status: 500 });
  }
}
