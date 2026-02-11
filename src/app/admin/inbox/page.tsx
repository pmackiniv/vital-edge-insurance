import Link from "next/link";
import { approveArtifact, denyArtifact } from "@/app/admin/_actions/artifacts";
import { listInboxArtifacts, requireDb } from "@/app/admin/_lib/artifacts";
import { requireAdminPageAccess } from "@/app/admin/_lib/pageAuth";

export const dynamic = "force-dynamic";

export default async function AdminInboxPage() {
  await requireAdminPageAccess();
  const db = requireDb();
  const artifacts = await listInboxArtifacts(db);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-black/10 bg-white p-6">
        <h1 className="text-xl font-semibold text-black">Approval inbox</h1>
        <p className="mt-1 text-sm text-black/70">
          Pending weekly/monthly artifacts awaiting human approval.
        </p>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-6">
        {artifacts.length === 0 ? (
          <p className="text-sm text-black/60">No pending artifacts.</p>
        ) : (
          <ul className="space-y-4">
            {artifacts.map((artifact) => (
              <li key={artifact.id} className="rounded-xl border border-black/10 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-black">{artifact.artifactType}</div>
                    <div className="mt-1 text-xs text-black/60">
                      {artifact.periodKey} · {artifact.cadence} · {artifact.createdAt.toISOString()}
                    </div>
                    <div className="mt-1 text-xs text-black/60">{artifact.relativePath}</div>
                  </div>
                  <Link
                    href={`/admin/artifacts/${artifact.id}`}
                    className="rounded-lg border border-black/15 px-3 py-1.5 text-xs font-medium text-black/80 hover:bg-black/5"
                  >
                    Open
                  </Link>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <form action={approveArtifact} className="space-y-2">
                    <input type="hidden" name="artifactId" value={artifact.id} />
                    <input
                      type="text"
                      name="notes"
                      placeholder="Approval note (optional)"
                      className="w-full rounded-lg border border-black/15 px-3 py-2 text-xs"
                    />
                    <button
                      type="submit"
                      className="rounded-lg border border-green-300 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-800 hover:bg-green-100"
                    >
                      Approve
                    </button>
                  </form>

                  <form action={denyArtifact} className="space-y-2">
                    <input type="hidden" name="artifactId" value={artifact.id} />
                    <input
                      type="text"
                      name="notes"
                      placeholder="Denial reason (required operationally)"
                      className="w-full rounded-lg border border-black/15 px-3 py-2 text-xs"
                    />
                    <button
                      type="submit"
                      className="rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-800 hover:bg-red-100"
                    >
                      Deny
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
