"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { requireDb, getApproverByEmail } from "@/app/admin/_lib/artifacts";
import {
  ADMIN_SESSION_COOKIE,
  createSessionToken,
  sessionTtlSeconds,
  verifySessionToken,
} from "@/app/admin/_lib/session";

function normalizeEmail(value: FormDataEntryValue | null): string {
  return String(value || "").trim().toLowerCase();
}

function normalizePassword(value: FormDataEntryValue | null): string {
  return String(value || "").trim();
}

function validateCredentials(password: string): boolean {
  const expected = String(process.env.ADMIN_UI_PASSWORD || "").trim();
  if (!expected) return false;
  return password === expected;
}

export async function loginAdmin(formData: FormData): Promise<void> {
  const email = normalizeEmail(formData.get("email"));
  const password = normalizePassword(formData.get("password"));

  if (!email || !validateCredentials(password)) {
    redirect("/admin/login?error=invalid_credentials");
  }

  const db = requireDb();
  const approver = await getApproverByEmail(db, email);

  if (!approver) {
    redirect("/admin/login?error=not_allowed");
  }

  const token = await createSessionToken(email);
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionTtlSeconds(),
  });

  redirect("/admin/inbox");
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  redirect("/admin/login");
}

export async function requireAdminActor() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);
  if (!session) {
    throw new Error("Unauthorized: admin session missing or expired.");
  }

  const db = requireDb();
  const approver = await getApproverByEmail(db, session.email);
  if (!approver) {
    throw new Error("Unauthorized: approver record not found.");
  }

  return {
    email: approver.email,
    role: approver.role,
  };
}
