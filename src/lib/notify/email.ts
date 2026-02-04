/**
 * Single email provider: SMTP via Nodemailer.
 * Uses SMTP_* and OWNER_EMAIL env vars.
 */

import nodemailer from "nodemailer";

export type EmailResult = {
  status: "sent" | "skipped" | "error";
  reason?: string;
  provider: "smtp" | "formsubmit";
};

function getTo(): string {
  return (
    process.env.OWNER_EMAIL ||
    process.env.LEAD_NOTIFY_TO_EMAIL ||
    "pmackiniv27@icloud.com"
  );
}

function getFrom(): string {
  return (
    process.env.LEAD_NOTIFY_FROM_EMAIL ||
    "Vital Edge Insurance <noreply@vitaledgeinsurance.com>"
  );
}

function isSmtpConfigured(): boolean {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS;
  return !!(host && user && pass);
}

function getFormSubmitTo(): string {
  return process.env.FORMSUBMIT_TO?.trim() || process.env.NEXT_PUBLIC_FORMSUBMIT_TO?.trim() || "";
}

async function sendLeadEmailViaSmtp(payload: {
  topic: string;
  county: string;
  contactMethod: string;
  message: string;
  receivedAtIso: string;
}): Promise<EmailResult> {
  const to = getTo();
  const from = getFrom();

  if (!isSmtpConfigured()) {
    return { status: "skipped", reason: "smtp_not_configured", provider: "smtp" };
  }

  const secure = process.env.SMTP_SECURE === "true" || process.env.SMTP_SECURE === "1";
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : secure ? 465 : 587;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST?.trim(),
    port: Number.isNaN(port) ? (secure ? 465 : 587) : port,
    secure,
    auth: {
      user: process.env.SMTP_USER?.trim(),
      pass: process.env.SMTP_PASS,
    },
  });

  const text = [
    "New lead submission",
    `Topic: ${payload.topic || "N/A"}`,
    `County: ${payload.county || "N/A"}`,
    `Contact: ${payload.contactMethod || "N/A"}`,
    `Message: ${(payload.message || "N/A").slice(0, 500)}`,
    `Received: ${payload.receivedAtIso}`,
  ].join("\n");

  try {
    await transporter.sendMail({
      from,
      to,
      subject: `New lead: ${payload.topic} (${payload.county})`,
      text,
    });
    return { status: "sent", provider: "smtp" };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { status: "error", reason: message, provider: "smtp" };
  }
}

async function sendLeadEmailViaFormSubmit(payload: {
  topic: string;
  county: string;
  contactMethod: string;
  message: string;
  receivedAtIso: string;
}): Promise<EmailResult> {
  const to = getFormSubmitTo();
  if (!to) {
    return { status: "skipped", reason: "formsubmit_not_configured", provider: "formsubmit" };
  }

  const body = new URLSearchParams({
    topic: payload.topic || "General inquiry",
    county: payload.county || "N/A",
    contact: payload.contactMethod || "N/A",
    message: payload.message || "N/A",
    _subject: `New lead: ${payload.topic || "General"} (${payload.county || "N/A"})`,
  });

  try {
    const res = await fetch(`https://formsubmit.co/${to}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    if (!res.ok) {
      const snippet = (await res.text()).slice(0, 200);
      return { status: "error", reason: `formsubmit_${res.status}: ${snippet}`, provider: "formsubmit" };
    }

    return { status: "sent", provider: "formsubmit" };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { status: "error", reason: message, provider: "formsubmit" };
  }
}

/**
 * Send a lead notification email via SMTP. Logs lead_email for Vercel runtime.
 */
export async function sendLeadEmail(payload: {
  topic: string;
  county: string;
  contactMethod: string;
  message: string;
  receivedAtIso: string;
}): Promise<EmailResult> {
  if (isSmtpConfigured()) {
    const smtpResult = await sendLeadEmailViaSmtp(payload);
    console.info("lead_email", {
      status: smtpResult.status,
      reason: smtpResult.reason,
      provider: smtpResult.provider,
    });
    return smtpResult;
  }

  const formResult = await sendLeadEmailViaFormSubmit(payload);
  console.info("lead_email", {
    status: formResult.status,
    reason: formResult.reason,
    provider: formResult.provider,
  });
  return formResult;
}

/**
 * Send handoff email (e.g. from agent) via SMTP.
 */
export async function sendHandoffEmail(payload: {
  reason: string;
  summary: string;
  contactInfo?: string;
}): Promise<EmailResult> {
  const to = getTo();
  const from = getFrom();

  if (!isSmtpConfigured()) {
    return { status: "skipped", reason: "smtp_not_configured", provider: "smtp" };
  }

  const secure = process.env.SMTP_SECURE === "true" || process.env.SMTP_SECURE === "1";
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : secure ? 465 : 587;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST?.trim(),
    port: Number.isNaN(port) ? (secure ? 465 : 587) : port,
    secure,
    auth: {
      user: process.env.SMTP_USER?.trim(),
      pass: process.env.SMTP_PASS,
    },
  });

  const text = [
    `Agent handoff: ${payload.reason}`,
    "",
    "Summary:",
    payload.summary,
    payload.contactInfo ? `\nContact info: ${payload.contactInfo}` : "",
    `\nReceived: ${new Date().toISOString()}`,
  ].join("\n");

  try {
    await transporter.sendMail({
      from,
      to,
      subject: `Agent handoff: ${payload.reason.slice(0, 60)}`,
      text,
    });
    return { status: "sent", provider: "smtp" };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { status: "error", reason: message, provider: "smtp" };
  }
}
