import Link from "next/link";
import { Container } from "@/components/Container";

export default function Page() {
  return (
    <Container className="py-14">
      <div className="space-y-10">
        <div className="max-w-3xl space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight">Privacy</h1>
          <p className="text-black/70">
            This page provides a high-level summary of how Vital Edge Insurance handles information. A full privacy
            policy will be published after legal review.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-blue)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-green)]"
            >
              Ask a privacy question
            </Link>
            <Link
              href="/chat"
              className="inline-flex items-center justify-center rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold text-black hover:bg-black/5"
            >
              Chat with our team
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-black/10 bg-white p-6">
            <h2 className="text-sm font-semibold text-black">Information we collect</h2>
            <p className="mt-2 text-sm leading-6 text-black/70">
              Contact details and basic coverage questions that you share via forms, phone, or chat. We do not request
              sensitive identifiers like Social Security numbers or Medicare IDs through this site.
            </p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-6">
            <h2 className="text-sm font-semibold text-black">How we use information</h2>
            <p className="mt-2 text-sm leading-6 text-black/70">
              To respond to your inquiry, coordinate next steps, and improve our services. We do not sell personal
              information or use it for unrelated marketing.
            </p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-6">
            <h2 className="text-sm font-semibold text-black">Sharing</h2>
            <p className="mt-2 text-sm leading-6 text-black/70">
              We may share details only as needed to assist with your request, such as with a carrier or marketplace.
              We do not compare carriers or recommend specific plans.
            </p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-6">
            <h2 className="text-sm font-semibold text-black">Your choices</h2>
            <p className="mt-2 text-sm leading-6 text-black/70">
              You can request access, updates, or deletion of your contact information by reaching out directly. We will
              confirm identity before any changes.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-[var(--muted)] p-6">
          <h2 className="text-sm font-semibold text-black">Security and retention</h2>
          <p className="mt-2 text-sm leading-6 text-black/70">
            We take reasonable safeguards to protect information and only retain it as needed for service follow-up and
            recordkeeping. Specific retention periods will be posted in the full policy.
          </p>
        </div>

        <div className="rounded-2xl bg-[var(--brand-blue)] p-8 text-white md:p-10">
          <div className="text-sm font-semibold text-white/80">Questions about privacy?</div>
          <h2 className="mt-2 text-[clamp(1.6rem,2.4vw,2.4rem)] font-semibold tracking-tight">
            We are happy to clarify how information is handled.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/90">
            Use the contact form or chat to reach our team. We will respond with clear, non-technical answers.
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
