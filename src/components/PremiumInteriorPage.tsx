import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { externalLinkProps } from "@/lib/externalLinks";

export type PremiumAction = {
  label: string;
  href: string;
  kind?: "primary" | "gold" | "light";
  external?: boolean;
};

export type PremiumFeature = {
  title: string;
  body: string;
};

export type PremiumLink = {
  label: string;
  href: string;
};

function ActionLink({ action }: { action: PremiumAction }) {
  const classes =
    action.kind === "gold"
      ? "premium-small-button premium-small-button-gold"
      : action.kind === "light"
        ? "premium-small-button premium-small-button-light"
        : "premium-small-button premium-small-button-primary";

  if (action.external) {
    return (
      <a href={action.href} {...externalLinkProps()} className={classes}>
        {action.label}
      </a>
    );
  }

  return (
    <Link href={action.href} className={classes}>
      {action.label}
    </Link>
  );
}

export function PremiumInteriorHero({
  eyebrow,
  title,
  subtitle,
  actions,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  actions: PremiumAction[];
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-[#fff7e9]">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero/vital-edge-goa-beach-hero.png"
          alt=""
          fill
          priority
          className="object-cover object-[center_top] md:object-center"
          sizes="100vw"
        />
        {/* Lightened from 0.98/0.86/0.2 — the copy now sits on its own glass
            pane, so the photograph no longer has to be washed out to stay
            readable behind it. */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,249,238,0.5)_0%,rgba(255,247,232,0.34)_43%,rgba(255,247,232,0.1)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white/80 to-transparent" />
      </div>
      <Container>
        <div className="max-w-3xl py-16 md:py-24">
          <div className="vei-glass vei-glass-light rounded-3xl px-6 py-7 md:px-9 md:py-9">
            <p className="font-sans text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--ve-teal)]">
              {eyebrow}
            </p>
            <h1 className="mt-4 font-display text-[clamp(2.75rem,5vw,5rem)] font-bold leading-[0.98] tracking-normal text-[var(--ve-teal)]">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl font-sans text-base leading-7 text-slate-800 md:text-lg">{subtitle}</p>
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {actions.map((action) => (
              <ActionLink key={`${action.label}-${action.href}`} action={action} />
            ))}
          </div>
          {children ? <div className="mt-6">{children}</div> : null}
        </div>
      </Container>
    </section>
  );
}

export function PremiumFeatureGrid({ features }: { features: PremiumFeature[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {features.map((item) => (
        <article
          key={item.title}
          className="vei-glass vei-glass-light rounded-2xl p-6"
        >
          <h2 className="font-sans text-base font-extrabold text-[var(--ve-teal)]">{item.title}</h2>
          <p className="mt-3 font-sans text-sm leading-6 text-slate-700">{item.body}</p>
        </article>
      ))}
    </div>
  );
}

export function PremiumCard({
  title,
  children,
  tone = "white",
}: {
  title: string;
  children: ReactNode;
  tone?: "white" | "teal" | "soft";
}) {
  // Glass material lives in globals.css (.vei-glass*) so every surface on the
  // site shares one definition of blur, tint, and specular edge.
  const toneClasses =
    tone === "teal"
      ? "vei-glass vei-glass-deep"
      : tone === "soft"
        ? "vei-glass vei-glass-tint"
        : "vei-glass vei-glass-light";

  return (
    <section className={`rounded-3xl p-6 ${toneClasses}`}>
      <h2 className={tone === "teal" ? "font-sans text-base font-extrabold text-white" : "font-sans text-base font-extrabold text-[var(--ve-teal)]"}>
        {title}
      </h2>
      <div className={tone === "teal" ? "mt-3 font-sans text-sm leading-7 text-white/88" : "mt-3 font-sans text-sm leading-7 text-slate-700"}>
        {children}
      </div>
    </section>
  );
}

export function PremiumLinkGrid({ links }: { links: PremiumLink[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {links.map((link) => (
        <Link
          key={`${link.href}-${link.label}`}
          href={link.href}
          className="font-sans text-sm font-bold text-[var(--ve-teal)] underline underline-offset-4 transition hover:text-[var(--ve-gold)]"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

export function PremiumContentBand({
  title,
  children,
  tone = "white",
}: {
  title: string;
  children: ReactNode;
  tone?: "white" | "teal";
}) {
  const toneClasses = tone === "teal" ? "vei-glass vei-glass-deep" : "vei-glass vei-glass-light";

  return (
    <section className={`rounded-3xl p-6 md:p-8 ${toneClasses}`}>
      <h2 className="font-display text-3xl font-bold leading-tight tracking-normal">{title}</h2>
      <div className={tone === "teal" ? "mt-4 font-sans text-sm leading-7 text-white/88" : "mt-4 font-sans text-sm leading-7 text-slate-700"}>
        {children}
      </div>
    </section>
  );
}

export function PremiumDisclosure({ children }: { children: ReactNode }) {
  return (
    <div className="vei-glass vei-glass-light rounded-2xl p-4 font-sans text-xs leading-5 text-slate-700">
      {children}
    </div>
  );
}
