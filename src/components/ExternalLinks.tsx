import {
  externalLinkProps,
  GBP_REVIEWS,
  HEALTHSHERPA_ACA,
  HEALTHSHERPA_MEDICARE,
  PLANENROLL,
} from "@/lib/externalLinks";

export function ExternalLinks() {
  const linkProps = externalLinkProps();

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6">
      <p className="text-sm text-black/70">
        You are leaving Vital Edge Insurance and going to a third-party site.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <a
          href={HEALTHSHERPA_ACA}
          {...linkProps}
          className="rounded-2xl border border-black/10 p-5 text-left text-sm font-semibold text-black hover:bg-black/5"
        >
          ACA HealthSherpa
        </a>
        <a
          href={HEALTHSHERPA_MEDICARE}
          {...linkProps}
          className="rounded-2xl border border-black/10 p-5 text-left text-sm font-semibold text-black hover:bg-black/5"
        >
          Medicare HealthSherpa intake
        </a>
        <a
          href={PLANENROLL}
          {...linkProps}
          className="rounded-2xl border border-black/10 p-5 text-left text-sm font-semibold text-black hover:bg-black/5"
        >
          PlanEnroll
        </a>
      </div>

      <div className="mt-5 text-sm">
        <a href={GBP_REVIEWS} {...linkProps} className="text-black/70 hover:text-black">
          Read reviews
        </a>
      </div>
    </div>
  );
}
