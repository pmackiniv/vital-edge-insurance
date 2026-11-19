import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { PremiumDisclosure, PremiumInteriorHero } from "@/components/PremiumInteriorPage";
import { externalLinkProps, PLANENROLL } from "@/lib/externalLinks";
import {
  LOOKUP_FALLBACK_LINE,
  MANDATORY_CMS_DISCLAIMER,
  medicareNewsArticles,
  PATRICK_POSITIONING_LINE,
} from "@/lib/medicareNews";
import { absoluteUrl, MEDICARE_REVIEW_BOOKING_URL, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "2027 Medicare News & Plain-Language Guides | Vital Edge Insurance",
  description:
    "Plain-language 2027 Medicare news updates from Patrick Mackin IV covering the GLP-1 Bridge Program, Shared Savings Program, $209.40 Part B premium, OTC allowance changes, and Medicare Advantage appeals.",
  alternates: {
    canonical: absoluteUrl("/news"),
  },
  openGraph: {
    type: "website",
    url: absoluteUrl("/news"),
    title: "2027 Medicare News & Plain-Language Guides | Vital Edge Insurance",
    description:
      "Five verified 2027 Medicare updates with clear next steps to check your doctors, prescriptions, and ZIP code coverage before December 7.",
    siteName: site.name,
  },
};

export default function MedicareNewsIndexPage() {
  return (
    <>
      <PremiumInteriorHero
        eyebrow="2027 Medicare News Hub"
        title="Plain-Language 2027 Medicare Updates"
        subtitle="Verified facts for Medicare beneficiaries across 13 licensed states, explained clearly without sales pressure."
        actions={[
          { label: "Check Your 2027 Plans", href: PLANENROLL, kind: "primary", external: true },
          { label: "Book an Annual Review", href: MEDICARE_REVIEW_BOOKING_URL, kind: "gold", external: true },
          { label: `Call or Text ${site.phoneDisplay}`, href: `tel:${site.phoneE164}`, kind: "light" },
        ]}
      >
        <PremiumDisclosure>{MANDATORY_CMS_DISCLAIMER}</PremiumDisclosure>
      </PremiumInteriorHero>

      <Container className="py-12">
        <div className="space-y-10">
          <div className="rounded-3xl border border-[var(--ve-teal)]/15 bg-white/92 p-6 shadow-[0_18px_52px_rgba(15,23,42,0.08)] md:p-8">
            <p className="font-sans text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--ve-gold)]">
              Real Broker Support All Year
            </p>
            <p className="mt-3 font-sans text-base leading-7 text-slate-800">{PATRICK_POSITIONING_LINE}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {medicareNewsArticles.map((article) => (
              <article
                key={article.slug}
                className="flex flex-col justify-between rounded-3xl border border-[var(--ve-teal)]/12 bg-white/95 p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)]"
              >
                <div>
                  <p className="font-sans text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--ve-gold)]">
                    {article.eyebrow}
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-bold leading-snug text-[var(--ve-teal)]">
                    <Link href={`/news/${article.slug}`} className="hover:underline">
                      {article.title}
                    </Link>
                  </h2>
                  <p className="mt-3 font-sans text-sm leading-6 text-slate-700">{article.description}</p>
                  <ul className="mt-4 space-y-2 font-sans text-sm leading-6 text-slate-700">
                    {article.summaryPoints.map((point) => (
                      <li key={point} className="flex gap-2">
                        <span className="font-bold text-[var(--ve-teal)]">*</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
                  <span className="font-sans text-xs text-slate-500">Updated {article.publishedDate}</span>
                  <Link
                    href={`/news/${article.slug}`}
                    className="premium-small-button premium-small-button-primary"
                  >
                    Read Full Update
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <section className="rounded-3xl bg-[var(--ve-teal)] p-8 text-white shadow-[0_28px_80px_rgba(0,63,69,0.22)] md:p-10">
            <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              Review Your 2027 Plan Fit Before December 7
            </h2>
            <p className="mt-3 max-w-2xl font-sans text-base leading-7 text-white/90">
              Look for a plan that keeps your doctors and covers your prescriptions, or talk through your options with
              me directly one-on-one.
            </p>
            <div className="mt-6 space-y-3 font-sans text-base">
              <div>
                <a
                  href={PLANENROLL}
                  {...externalLinkProps()}
                  className="font-semibold text-white underline underline-offset-4 hover:text-[var(--ve-gold)]"
                >
                  🔗 Self-enroll lookup: {PLANENROLL}
                </a>
              </div>
              <div>
                <a
                  href={MEDICARE_REVIEW_BOOKING_URL}
                  {...externalLinkProps()}
                  className="font-semibold text-white underline underline-offset-4 hover:text-[var(--ve-gold)]"
                >
                  📅 Book an annual review: {MEDICARE_REVIEW_BOOKING_URL}
                </a>
              </div>
              <div>
                <a
                  href={`tel:${site.phoneE164}`}
                  className="font-semibold text-white underline underline-offset-4 hover:text-[var(--ve-gold)]"
                >
                  Call or text: {site.phoneDisplay}
                </a>
              </div>
            </div>
            <p className="mt-4 font-sans text-sm font-semibold text-white">{LOOKUP_FALLBACK_LINE}</p>
            <p className="mt-4 border-t border-white/20 pt-4 font-sans text-xs leading-6 text-white/85">
              {MANDATORY_CMS_DISCLAIMER}
            </p>
          </section>
        </div>
      </Container>
    </>
  );
}
