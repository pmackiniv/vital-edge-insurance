import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { ResourceLeadForm } from "@/components/ResourceLeadForm";
import { StructuredData } from "@/components/StructuredData";
import {
  PremiumContentBand,
  PremiumDisclosure,
  PremiumFeatureGrid,
  PremiumInteriorHero,
  PremiumLinkGrid,
} from "@/components/PremiumInteriorPage";
import { externalLinkProps, PLANENROLL } from "@/lib/externalLinks";
import { LOOKUP_FALLBACK_LINE, MANDATORY_CMS_DISCLAIMER } from "@/lib/medicareNews";
import { absoluteUrl, MEDICARE_REVIEW_BOOKING_URL, site } from "@/lib/site";
import { getResourcePage, resourcePages } from "@/lib/resourcePages";

export async function generateStaticParams() {
  return resourcePages.map((page) => ({ resourceSlug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ resourceSlug: string }> }): Promise<Metadata> {
  const { resourceSlug } = await params;
  const page = getResourcePage(resourceSlug);

  if (!page) return {};

  const url = absoluteUrl(`/${page.slug}`);

  return {
    title: page.metaTitle,
    description: page.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: page.metaTitle,
      description: page.description,
      url,
      type: "website",
      siteName: site.name,
      images: [
        {
          url: absoluteUrl("/og.png"),
          width: 1200,
          height: 630,
          alt: `${page.title} from Vital Edge Insurance`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.metaTitle,
      description: page.description,
      images: [absoluteUrl("/og.png")],
    },
  };
}

export default async function ResourcePage({ params }: { params: Promise<{ resourceSlug: string }> }) {
  const { resourceSlug } = await params;
  const page = getResourcePage(resourceSlug);

  if (!page) {
    notFound();
  }

  const url = absoluteUrl(`/${page.slug}`);
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Resources", item: absoluteUrl("/resources") },
      { "@type": "ListItem", position: 3, name: page.title, item: url },
    ],
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.title,
    serviceType: page.serviceType,
    url,
    description: page.description,
    provider: {
      "@type": "InsuranceAgency",
      name: site.legalName,
      url: absoluteUrl("/"),
      telephone: site.phoneE164,
      email: site.email,
      identifier: [
        { "@type": "PropertyValue", name: "National Producer Number", value: `NPN ${site.npn}` },
        { "@type": "PropertyValue", name: "Florida DFS License", value: `FL License #${site.floridaLicense}` },
      ],
    },
    areaServed: page.areaServed || site.serviceAreas,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const eventJsonLd =
    page.formVariant === "event"
      ? {
          "@context": "https://schema.org",
          "@type": "Event",
          name: page.title,
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          eventStatus: "https://schema.org/EventScheduled",
          location: {
            "@type": "Place",
            name: "Requested community location",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Jacksonville",
              addressRegion: "FL",
              addressCountry: "US",
            },
          },
          organizer: {
            "@type": "InsuranceAgency",
            name: site.legalName,
            url: absoluteUrl("/"),
          },
          description: page.description,
        }
      : null;

  return (
    <>
      <PremiumInteriorHero
        eyebrow={page.eyebrow}
        title={page.title}
        subtitle={page.heroSubtitle}
        actions={[
          { label: page.primaryCtaLabel, href: page.primaryCtaHref, kind: "primary", external: page.primaryExternal },
          ...(page.secondaryCtaLabel && page.secondaryCtaHref
            ? [{ label: page.secondaryCtaLabel, href: page.secondaryCtaHref, kind: "gold" as const, external: page.secondaryExternal }]
            : []),
          { label: `Call ${site.phoneDisplay}`, href: `tel:${site.phoneE164}`, kind: "light" },
        ]}
      >
        <PremiumDisclosure>
          Plan availability and eligibility vary by county and individual circumstances. Not connected with or endorsed
          by the U.S. Government or the federal Medicare program.
        </PremiumDisclosure>
      </PremiumInteriorHero>

      <Container className="py-12">
        <div className="mb-8 flex flex-wrap items-center gap-2 font-sans text-sm text-slate-600">
          <Link className="font-bold text-[var(--ve-teal)] underline underline-offset-4" href="/">
            Home
          </Link>
          <span>/</span>
          <Link className="font-bold text-[var(--ve-teal)] underline underline-offset-4" href="/resources">
            Resources
          </Link>
          <span>/</span>
          <span>{page.title}</span>
        </div>

        <div className="space-y-10">
          <PremiumFeatureGrid features={page.cards.slice(0, 6)} />

          {page.cards.length > 6 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {page.cards.slice(6).map((card) => (
                <article
                  key={card.title}
                  className="rounded-2xl border border-[var(--ve-teal)]/10 bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)]"
                >
                  <h2 className="font-sans text-base font-extrabold text-[var(--ve-teal)]">{card.title}</h2>
                  <p className="mt-3 font-sans text-sm leading-6 text-slate-700">{card.body}</p>
                </article>
              ))}
            </div>
          ) : null}

          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-6">
              {page.blocks.map((block, index) => (
                <PremiumContentBand key={block.title} title={block.title} tone={index === 0 ? "teal" : "white"}>
                  {block.paragraphs?.map((paragraph) => (
                    <p key={paragraph} className="mb-3 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                  {block.bullets ? (
                    <ul className="space-y-2">
                      {block.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-2">
                          <span className="mt-2 inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--ve-gold)]" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {block.links?.map((source) => (
                    <p key={source.href} className="mt-3">
                      <a href={source.href} className="font-bold underline underline-offset-4">{source.label}</a>
                    </p>
                  ))}
                </PremiumContentBand>
              ))}
            </div>

            <aside className="space-y-6">
              <section className="rounded-3xl border border-[var(--ve-teal)]/10 bg-white p-6 shadow-[0_18px_52px_rgba(15,23,42,0.08)]">
                <h2 className="font-display text-2xl font-bold tracking-normal text-[var(--ve-teal)]">Related resources</h2>
                <div className="mt-4">
                  <PremiumLinkGrid links={page.links} />
                </div>
              </section>
              <section className="rounded-3xl border border-[var(--ve-teal)]/10 bg-white p-6 shadow-[0_18px_52px_rgba(15,23,42,0.08)]">
                <h2 className="font-display text-2xl font-bold tracking-normal text-[var(--ve-teal)]">Common questions</h2>
                <div className="mt-4 space-y-4 font-sans text-sm text-slate-700">
                  {page.faqs.map((faq) => (
                    <div key={faq.question}>
                      <h3 className="font-extrabold text-[var(--ve-teal)]">{faq.question}</h3>
                      <p className="mt-1 leading-6">{faq.answer}</p>
                      {faq.sources?.map((source) => (
                        <p key={source.href} className="mt-2 leading-6">
                          <a href={source.href} className="font-semibold text-[var(--ve-teal)] underline underline-offset-4">{source.label}</a>
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </section>
            </aside>
          </div>

          {page.slug === "medicare-still-working" ? (
            <PremiumContentBand title="Ready to compare plans on your own?" tone="white">
              <p className="mb-3">If you already know your Medicare timing and are ready to explore, you can browse plan options without booking an appointment.</p>
              <Link href="/enroll" className="font-bold underline underline-offset-4">Compare Medicare plans online</Link>
            </PremiumContentBand>
          ) : page.formVariant !== "partner" && page.formVariant !== "event" ? (
            <section className="rounded-3xl bg-[var(--ve-teal)] p-7 text-white shadow-[0_24px_70px_rgba(0,63,69,0.2)] md:p-9">
              <p className="font-sans text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--ve-gold)]">
                Self-Directed 2027 Plan Lookup
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">
                Compare 2027 Medicare Plans in 3 Simple Steps
              </h2>
              <p className="mt-2 max-w-3xl font-sans text-sm leading-6 text-white/90">
                Check your doctors, hospitals, and prescriptions side by side online, or book a 1-on-1 call with Patrick
                Mackin IV (NPN {site.npn}, FL License #{site.floridaLicense}).
              </p>
              <ol className="mt-5 grid gap-3 font-sans text-sm text-white/95 md:grid-cols-3">
                <li className="rounded-2xl border border-white/15 bg-white/10 p-4">
                  <span className="block text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--ve-gold)]">
                    Step 1
                  </span>
                  <span className="mt-1 block font-semibold">Enter your ZIP code</span>
                </li>
                <li className="rounded-2xl border border-white/15 bg-white/10 p-4">
                  <span className="block text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--ve-gold)]">
                    Step 2
                  </span>
                  <span className="mt-1 block font-semibold">Add your doctors and prescriptions</span>
                </li>
                <li className="rounded-2xl border border-white/15 bg-white/10 p-4">
                  <span className="block text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--ve-gold)]">
                    Step 3
                  </span>
                  <span className="mt-1 block font-semibold">Compare 2027 plans side by side</span>
                </li>
              </ol>

              <div className="mt-6 space-y-2.5 font-sans text-sm md:text-base">
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
                    📅 Book a call: {MEDICARE_REVIEW_BOOKING_URL}
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
          ) : null}

          <ResourceLeadForm
            variant={page.formVariant || "consumer"}
            leadCategory={page.leadCategory}
            pageSource={`/${page.slug}`}
            defaultTopic={page.title}
            showMedicareTiming={["turning-65-medicare", "st-johns-county-medicare-help", "nocatee-medicare-help", "the-villages-medicare-help"].includes(page.slug)}
          />
        </div>
      </Container>

      <StructuredData entries={[breadcrumbJsonLd, serviceJsonLd, faqJsonLd, ...(eventJsonLd ? [eventJsonLd] : [])]} />
    </>
  );
}
