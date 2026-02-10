import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { canBypassAdminLock, isLockedAdminPath, isPublicAdminLockEnabled } from "@/lib/publicAdminLock";

export function middleware(request: NextRequest) {
  if (!isPublicAdminLockEnabled(process.env.PUBLIC_ADMIN_LOCK)) {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;
  if (isLockedAdminPath(pathname)) {
    const adminSecret = process.env.ADMIN_API_KEY?.trim() || process.env.ADMIN_SECRET?.trim();
    const providedKey = request.nextUrl.searchParams.get("key")?.trim() || request.headers.get("x-admin-key")?.trim();
    if (canBypassAdminLock(pathname, providedKey, adminSecret)) {
      return NextResponse.next();
    }
    return new NextResponse("Not Found", { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
