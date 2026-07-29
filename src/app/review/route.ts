import { NextResponse } from "next/server";
import { resolveGoogleBusinessProfileDestination } from "@/lib/googleBusinessProfile";

export const dynamic = "force-dynamic";

export function GET() {
  const destination = resolveGoogleBusinessProfileDestination(
    process.env.GOOGLE_BUSINESS_PROFILE_REVIEW_URL,
    process.env.GOOGLE_BUSINESS_PROFILE_URL,
  );
  const response = NextResponse.redirect(destination, 302);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
