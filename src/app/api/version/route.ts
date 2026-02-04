import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    gitCommit: process.env.VERCEL_GIT_COMMIT_SHA || "unknown",
    vercelEnv: process.env.VERCEL_ENV || "unknown",
    buildTime: new Date().toISOString(),
  });
}
