import { NextResponse } from "next/server";

export async function GET() {
  const gitCommit = process.env.VERCEL_GIT_COMMIT_SHA || "unknown";
  const notionConfigured = Boolean(process.env.NOTION_API_KEY && process.env.NOTION_DATABASE_ID);
  const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
  const openaiConfigured = Boolean(process.env.OPENAI_API_KEY);
  const formSubmitConfigured = Boolean(process.env.FORMSUBMIT_TO || process.env.NEXT_PUBLIC_FORMSUBMIT_TO);
  const ownerEmailConfigured = Boolean(process.env.OWNER_EMAIL || process.env.LEAD_NOTIFY_TO_EMAIL);

  return NextResponse.json({
    ok: true,
    gitCommit,
    notionConfigured,
    smtpConfigured,
    openaiConfigured,
    formSubmitConfigured,
    formsSubmitConfigured: formSubmitConfigured,
    ownerEmailConfigured,
  });
}
