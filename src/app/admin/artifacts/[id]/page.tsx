import { notFound } from "next/navigation";
import { approveArtifact, denyArtifact } from "@/app/admin/_actions/artifacts";
import { markTaskDone, markTaskSkipped } from "@/app/admin/_actions/tasks";
import { MarkdownPanel } from "@/app/admin/_components/MarkdownPanel";
import { getArtifactDetail, requireDb } from "@/app/admin/_lib/artifacts";
import { requireAdminPageAccess } from "@/app/admin/_lib/pageAuth";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ArtifactDetailPage({ params }: Props) {
  const { id } = await params;
  await requireAdminPageAccess();
  const db = requireDb();
  const artifact = await getArtifactDetail(db, id);

  if (!artifact) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-black/10 bg-white p-6">
        <h1 className="text-xl font-semibold text-black">Artifact detail</h1>
        <div className="mt-3 space-y-1 text-sm text-black/70">
          <div>ID: {artifact.id}</div>
          <div>Type: {artifact.artifactType}</div>
          <div>Status: {artifact.status}</div>
          <div>Cadence/Period: {artifact.cadence} / {artifact.periodKey}</div>
          <div>Path: {artifact.relativePath}</div>
          <div>SHA256: {artifact.sha256}</div>
        </div>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-6">
        <h2 className="text-lg font-semibold text-black">Approve / Deny</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <form action={approveArtifact} className="space-y-2">
            <input type="hidden" name="artifactId" value={artifact.id} />
            <input
              type="text"
              name="notes"
              placeholder="Approval note"
              className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded-lg border border-green-300 bg-green-50 px-3 py-2 text-sm font-medium text-green-800 hover:bg-green-100"
            >
              Approve artifact
            </button>
          </form>

          <form action={denyArtifact} className="space-y-2">
            <input type="hidden" name="artifactId" value={artifact.id} />
            <input
              type="text"
              name="notes"
              placeholder="Denial reason"
              className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-800 hover:bg-red-100"
            >
              Deny artifact
            </button>
          </form>
        </div>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-6">
        <h2 className="text-lg font-semibold text-black">Content</h2>
        <div className="mt-4 rounded-xl border border-black/10 p-4">
          {artifact.contentJson ? (
            <pre className="overflow-x-auto whitespace-pre-wrap text-xs text-black/80">
              {JSON.stringify(artifact.contentJson, null, 2)}
            </pre>
          ) : artifact.contentText ? (
            <MarkdownPanel markdown={artifact.contentText} />
          ) : (
            <p className="text-sm text-black/60">No content payload available.</p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-6">
        <h2 className="text-lg font-semibold text-black">Decision history</h2>
        {artifact.decisions.length === 0 ? (
          <p className="mt-3 text-sm text-black/60">No decisions recorded yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {artifact.decisions.map((decision) => (
              <li key={decision.id} className="rounded-lg border border-black/10 p-3 text-sm text-black/80">
                <div className="font-medium">{decision.decision}</div>
                <div className="text-xs text-black/60">{decision.decidedBy} · {decision.decidedAt.toISOString()}</div>
                {decision.notes ? <div className="mt-1 text-xs">{decision.notes}</div> : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-6">
        <h2 className="text-lg font-semibold text-black">Handoff tasks</h2>
        {artifact.handoffTasks.length === 0 ? (
          <p className="mt-3 text-sm text-black/60">No tasks linked to this artifact.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {artifact.handoffTasks.map((task) => (
              <li key={task.id} className="rounded-lg border border-black/10 p-3">
                <div className="text-sm font-medium text-black">{task.title}</div>
                <div className="text-xs text-black/60">Status: {task.status}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <form action={markTaskDone}>
                    <input type="hidden" name="taskId" value={task.id} />
                    <input type="hidden" name="periodKey" value={task.periodKey} />
                    <button
                      type="submit"
                      className="rounded border border-green-300 bg-green-50 px-2 py-1 text-xs text-green-800"
                    >
                      Mark done
                    </button>
                  </form>
                  <form action={markTaskSkipped}>
                    <input type="hidden" name="taskId" value={task.id} />
                    <input type="hidden" name="periodKey" value={task.periodKey} />
                    <button
                      type="submit"
                      className="rounded border border-amber-300 bg-amber-50 px-2 py-1 text-xs text-amber-800"
                    >
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
