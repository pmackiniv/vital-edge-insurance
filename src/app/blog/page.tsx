import Link from "next/link";
import { Container } from "@/components/Container";
import { PremiumDisclosure, PremiumInteriorHero } from "@/components/PremiumInteriorPage";

export default function Page() {
  return (
    <>
      <PremiumInteriorHero
        eyebrow="Vital Edge Daily"
        title="Educational Updates"
        subtitle="Coverage concepts, enrollment timelines, and local guidance drafted with a compliance-first lens."
        actions={[
          { label: "Submit a Topic Request", href: "/contact", kind: "primary" },
          { label: "Resources", href: "/resources", kind: "gold" },
          { label: "Chat With Our Team", href: "/chat", kind: "light" },
        ]}
      >
        <PremiumDisclosure>
          Blog content is educational only and does not include plan recommendations, pricing promises, or carrier
          comparisons.
        </PremiumDisclosure>
      </PremiumInteriorHero>

    <Container className="py-12">
      <div className="space-y-10">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Drafts in review",
              body: "New posts are prepared weekly and reviewed before publishing to ensure clarity and compliance.",
            },
            {
              title: "Local coverage notes",
              body: "State and county reminders for clients across the licensed service footprint.",
            },
            {
              title: "Coverage concepts",
              body: "Plain-language explanations of terms like deductibles, networks, and eligibility.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-[var(--ve-teal)]/10 bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
              <div className="text-sm font-extrabold text-[var(--ve-teal)]">{item.title}</div>
              <p className="mt-2 text-sm leading-6 text-slate-700">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-[var(--ve-teal)]/10 bg-[linear-gradient(135deg,rgba(228,246,247,0.92),rgba(255,255,255,0.94))] p-6 shadow-[0_18px_52px_rgba(15,23,42,0.08)]">
          <h2 className="text-sm font-extrabold text-[var(--ve-teal)]">Editorial workflow</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Each article moves from draft to review before it appears publicly. Content is educational only and does not
            include plan recommendations, pricing promises, or carrier comparisons.
          </p>
        </div>

        <div className="rounded-3xl bg-[var(--ve-teal)] p-8 text-white shadow-[0_28px_80px_rgba(0,63,69,0.22)] md:p-10">
          <div className="text-sm font-semibold text-white/80">Have a question today?</div>
          <h2 className="mt-2 text-[clamp(1.6rem,2.4vw,2.4rem)] font-semibold tracking-tight">
            Connect with our team for general guidance.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/90">
            We can help you understand options and point you to the right next step without giving plan-specific advice.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="premium-small-button premium-small-button-gold"
            >
              Contact us
            </Link>
            <Link
              href="/chat"
              className="premium-small-button border border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/15"
            >
              Chat now
            </Link>
          </div>
        </div>
      </div>
    </Container>
    </>
  );
}
