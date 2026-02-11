"use server";

import { revalidatePath } from "next/cache";
import { requireDb, updateTaskStatus } from "@/app/admin/_lib/artifacts";
import { requireAdminActor } from "@/app/admin/_actions/auth";

function requireField(formData: FormData, key: string): string {
  const value = String(formData.get(key) || "").trim();
  if (!value) throw new Error(`Missing required field: ${key}`);
  return value;
}

async function setTask(formData: FormData, status: "DONE" | "SKIPPED") {
  const taskId = requireField(formData, "taskId");
  const periodKey = String(formData.get("periodKey") || "").trim();

  const actor = await requireAdminActor();
  const db = requireDb();

  await updateTaskStatus(db, {
    taskId,
    status,
    role: actor.role,
  });

  revalidatePath("/admin/inbox");
  revalidatePath("/admin/settings");
  if (/^\d{4}-W\d{2}$/.test(periodKey)) {
    revalidatePath(`/admin/runs/weekly/${periodKey}`);
  }
  if (/^\d{4}-\d{2}$/.test(periodKey)) {
    revalidatePath(`/admin/runs/monthly/${periodKey}`);
  }
}

export async function markTaskDone(formData: FormData): Promise<void> {
  await setTask(formData, "DONE");
}

export async function markTaskSkipped(formData: FormData): Promise<void> {
  await setTask(formData, "SKIPPED");
}
