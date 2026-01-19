import Link from "next/link";
import { Container } from "@/components/Container";
import { site } from "@/lib/site";
import { externalLinkProps, LINKEDIN_COMPANY_PUBLIC, LINKEDIN_PERSONAL } from "@/lib/externalLinks";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-white">
        <Container>
          <div className="grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
            <div>
              <p className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-black/70">
                Serving Duval and St. Johns County
              </p>

              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-black sm:text-5xl">
                Clear health insurance guidance for Jacksonville, Florida.
              </h1>

              <p className="mt-4 max-w-xl text-base leading-7 text-black/70">
                Get support comparing options, understanding eligibility, and choosing coverage that fits your needs.
                We focus on clarity, speed, and a client-first process.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href={site.primaryCta.href}
                  className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
                >
                  {site.primaryCta.label}
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-black/5"
                >
                  View services
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4 text-xs text-black/60">
                <div className="rounded-xl border border-black/10 p-3">Fast replies</div>
                <div className="rounded-xl border border-black/10 p-3">Local focus</div>
                <div className="rounded-xl border border-black/10 p-3">Clear next steps</div>
              </div>

              <div className="mt-6 rounded-xl border border-black/10 bg-white p-4">
                <div className="text-xs font-semibold text-black">Founder</div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-black/70">
                  <span className="font-medium text-black">Patrick Mackin IV</span>
                  <a
                    href={LINKEDIN_PERSONAL}
                    {...externalLinkProps()}
                    className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-black hover:bg-black/5"
                  >
                    Connect on LinkedIn
                  </a>
                  <a
                    href={LINKEDIN_COMPANY_PUBLIC}
                    {...externalLinkProps()}
                    className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-black hover:bg-black/5"
                  >
                    Vital Edge Insurance on LinkedIn
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-gradient-to-br from-black/5 to-black/0 p-6">
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-black">Quick start</div>
                <p className="mt-2 text-sm leading-6 text-black/70">
                  Tell us what you need. We will recommend next steps and options to review.
                </p>
                <div className="mt-4 grid gap-3">
                  <div className="rounded-lg border border-black/10 px-3 py-2 text-sm text-black/50">
                    Name (placeholder)
                  </div>
                  <div className="rounded-lg border border-black/10 px-3 py-2 text-sm text-black/50">
                    Email or phone (placeholder)
                  </div>
                  <div className="rounded-lg border border-black/10 px-3 py-2 text-sm text-black/50">
                    What are you looking for? (placeholder)
                  </div>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                  >
                    Go to contact form
                  </Link>
                  <p className="text-xs text-black/60">
                    Medicare disclaimer: Not connected with or endorsed by the U.S. government or the federal Medicare program.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-black/5 bg-white">
        <Container>
          <div className="py-14 md:py-18">
            <h2 className="text-2xl font-semibold tracking-tight text-black">What we help with</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-black/70">
              We build a clean path from questions to coverage options, with clear explanations and reliable follow-up.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <Link href="/aca" className="rounded-2xl border border-black/10 p-6 hover:bg-black/5">
                <div className="text-sm font-semibold text-black">ACA Marketplace</div>
                <p className="mt-2 text-sm leading-6 text-black/70">
                  Eligibility, enrollment windows, plan comparisons, and subsidy basics.
                </p>
              </Link>

              <Link href="/ichra" className="rounded-2xl border border-black/10 p-6 hover:bg-black/5">
                <div className="text-sm font-semibold text-black">Small business options</div>
                <p className="mt-2 text-sm leading-6 text-black/70">
                  ICHRA and other approaches to support teams with predictable costs.
                </p>
              </Link>

              <Link href="/off-exchange" className="rounded-2xl border border-black/10 p-6 hover:bg-black/5">
                <div className="text-sm font-semibold text-black">Off-exchange plans</div>
                <p className="mt-2 text-sm leading-6 text-black/70">
                  Alternatives when marketplace plans are not the best fit.
                </p>
              </Link>

              <Link href="/medicare" className="rounded-2xl border border-black/10 p-6 hover:bg-black/5">
                <div className="text-sm font-semibold text-black">Medicare education</div>
                <p className="mt-2 text-sm leading-6 text-black/70">
                  Educational guidance to help you understand choices and timelines.
                </p>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-black/5 bg-white">
        <Container>
          <div className="py-14">
            <h2 className="text-2xl font-semibold tracking-tight text-black">Local landing pages</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-black/70">
              Purpose-built pages for local searches and quick navigation.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <Link href="/duval-county" className="rounded-2xl border border-black/10 p-6 hover:bg-black/5">
                <div className="text-sm font-semibold text-black">Duval County</div>
                <p className="mt-2 text-sm leading-6 text-black/70">
                  Jacksonville-focused guidance, FAQs, and service options.
                </p>
              </Link>
              <Link href="/st-johns-county" className="rounded-2xl border border-black/10 p-6 hover:bg-black/5">
                <div className="text-sm font-semibold text-black">St. Johns County</div>
                <p className="mt-2 text-sm leading-6 text-black/70">
                  St. Augustine area guidance with the same fast response process.
                </p>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-black/5 bg-white">
        <Container>
          <div className="py-14">
            <h2 className="text-2xl font-semibold tracking-tight text-black">FAQ</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-black/10 p-6">
                <div className="text-sm font-semibold text-black">How fast do you respond?</div>
                <p className="mt-2 text-sm leading-6 text-black/70">
                  Typically the same day during business hours. Use the contact page to request help.
                </p>
              </div>
              <div className="rounded-2xl border border-black/10 p-6">
                <div className="text-sm font-semibold text-black">Do you help with enrollment?</div>
                <p className="mt-2 text-sm leading-6 text-black/70">
                  We can provide guidance and next steps based on your situation and timelines.
                </p>
              </div>
            </div>

            <div className="mt-10 rounded-2xl bg-black p-8 text-white">
              <div className="text-sm font-semibold">Ready for next steps?</div>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">
                Tell us what you need and we will respond with a clear path forward.
              </p>
              <div className="mt-6">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black hover:opacity-90"
                >
                  Request help
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
