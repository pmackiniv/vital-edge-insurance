import { NextResponse } from "next/server";
import { queueNotionStub } from "@/lib/notionStub";

const AUTO_REPLY = "Thanks—received. For your privacy, do not send SSN/Medicare ID. We’ll respond shortly.";

function twiml(message: string) {
  return `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${message}</Message></Response>`;
}

function formatTimestampEt(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

async function sendOwnerCopy(payload: { from: string; to: string; body: string; sid: string }) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
  const ownerPhone = process.env.OWNER_PHONE;

  if (!accountSid || !authToken || !messagingServiceSid || !ownerPhone) {
    throw new Error("Missing Twilio environment variables.");
  }

  const timestamp = formatTimestampEt(new Date());
  const messageBody = [
    "New inbound SMS",
    `Time (ET): ${timestamp}`,
    `From: ${payload.from}`,
    `To: ${payload.to}`,
    `MessageSid: ${payload.sid}`,
    "",
    payload.body,
  ].join("\n");

  const body = new URLSearchParams({
    MessagingServiceSid: messagingServiceSid,
    To: ownerPhone,
    Body: messageBody,
  });

  const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    throw new Error("Failed to send owner copy.");
  }
  return response.status;
}

export async function POST(request: Request) {
  const form = await request.formData();
  const from = String(form.get("From") ?? "");
  const to = String(form.get("To") ?? "");
  const body = String(form.get("Body") ?? "");
  const sid = String(form.get("MessageSid") ?? "");

  try {
    await queueNotionStub({ from, to, body, sid });
    const forwardStatus = await sendOwnerCopy({ from, to, body, sid });
    console.info("twilio-inbound", {
      sid,
      from,
      to,
      forwardStatus,
      timestampEt: formatTimestampEt(new Date()),
    });
  } catch (err) {
    console.error("twilio-inbound error (still replying to sender):", err);
  }

  return new NextResponse(twiml(AUTO_REPLY), {
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
