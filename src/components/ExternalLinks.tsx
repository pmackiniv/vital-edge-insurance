import {
  ALLSTATE_HEALTH_SOLUTIONS,
  ALLSTATE_HEALTH_SOLUTIONS_CANCER,
  ALLSTATE_HEALTH_SOLUTIONS_DVH,
  ALLSTATE_HEALTH_SOLUTIONS_SENIOR_INDEMNITY,
  externalLinkProps,
  GBP_REVIEWS,
  PLANENROLL,
  UHONE_ANCILLARY,
} from "@/lib/externalLinks";
import { MEDICARE_REVIEW_BOOKING_URL, site } from "@/lib/site";

export function ExternalLinks() {
  const linkProps = externalLinkProps();

  return (
    <div className="rounded-3xl border border-[var(--ve-teal)]/10 bg-white/92 p-6 shadow-[0_22px_70px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="space-y-2 font-sans text-sm leading-6 text-slate-700">
        <p>
          Self-enroll lookup (look for a plan that keeps your doctors and covers your prescriptions). Can&apos;t find
          the plan you&apos;re looking for? Call me! ({site.phoneDisplay})
        </p>
        <p>
          We do not offer every plan available in your area. We represent many organizations which offer several
          products in your area. Please contact Medicare.gov or 1-800-MEDICARE to get information on all of your
          options.
        </p>
        <p>
          Product availability, eligibility, pricing, benefits, exclusions, limitations, and underwriting requirements
          vary by carrier, product, state, and applicant.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <a
          href={PLANENROLL}
          {...linkProps}
          className="premium-small-button premium-small-button-primary"
        >
          Start My Medicare Review
        </a>
        <a
          href={UHONE_ANCILLARY}
          {...linkProps}
          className="premium-small-button premium-small-button-gold"
        >
          Quote UnitedHealthcare Golden Rule
        </a>
        <a
          href={MEDICARE_REVIEW_BOOKING_URL}
          {...linkProps}
          className="premium-small-button premium-small-button-light"
        >
          Book a Call with Patrick
        </a>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href={ALLSTATE_HEALTH_SOLUTIONS_DVH}
          {...linkProps}
          className="premium-small-button premium-small-button-gold"
        >
          Allstate Dental, Vision &amp; Hearing
        </a>
        <a
          href={ALLSTATE_HEALTH_SOLUTIONS_SENIOR_INDEMNITY}
          {...linkProps}
          className="premium-small-button premium-small-button-primary"
        >
          Allstate Senior Hospital Indemnity
        </a>
        <a
          href={ALLSTATE_HEALTH_SOLUTIONS_CANCER}
          {...linkProps}
          className="premium-small-button premium-small-button-light"
        >
          Allstate Cancer &amp; Critical Illness
        </a>
        <a
          href={ALLSTATE_HEALTH_SOLUTIONS}
          {...linkProps}
          className="premium-small-button premium-small-button-light"
        >
          Quote All Allstate Options
        </a>
      </div>

      <div className="mt-5 font-sans text-sm">
        <a href={GBP_REVIEWS} {...linkProps} className="font-bold text-[var(--ve-teal)] underline underline-offset-4">
          Read or leave a Google review
        </a>
      </div>
    </div>
  );
}
