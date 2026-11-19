import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { SoaForm } from "@/components/SoaForm";
import { PremiumDisclosure, PremiumInteriorHero } from "@/components/PremiumInteriorPage";
import { site } from "@/lib/site";
import {
  isCy2027MarketingPeriod,
  scopeTimingExplanation,
} from "@/lib/compliance/cy2027MarketingPolicy";

/**
 * The transactional Scope of Appointment form.
 *
 * Deliberately noindex. The crawlable, AEO-facing explanation lives at
 * /medicare-scope-of-appointment; letting a bare form compete with it would
 * split the ranking signal and drop searchers onto a form before they know what
 * it is. This page is the destination of that page's call to action.
 */
export const metadata: Metadata = {
  title: "Scope of Appointment | Vital Edge Insurance",
  description:
    "Sign your Medicare Scope of Appointment so your review stays limited to the topics you choose.",
  robots: { index: false, follow: true },
};

/** Convert an ISO instant into the `datetime-local` shape the input expects. */
function toLocalInputValue(iso: string): string {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return "";
  const offsetMs = parsed.getTime() - parsed.getTimezoneOffset() * 60_000;
  return new Date(offsetMs).toISOString().slice(0, 16);
}

/**
 * Whether a prefilled slot falls inside a 48-hour window that still applies.
 *
 * From 2026-10-01 CY2027 marketing removes the wait, so this stops asking for a
 * reason rather than adding friction CMS no longer requires. Lives outside the
 * component so reading the clock stays out of render.
 */
function isInsideEnforcedWindow(iso: string | undefined): boolean {
  if (!iso) return false;
  if (isCy2027MarketingPeriod()) return false;
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return false;
  return (parsed.getTime() - Date.now()) / 3_600_000 < 48;
}

export default async function ScopeOfAppointmentPage({
  searchParams,
}: {
  searchParams: Promise<{ at?: string }>;
}) {
  const { at } = await searchParams;
  const defaultAppointmentAt = at ? toLocalInputValue(at) : "";

  // Server clock decides the initial timing hint for a prefilled slot; the
  // client only recomputes it when the visitor edits the time.
  const defaultNeedsReason = isInsideEnforcedWindow(at);
  const timingHelpText = scopeTimingExplanation();
  const fortyEightHourRuleActive = !isCy2027MarketingPeriod();

  return (
    <>
      <PremiumInteriorHero
        eyebrow="Scope of Appointment"
        title="Set the agenda for your Medicare review"
        subtitle="You choose the topics. Once you have, those are the only products your agent is permitted to bring up."
        actions={[
          { label: "What is this?", href: "/medicare-scope-of-appointment", kind: "light" },
          { label: `Call ${site.phoneDisplay}`, href: `tel:${site.phoneE164}`, kind: "light" },
        ]}
      >
        <PremiumDisclosure>
          Completing this form does not enroll you in anything and does not obligate you to buy or change coverage.
          Not connected with or endorsed by the U.S. Government or the federal Medicare program.
        </PremiumDisclosure>
      </PremiumInteriorHero>

      <Container className="py-12">
        <div className="mb-8 flex flex-wrap items-center gap-2 font-sans text-sm text-slate-600">
          <Link className="font-bold text-[var(--ve-teal)] underline underline-offset-4" href="/">
            Home
          </Link>
          <span>/</span>
          <Link
            className="font-bold text-[var(--ve-teal)] underline underline-offset-4"
            href="/medicare-scope-of-appointment"
          >
            Scope of Appointment
          </Link>
          <span>/</span>
          <span>Sign</span>
        </div>

        <div className="mx-auto max-w-3xl">
          <SoaForm
            defaultAppointmentAt={defaultAppointmentAt}
            defaultNeedsReason={defaultNeedsReason}
            timingHelpText={timingHelpText}
            fortyEightHourRuleActive={fortyEightHourRuleActive}
          />
        </div>
      </Container>
    </>
  );
}
