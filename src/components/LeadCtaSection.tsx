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
    <section className="relative overflow-hidden rounded-3xl bg-[var(--ve-teal)] p-8 text-white shadow-[0_28px_80px_rgba(0,63,69,0.22)] md:p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.18),transparent_34%),linear-gradient(135deg,rgba(197,138,43,0.28),transparent_42%)]" />
      <div className="relative">
      <div className="text-sm font-extrabold uppercase tracking-[0.14em] text-white/78">{eyebrow}</div>
      <h2 className="mt-2 font-display text-[clamp(2rem,3vw,3rem)] font-bold leading-tight tracking-normal">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-white/92">{description}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="premium-small-button premium-small-button-gold"
        >
          {ctaLabel}
        </button>
        <Link
          href={`tel:${site.phoneE164}`}
          className="premium-small-button border border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/15"
        >
          Call {site.phoneDisplay}
        </Link>
      </div>
      <p className="mt-4 text-xs text-white/75">
        Education only. Plan-specific guidance requires a licensed agent and proper scope.
      </p>
      </div>
      <LeadModal isOpen={open} onClose={() => setOpen(false)} />
    </section>
  );
}
