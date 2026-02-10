import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/app/admin/_lib/session";
import { getApproverByEmail, requireDb } from "@/app/admin/_lib/artifacts";

export async function requireAdminPageAccess() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);

  if (!session) {
    redirect("/admin/login");
  }

  const db = requireDb();
  const approver = await getApproverByEmail(db, session.email);

  if (!approver) {
    redirect("/admin/login?error=not_allowed");
  }

  return {
    email: approver.email,
    role: approver.role,
  };
}
