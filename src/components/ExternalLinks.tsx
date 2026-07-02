import {
  externalLinkProps,
  GBP_REVIEWS,
  PLANENROLL,
  UHONE_ANCILLARY,
} from "@/lib/externalLinks";

export function ExternalLinks() {
  const linkProps = externalLinkProps();

  return (
    <div className="rounded-3xl border border-[var(--ve-teal)]/10 bg-white/92 p-6 shadow-[0_22px_70px_rgba(15,23,42,0.08)] backdrop-blur">
      <p className="font-sans text-sm leading-6 text-slate-700">
        You are leaving Vital Edge Insurance and going to a third-party site.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <a
          href={PLANENROLL}
          {...linkProps}
          className="premium-small-button premium-small-button-primary"
        >
          Start My Review
        </a>
        <a
          href={UHONE_ANCILLARY}
          {...linkProps}
          className="premium-small-button premium-small-button-gold"
        >
          Dental, Vision & Hospital Coverage
        </a>
      </div>

      <div className="mt-5 font-sans text-sm">
        <a href={GBP_REVIEWS} {...linkProps} className="font-bold text-[var(--ve-teal)] underline underline-offset-4">
          Read reviews
        </a>
      </div>
    </div>
  );
}
