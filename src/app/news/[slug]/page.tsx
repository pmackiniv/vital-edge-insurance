import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { PremiumDisclosure, PremiumInteriorHero } from "@/components/PremiumInteriorPage";
import { StructuredData } from "@/components/StructuredData";
import { externalLinkProps, PLANENROLL } from "@/lib/externalLinks";
import {
  getMedicareNewsArticle,
  LOOKUP_FALLBACK_LINE,
  MANDATORY_CMS_DISCLAIMER,
  medicareNewsArticles,
  medicareNewsSlugs,
  PATRICK_POSITIONING_LINE,
} from "@/lib/medicareNews";
import { absoluteUrl, MEDICARE_REVIEW_BOOKING_URL, site } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return medicareNewsSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getMedicareNewsArticle(slug);
  if (!article) return {};

  const canonical = absoluteUrl(`/news/${article.slug}`);
  return {
    title: article.metaTitle,
    description: article.description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title: article.metaTitle,
      description: article.description,
      siteName: site.name,
      publishedTime: article.publishedDate,
    },
  };
}

export default async function MedicareNewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = getMedicareNewsArticle(slug);
  if (!article) notFound();

  const url = absoluteUrl(`/news/${article.slug}`);
  const otherArticles = medicareNewsArticles.filter((item) => item.slug !== article.slug);

  const newsArticleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedDate,
    dateModified: article.publishedDate,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
    author: {
      "@type": "Person",
      name: "Patrick Mackin IV",
      jobTitle: "Independent Licensed Florida Health Insurance Broker",
      url: absoluteUrl("/about"),
      sameAs: site.sameAs,
      identifier: [
        { "@type": "PropertyValue", name: "National Producer Number", value: `NPN ${site.npn}` },
        { "@type": "PropertyValue", name: "Florida DFS License", value: `FL License #${site.floridaLicense}` },
      ],
    },
    publisher: {
      "@type": "Organization",
      name: site.legalName,
      url: absoluteUrl("/"),
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(site.logoPath),
      },
    },
  };

  const faqPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "2027 Medicare News", item: absoluteUrl("/news") },
      { "@type": "ListItem", position: 3, name: article.title, item: url },
    ],
  };

  return (
    <>
      <PremiumInteriorHero
        eyebrow={article.eyebrow}
        title={article.title}
        subtitle={article.description}
        actions={[
          { label: "Check Your 2027 Plans", href: PLANENROLL, kind: "primary", external: true },
          { label: "Book an Annual Review", href: MEDICARE_REVIEW_BOOKING_URL, kind: "gold", external: true },
          { label: `Call or Text ${site.phoneDisplay}`, href: `tel:${site.phoneE164}`, kind: "light" },
        ]}
      >
        <PremiumDisclosure>{MANDATORY_CMS_DISCLAIMER}</PremiumDisclosure>
      </PremiumInteriorHero>

      <Container className="py-12">
        <div className="mb-8 flex flex-wrap items-center gap-2 font-sans text-sm text-slate-600">
          <Link className="font-bold text-[var(--ve-teal)] underline underline-offset-4" href="/">
            Home
          </Link>
          <span>/</span>
          <Link className="font-bold text-[var(--ve-teal)] underline underline-offset-4" href="/news">
            2027 Medicare News
          </Link>
          <span>/</span>
          <span className="text-slate-700">{article.eyebrow}</span>
        </div>

        <div className="space-y-8">
          <section className="rounded-3xl border border-[var(--ve-teal)]/12 bg-white/95 p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)] md:p-8">
            <p className="font-sans text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--ve-gold)]">
              Key Facts ({article.sourceAttribution})
            </p>
            {article.framingQuestion ? (
              <p className="mt-3 font-display text-2xl font-bold text-[var(--ve-teal)]">{article.framingQuestion}</p>
            ) : null}
            <ul className="mt-4 space-y-3 font-sans text-base leading-7 text-slate-800">
              {article.summaryPoints.map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="font-bold text-[var(--ve-teal)]">*</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>

          {article.sections.map((section) => (
            <section
              key={section.heading}
              className="rounded-3xl border border-[var(--ve-teal)]/10 bg-white/92 p-6 shadow-[0_14px_38px_rgba(15,23,42,0.06)] md:p-8"
            >
              <h2 className="font-display text-2xl font-bold text-[var(--ve-teal)]">{section.heading}</h2>
              <div className="mt-4 space-y-4 font-sans text-base leading-7 text-slate-700">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}

          <section className="rounded-3xl border border-[var(--ve-teal)]/12 bg-white/95 p-6 shadow-[0_14px_38px_rgba(15,23,42,0.06)] md:p-8">
            <p className="font-sans text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--ve-gold)]">
              Direct Answers
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-[var(--ve-teal)]">Frequently Asked Questions</h2>
            <div className="mt-5 space-y-5 font-sans">
              {article.faqs.map((faq) => (
                <div key={faq.question} className="border-b border-slate-200/80 pb-4 last:border-b-0 last:pb-0">
                  <h3 className="text-base font-extrabold text-[var(--ve-teal)]">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-[var(--ve-teal)] p-8 text-white shadow-[0_28px_80px_rgba(0,63,69,0.22)] md:p-10">
            <p className="font-sans text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--ve-gold)]">
              Next Steps With Patrick Mackin IV
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">
              Check Your Doctors and Prescriptions for 2027
            </h2>
            <p className="mt-3 max-w-3xl font-sans text-base leading-7 text-white/90">{PATRICK_POSITIONING_LINE}</p>
            <ol className="mt-4 grid gap-3 font-sans text-sm text-white/95 md:grid-cols-3">
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

          <section className="rounded-3xl border border-[var(--ve-teal)]/10 bg-white/90 p-6 md:p-8">
            <h2 className="font-display text-xl font-bold text-[var(--ve-teal)]">More 2027 Medicare Updates</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {otherArticles.map((item) => (
                <Link
                  key={item.slug}
                  href={`/news/${item.slug}`}
                  className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 font-sans text-sm font-semibold text-[var(--ve-teal)] transition hover:border-[var(--ve-teal)] hover:bg-white"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </Container>

      <StructuredData entries={[newsArticleJsonLd, faqPageJsonLd, breadcrumbJsonLd]} />
    </>
  );
}
