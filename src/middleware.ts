import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { canBypassAdminLock, isAdminApiPath, isPublicAdminLockEnabled } from "@/lib/publicAdminLock";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/app/admin/_lib/session";

function applyAdminHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdminPagePath = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdminPagePath) {
    if (pathname === "/admin/login") {
      return applyAdminHeaders(NextResponse.next());
    }

    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const session = await verifySessionToken(token);
    if (!session) {
      const loginUrl = new URL("/admin/login", request.url);
      return applyAdminHeaders(NextResponse.redirect(loginUrl));
    }

    return applyAdminHeaders(NextResponse.next());
  }

  if (isPublicAdminLockEnabled(process.env.PUBLIC_ADMIN_LOCK) && isAdminApiPath(pathname)) {
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
