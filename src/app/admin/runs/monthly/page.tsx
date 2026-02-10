import Link from "next/link";
import { listRunPeriods, requireDb } from "@/app/admin/_lib/artifacts";
import { requireAdminPageAccess } from "@/app/admin/_lib/pageAuth";

export const dynamic = "force-dynamic";

export default async function MonthlyRunsPage() {
  await requireAdminPageAccess();
  const db = requireDb();
  const runs = await listRunPeriods(db, "MONTHLY");

  return (
    <section className="rounded-2xl border border-black/10 bg-white p-6">
      <h1 className="text-xl font-semibold text-black">Monthly runs</h1>
      {runs.length === 0 ? (
        <p className="mt-2 text-sm text-black/60">No monthly runs synced yet.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {runs.map((run) => (
            <li key={run.id} className="rounded-lg border border-black/10 p-3 text-sm text-black/80">
              <Link href={`/admin/runs/monthly/${run.periodKey}`} className="font-medium underline">
                {run.periodKey}
              </Link>
              <div className="text-xs text-black/60">
                {run.result} · {run.runDate.toISOString().slice(0, 10)} · {run.summary || "No summary"}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
