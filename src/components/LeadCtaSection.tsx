"use client";

import { useState } from "react";
import Link from "next/link";
import { LeadModal } from "@/components/LeadModal";
import { site } from "@/lib/site";

type LeadCtaSectionProps = {
  eyebrow?: string;
  title: string;
  description: string;
  ctaLabel?: string;
};

export function LeadCtaSection({
  eyebrow = "Next step",
  title,
  description,
  ctaLabel = "Request guidance",
}: LeadCtaSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-2xl bg-[var(--brand-blue)]/80 p-8 text-white md:p-10 backdrop-blur">
      <div className="text-sm font-semibold text-white/85">{eyebrow}</div>
      <h2 className="mt-2 text-[clamp(1.6rem,2.4vw,2.4rem)] font-semibold tracking-tight">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-white/92">{description}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn px-5 py-3 text-sm text-white"
          style={{ backgroundColor: "var(--brand-orange)" }}
        >
          {ctaLabel}
        </button>
        <Link
          href={`tel:${site.phoneE164}`}
          className="btn btn-outline-on-dark px-5 py-3 text-sm"
        >
          Call {site.phoneDisplay}
        </Link>
      </div>
      <p className="mt-4 text-xs text-white/75">
        Education only. Plan-specific guidance requires a licensed agent and proper scope.
      </p>
      <LeadModal isOpen={open} onClose={() => setOpen(false)} />
    </section>
  );
}
