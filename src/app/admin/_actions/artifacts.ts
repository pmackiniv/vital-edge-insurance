"use server";

import { revalidatePath } from "next/cache";
import type { Cadence } from "@prisma/client";
import {
  applyArtifactDecision,
  exportChecklistArtifact,
  requireDb,
} from "@/app/admin/_lib/artifacts";
import { requireAdminActor } from "@/app/admin/_actions/auth";

function requireField(formData: FormData, key: string): string {
  const value = String(formData.get(key) || "").trim();
  if (!value) throw new Error(`Missing required field: ${key}`);
  return value;
}

function parseCadence(value: string): Cadence {
  if (value === "WEEKLY" || value === "MONTHLY" || value === "DAILY") return value;
  throw new Error("Invalid cadence value.");
}

function parseRunDate(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error("runDate must be YYYY-MM-DD");
  }
  return new Date(`${value}T00:00:00.000Z`);
}

function revalidateAdminRoutes() {
  revalidatePath("/admin/inbox");
  revalidatePath("/admin/settings");
  revalidatePath("/admin");
}

export async function approveArtifact(formData: FormData): Promise<void> {
  const artifactId = requireField(formData, "artifactId");
  const notes = String(formData.get("notes") || "").trim();

  const actor = await requireAdminActor();
  const db = requireDb();

  await applyArtifactDecision(db, {
    artifactId,
    decision: "APPROVE",
    notes,
    decidedBy: actor.email,
    role: actor.role,
  });

  revalidateAdminRoutes();
  revalidatePath(`/admin/artifacts/${artifactId}`);
}

export async function denyArtifact(formData: FormData): Promise<void> {
  const artifactId = requireField(formData, "artifactId");
  const notes = String(formData.get("notes") || "").trim();

  const actor = await requireAdminActor();
  const db = requireDb();

  await applyArtifactDecision(db, {
    artifactId,
    decision: "DENY",
    notes,
    decidedBy: actor.email,
    role: actor.role,
  });

  revalidateAdminRoutes();
  revalidatePath(`/admin/artifacts/${artifactId}`);
}

export async function exportHandoffChecklist(formData: FormData): Promise<void> {
  const cadence = parseCadence(requireField(formData, "cadence"));
  const periodKey = requireField(formData, "periodKey");
  const runDate = parseRunDate(requireField(formData, "runDate"));

  const actor = await requireAdminActor();
  const db = requireDb();

  await exportChecklistArtifact(db, {
    cadence,
    periodKey,
    runDate,
    decidedBy: actor.email,
    role: actor.role,
  });

  revalidateAdminRoutes();
  if (cadence === "WEEKLY") {
    revalidatePath(`/admin/runs/weekly/${periodKey}`);
  }
  if (cadence === "MONTHLY") {
    revalidatePath(`/admin/runs/monthly/${periodKey}`);
  }
}
