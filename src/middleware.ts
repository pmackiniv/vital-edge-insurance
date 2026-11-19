import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { canBypassAdminLock, isLockedAdminPath, isPublicAdminLockEnabled } from "@/lib/publicAdminLock";

function withStagingNoIndex(request: NextRequest, response: NextResponse) {
  const host = (request.headers.get("host") || request.nextUrl.hostname || "").toLowerCase();
  if (host.endsWith(".vercel.app")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

export function middleware(request: NextRequest) {
  if (!isPublicAdminLockEnabled(process.env.PUBLIC_ADMIN_LOCK)) {
    return withStagingNoIndex(request, NextResponse.next());
  }

  const pathname = request.nextUrl.pathname;
  if (isLockedAdminPath(pathname)) {
    const adminSecret = process.env.ADMIN_API_KEY?.trim() || process.env.ADMIN_SECRET?.trim();
    const providedKey = request.nextUrl.searchParams.get("key")?.trim() || request.headers.get("x-admin-key")?.trim();
    if (canBypassAdminLock(pathname, providedKey, adminSecret)) {
      return withStagingNoIndex(request, NextResponse.next());
    }
    return withStagingNoIndex(request, new NextResponse("Not Found", { status: 404 }));
  }

  return withStagingNoIndex(request, NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
