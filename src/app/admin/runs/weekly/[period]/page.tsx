import Link from "next/link";
import { exportHandoffChecklist } from "@/app/admin/_actions/artifacts";
import { markTaskDone, markTaskSkipped } from "@/app/admin/_actions/tasks";
import { listRunArtifacts, requireDb } from "@/app/admin/_lib/artifacts";
import { requireAdminPageAccess } from "@/app/admin/_lib/pageAuth";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ period: string }>;
};

export default async function WeeklyRunDetailPage({ params }: Props) {
  const { period } = await params;
  await requireAdminPageAccess();
  const db = requireDb();
  const { run, artifacts, tasks } = await listRunArtifacts(db, "WEEKLY", period);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-black/10 bg-white p-6">
        <h1 className="text-xl font-semibold text-black">Weekly run: {period}</h1>
        {run ? (
          <div className="mt-2 text-sm text-black/70">
            Result: {run.result} · Run date: {run.runDate.toISOString().slice(0, 10)}
          </div>
        ) : (
          <p className="mt-2 text-sm text-black/60">No run record found for this period.</p>
        )}

        <form action={exportHandoffChecklist} className="mt-4">
          <input type="hidden" name="cadence" value="WEEKLY" />
          <input type="hidden" name="periodKey" value={period} />
          <input type="hidden" name="runDate" value={(run?.runDate || new Date()).toISOString().slice(0, 10)} />
          <button
            type="submit"
            className="rounded-lg border border-black/20 px-3 py-1.5 text-xs font-medium text-black/80 hover:bg-black/5"
          >
            Export handoff checklist artifact
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-6">
        <h2 className="text-lg font-semibold text-black">Artifacts</h2>
        {artifacts.length === 0 ? (
          <p className="mt-2 text-sm text-black/60">No artifacts synced for this weekly period.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {artifacts.map((artifact) => (
              <li key={artifact.id} className="rounded-lg border border-black/10 p-3 text-sm text-black/80">
                <Link href={`/admin/artifacts/${artifact.id}`} className="font-medium underline">
                  {artifact.artifactType}
                </Link>
                <div className="text-xs text-black/60">{artifact.status} · {artifact.relativePath}</div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-6">
        <h2 className="text-lg font-semibold text-black">Handoff tasks</h2>
        {tasks.length === 0 ? (
          <p className="mt-2 text-sm text-black/60">No tasks available.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {tasks.map((task) => (
              <li key={task.id} className="rounded-lg border border-black/10 p-3">
                <div className="text-sm font-medium text-black">{task.title}</div>
                <div className="text-xs text-black/60">Status: {task.status}</div>
                <div className="mt-2 flex gap-2">
                  <form action={markTaskDone}>
                    <input type="hidden" name="taskId" value={task.id} />
                    <input type="hidden" name="periodKey" value={task.periodKey} />
                    <button type="submit" className="rounded border border-green-300 bg-green-50 px-2 py-1 text-xs text-green-800">
                      Done
                    </button>
                  </form>
                  <form action={markTaskSkipped}>
                    <input type="hidden" name="taskId" value={task.id} />
                    <input type="hidden" name="periodKey" value={task.periodKey} />
                    <button type="submit" className="rounded border border-amber-300 bg-amber-50 px-2 py-1 text-xs text-amber-800">
                      Skip
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
