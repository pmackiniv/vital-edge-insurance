import { NextResponse } from "next/server";

export async function GET() {
  const notionConfigured = Boolean(process.env.NOTION_API_KEY && process.env.NOTION_DATABASE_ID);
  const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
  const openaiConfigured = Boolean(process.env.OPENAI_API_KEY);
  const formSubmitConfigured = Boolean(process.env.NEXT_PUBLIC_FORMSUBMIT_TO);

  return NextResponse.json({
    ok: true,
    notionConfigured,
    smtpConfigured,
    openaiConfigured,
    formSubmitConfigured,
  });
}
