import { sendLeadEmail as sendLeadEmailViaSmtp } from "@/lib/notify/email";

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
  /** Twilio error code when status === "failed" (e.g. 30032 for unverified toll-free) */
  errorCode?: number;
  provider?: "smtp" | "formsubmit";
};

function isSmsDisabled() {
  const value = process.env.LEAD_SMS_DISABLED;
  return !!value && ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

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
  if (isSmsDisabled()) {
    return { status: "skipped", reason: "sms_disabled" };
  }

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
    let errorCode: number | undefined;
    let errorMessage: string | undefined;
    try {
      const errBody = (await response.json()) as { code?: number; message?: string; error_code?: number };
      errorCode = errBody.code ?? errBody.error_code;
      errorMessage = errBody.message;
    } catch {
      // ignore parse errors
    }
    const reason =
      errorCode != null
        ? `twilio_${errorCode}${errorMessage ? `: ${errorMessage}` : ""}`
        : errorMessage
          ? `twilio_send_failed: ${errorMessage}`
          : "twilio_send_failed";
    return { status: "failed", reason, errorCode };
  }

  return { status: "sent" };
}

/**
 * Send lead notification email via SMTP with optional fallback.
 * Logging is done inside the email module (lead_email).
 */
export async function sendLeadEmail(payload: LeadNotificationPayload): Promise<NotificationResult> {
  const result = await sendLeadEmailViaSmtp(payload);
  if (result.status === "sent") return { status: "sent", provider: result.provider };
  if (result.status === "skipped") return { status: "skipped", reason: result.reason, provider: result.provider };
  return { status: "failed", reason: result.reason, provider: result.provider };
}
