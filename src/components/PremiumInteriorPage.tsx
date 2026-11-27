import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { interiorPhotos, photoForInteriorPage } from "@/lib/interiorTheme";
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
  const photo = photoForInteriorPage(eyebrow, title);

  return (
    <section className="ve-interior-hero">
      <Container>
        <div className="ve-interior-hero-grid">
          <div className="ve-interior-hero-copy">
            <p className="ve-interior-eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="ve-interior-subtitle">{subtitle}</p>
            {actions.length > 0 && (
              <div className="ve-interior-actions">
                {actions.map((action) => (
                  <ActionLink key={`${action.label}-${action.href}`} action={action} />
                ))}
              </div>
            )}
            {children ? <div className="ve-interior-disclosure">{children}</div> : null}
          </div>
          <div className="ve-interior-photo" data-lifestyle-photo={photo} aria-hidden="true">
            <Image
              src={interiorPhotos[photo]}
              alt=""
              fill
              sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 1279px) 43vw, 535px"
              fetchPriority="high"
            />
          </div>
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
