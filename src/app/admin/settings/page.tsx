import { site } from "@/lib/site";
import { CALL_RECORDING_POLICY_VERSION, RETENTION_POLICY_YEARS, TPMO_POLICY_VERSION } from "@/lib/compliance/policy";
import { getPersistenceMode } from "@/lib/prisma";
import { getTpmoStatus } from "@/lib/tpmo/tpmoCounts";
import { getSettingsSummary, requireDb } from "@/app/admin/_lib/artifacts";
import { requireAdminPageAccess } from "@/app/admin/_lib/pageAuth";

export const dynamic = "force-dynamic";

const DEFAULT_TPMO_DISCLOSURE =
  "We do not offer every plan available in your area. Any information we provide is limited to plans we offer in your area. We are not connected with or endorsed by the U.S. government or the federal Medicare program.";

type SettingFlag = {
  label: string;
  ok: boolean;
  note: string;
};

function flag(label: string, ok: boolean, note: string): SettingFlag {
  return { label, ok, note };
}

export default async function AdminSettingsPage() {
  await requireAdminPageAccess();
  const tpmoStatus = await getTpmoStatus();
  const persistenceMode = getPersistenceMode();
  const dbActive = persistenceMode === "database";
  const db = requireDb();
  const settingsSummary = await getSettingsSummary(db);

  const flags: SettingFlag[] = [
    flag("OpenAI key configured", Boolean(process.env.OPENAI_API_KEY), "Required for AI chat."),
    flag("SMTP configured", Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS), "Required for lead/handoff email."),
    flag("Notion configured", Boolean(process.env.NOTION_API_KEY && process.env.NOTION_DATABASE_ID), "Required for Notion lead sync."),
    flag("Database configured (Prisma)", dbActive, "Required for persistent events and TPMO lookup logs."),
    flag("Admin secret set", Boolean(process.env.ADMIN_SECRET), "Protects admin event endpoints."),
    flag("Owner API key set", Boolean(process.env.OWNER_AGENT_API_KEY), "Required for MA owner-only enforcement."),
    flag("Delegated agent key set", Boolean(process.env.AGENT_API_KEY), "Used for delegated Medigap/general workflows."),
  ];

  const tpmoDisclosure = process.env.CMS_TPMO_DISCLAIMER?.trim() || DEFAULT_TPMO_DISCLOSURE;

  return (
    <div className="space-y-6">
      {!dbActive && (
        <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-sm font-semibold text-red-800">Persistence Warning (HIGH)</h2>
          <p className="mt-2 text-sm text-red-700">
            DATABASE_URL is not configured. TPMO count logging is not audit-defensible in this mode.
          </p>
        </section>
      )}

      <section className="rounded-2xl border border-black/10 bg-white p-6">
        <h1 className="text-xl font-semibold text-black">Settings status</h1>
        <p className="mt-1 text-sm text-black/70">
          Read-only operational settings for compliance and lead operations. Secret values are intentionally hidden.
        </p>
        <ul className="mt-4 space-y-2">
          {flags.map((item) => (
            <li key={item.label} className="flex flex-wrap items-center gap-2 text-sm">
              <span className={item.ok ? "text-green-700" : "text-amber-700"}>{item.ok ? "Ready" : "Missing"}</span>
              <span className="font-medium text-black">{item.label}</span>
              <span className="text-black/60">- {item.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-6">
        <h2 className="text-sm font-semibold text-black">Private admin governance</h2>
        <p className="mt-1 text-xs text-black/60">
          Approver roster, artifact type coverage, and recent artifact sync runs.
        </p>

        <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-black/60">Approvers</h3>
        {settingsSummary.approvers.length === 0 ? (
          <p className="mt-2 text-sm text-amber-700">No approvers found. Set ADMIN_UI_BOOTSTRAP_APPROVERS.</p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm text-black/80">
            {settingsSummary.approvers.map((approver) => (
              <li key={approver.id}>
                {approver.email} - {approver.role}
              </li>
            ))}
          </ul>
        )}

        <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-black/60">Artifact type coverage</h3>
        {settingsSummary.artifactCoverage.length === 0 ? (
          <p className="mt-2 text-sm text-black/60">No synced artifacts yet.</p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm text-black/80">
            {settingsSummary.artifactCoverage.slice(0, 20).map((row) => (
              <li key={row.artifactType}>
                {row.artifactType}: {row.count}
              </li>
            ))}
          </ul>
        )}

        <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-black/60">Recent runs</h3>
        {settingsSummary.recentRuns.length === 0 ? (
          <p className="mt-2 text-sm text-black/60">No run rows found.</p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm text-black/80">
            {settingsSummary.recentRuns.map((run) => (
              <li key={run.id}>
                {run.cadence} {run.periodKey} - {run.result} ({run.runDate.toISOString().slice(0, 10)})
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-6">
        <h2 className="text-sm font-semibold text-black">TPMO dataset status</h2>
        <p className="mt-1 text-xs text-black/60">Versioned landscape metadata used by ZIP-based TPMO count lookups.</p>
        <ul className="mt-4 space-y-2 text-sm text-black/80">
          <li>Source: {tpmoStatus.source}</li>
          <li>Plan year: {tpmoStatus.planYear}</li>
          <li>Dataset version: {tpmoStatus.datasetVersion || "Not loaded"}</li>
          <li>Refreshed at: {tpmoStatus.refreshedAt ? new Date(tpmoStatus.refreshedAt).toLocaleString() : "Not loaded"}</li>
          <li>Alias map version: {tpmoStatus.aliasMapVersion}</li>
          <li>TPMO policy version: {tpmoStatus.tpmoPolicyVersion}</li>
          <li>Call recording policy version: {tpmoStatus.callRecordingPolicyVersion}</li>
          <li>Retention policy: {tpmoStatus.retentionPolicyYears} years</li>
          <li>Recording archive mode: {tpmoStatus.recordingArchiveMode}</li>
          <li>Persistence mode: {tpmoStatus.persistenceMode}</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-6">
        <h2 className="text-sm font-semibold text-black">Appointment sponsors (read-only)</h2>
        <p className="mt-1 text-xs text-black/60">
          Used to compute represented organizations and plan counts for dynamic TPMO disclosures.
        </p>
        <ul className="mt-4 space-y-2 text-sm text-black/80">
          {tpmoStatus.appointmentSponsors.length === 0 && (
            <li className="text-black/60">No appointment sponsors found. Run `npm run tpmo:seed`.</li>
          )}
          {tpmoStatus.appointmentSponsors.map((row) => (
            <li key={row.sponsorKey} className="rounded-lg border border-black/10 px-3 py-2">
              <span className="font-medium text-black">{row.displayName}</span>{" "}
              <span className="text-black/60">({row.sponsorKey})</span>{" "}
              <span className={row.status === "active" ? "text-green-700" : "text-amber-700"}>{row.status}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-6">
        <h2 className="text-sm font-semibold text-black">TPMO disclosure text</h2>
        <p className="mt-1 text-xs text-black/60">
          This text is used for deterministic compliance checks. Update via environment configuration only.
        </p>
        <p className="mt-3 rounded-xl border border-black/10 bg-black/[0.02] p-4 text-sm leading-6 text-black/80">
          {tpmoDisclosure}
        </p>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-6">
        <h2 className="text-sm font-semibold text-black">Call recording policy checkpoint</h2>
        <p className="mt-2 text-sm leading-6 text-black/70">
          Medicare call-task workflows require acknowledgment before handoff submission in admin tools and before
          call-context TPMO count lookups.
        </p>
        <p className="mt-2 text-sm leading-6 text-black/70">
          MA plan discussion and enrollment stages are restricted to owner role only (Patrick). Delegated agents can
          support general Medicare education and Medigap workflows.
        </p>
        <ul className="mt-3 space-y-1 text-xs text-black/60">
          <li>Policy key: {TPMO_POLICY_VERSION}</li>
          <li>Recording key: {CALL_RECORDING_POLICY_VERSION}</li>
          <li>Retention: {RETENTION_POLICY_YEARS} years</li>
        </ul>
        <p className="mt-2 text-sm text-black/70">
          Direct support: <a className="underline" href={`tel:${site.phoneE164}`}>{site.phoneDisplay}</a> or{" "}
          <a className="underline" href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      </section>
    </div>
  );
}
