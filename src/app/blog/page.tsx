import Link from "next/link";
import { Container } from "@/components/Container";

export default function Page() {
  return (
    <Container className="py-14">
      <div className="space-y-10">
        <div className="max-w-3xl space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight">Vital Edge Daily</h1>
          <p className="text-black/70">
            Educational updates on coverage concepts, enrollment timelines, and local guidance. Articles are drafted,
            reviewed, and published with a compliance-first lens.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-blue)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-green)]"
            >
              Submit a topic request
            </Link>
            <Link
              href="/chat"
              className="inline-flex items-center justify-center rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold text-black hover:bg-black/5"
            >
              Chat with our team
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Drafts in review",
              body: "New posts are prepared weekly and reviewed before publishing to ensure clarity and compliance.",
            },
            {
              title: "Local coverage notes",
              body: "County-level reminders and resources for Jacksonville and nearby communities.",
            },
            {
              title: "Coverage concepts",
              body: "Plain-language explanations of terms like deductibles, networks, and eligibility.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-black/10 bg-white p-6">
              <div className="text-sm font-semibold text-black">{item.title}</div>
              <p className="mt-2 text-sm leading-6 text-black/70">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-black/10 bg-[var(--muted)] p-6">
          <h2 className="text-sm font-semibold text-black">Editorial workflow</h2>
          <p className="mt-2 text-sm leading-6 text-black/70">
            Each article moves from draft to review before it appears publicly. Content is educational only and does not
            include plan recommendations, pricing promises, or carrier comparisons.
          </p>
        </div>

        <div className="rounded-2xl bg-[var(--brand-blue)] p-8 text-white md:p-10">
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
              className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-orange)] px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              Contact us
            </Link>
            <Link
              href="/chat"
              className="inline-flex items-center justify-center rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Chat now
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
