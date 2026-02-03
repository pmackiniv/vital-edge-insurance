import Link from "next/link";
import { Container } from "@/components/Container";
import { site } from "@/lib/site";
import { AIChatPanel } from "@/components/AIChatPanel";

export default function ChatPage() {
  return (
    <Container className="py-14">
      <div className="max-w-3xl space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight text-black">Talk with a licensed agent now</h1>
        <p className="text-sm leading-6 text-black/70">
          Chat here for general questions and next step help. We do not provide plan-specific guidance via chat. We will
          connect you with a licensed agent for your convenience, call or text {site.phoneDisplay}, request a callback, or
          schedule an appointment that works best for you.
        </p>
      </div>

      <div className="mt-6 max-w-3xl rounded-2xl border border-black/10 bg-white p-6">
        <AIChatPanel />
      </div>

      <div className="mt-6 max-w-3xl rounded-2xl border border-black/10 bg-[var(--muted)] p-5 text-sm text-black/70">
        <div className="text-xs font-semibold uppercase tracking-wide text-black/60">Need a callback</div>
        <p className="mt-2">
          If you want licensed help, use the contact form or schedule a call. We respond as quickly as possible during business
          hours.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-blue)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Contact form
          </Link>
          <Link
            href="/schedule"
            className="inline-flex items-center justify-center rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold text-black hover:bg-black/5"
          >
            Schedule a call
          </Link>
          <a
            href={`tel:${site.phoneE164}`}
            className="inline-flex items-center justify-center rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold text-black hover:bg-black/5"
          >
            Call {site.phoneDisplay}
          </a>
        </div>
      </div>
    </Container>
  );
}
