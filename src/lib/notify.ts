type LeadNotificationPayload = {
  topic: string;
  county: string;
  contactMethod: string;
  message: string;
  receivedAtIso: string;
};

export type NotificationResult = {
  status: "sent" | "failed" | "skipped";
  reason?: string;
};

function formatMessage(payload: LeadNotificationPayload) {
  const snippet = payload.message.slice(0, 500);
  return [
    "New lead submission",
    `Topic: ${payload.topic || "N/A"}`,
    `County: ${payload.county || "N/A"}`,
    `Contact: ${payload.contactMethod || "N/A"}`,
    `Message: ${snippet || "N/A"}`,
    `Received: ${payload.receivedAtIso}`,
  ].join("\n");
}

export async function sendLeadSms(payload: LeadNotificationPayload): Promise<NotificationResult> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
  const ownerPhone = process.env.OWNER_PHONE;

  if (!accountSid || !authToken || !messagingServiceSid || !ownerPhone) {
    return { status: "skipped", reason: "twilio_not_configured" };
  }

  const body = new URLSearchParams({
    MessagingServiceSid: messagingServiceSid,
    To: ownerPhone,
    Body: formatMessage(payload),
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
    return { status: "failed", reason: "twilio_send_failed" };
  }

  return { status: "sent" };
}

export async function sendLeadEmail(payload: LeadNotificationPayload): Promise<NotificationResult> {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return { status: "skipped", reason: "resend_not_configured" };
  }

  const { Resend } = await import("resend");
  const resend = new Resend(resendKey);
  const to =
    process.env.OWNER_EMAIL ||
    process.env.LEAD_NOTIFY_TO_EMAIL ||
    "pmackiniv27@icloud.com";
  const from =
    process.env.RESEND_FROM ||
    process.env.LEAD_NOTIFY_FROM_EMAIL ||
    "Vital Edge Leads <leads@vitaledgeinsurance.com>";

  await resend.emails.send({
    from,
    to,
    subject: `New lead: ${payload.topic} (${payload.county})`,
    text: formatMessage(payload),
  });

  return { status: "sent" };
}
