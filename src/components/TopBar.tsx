import { site } from "@/lib/site";
import { Container } from "@/components/Container";
import Link from "next/link";
import {
  FACEBOOK,
  GBP_REVIEWS,
  INSTAGRAM,
  LINKEDIN_COMPANY_PUBLIC,
  externalLinkProps,
} from "@/lib/externalLinks";
import type { ReactNode } from "react";

type SocialIconLink = {
  label: string;
  href: string;
  icon: ReactNode;
};

export function TopBar() {
  const linkProps = externalLinkProps();
  const socialLinks: SocialIconLink[] = [
    {
      label: "Facebook",
      href: FACEBOOK,
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <path
            fill="currentColor"
            d="M13.5 9.5h2.7l-.4 3h-2.3V21h-3.1v-8.5H8.4v-3h2.6V7.8c0-2.4 1.4-3.8 3.6-3.8 1 0 2 .1 2 .1v2.5h-1.1c-1.1 0-1.4.7-1.4 1.4v1.5Z"
          />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      href: LINKEDIN_COMPANY_PUBLIC,
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <path
            fill="currentColor"
            d="M6.7 8.5a1.8 1.8 0 1 1 0-3.6 1.8 1.8 0 0 1 0 3.6ZM5 9.8h3.4V20H5V9.8Zm5.4 0h3.3v1.4h.1c.5-.9 1.7-1.8 3.4-1.8 3.6 0 4.2 2.3 4.2 5.4V20H18v-4.7c0-1.1 0-2.5-1.5-2.5s-1.8 1.2-1.8 2.4V20h-3.4V9.8Z"
          />
        </svg>
      ),
    },
    {
      label: "Google Business Profile",
      href: GBP_REVIEWS,
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12.2 12.2v2.8h3.9c-.2 1-1.3 2.9-3.9 2.9a4.5 4.5 0 0 1 0-9c1.3 0 2.2.5 2.7 1l1.8-1.7A7 7 0 0 0 5 12a7 7 0 0 0 7.2 7c4.1 0 6.8-2.9 6.8-6.9 0-.5-.1-.8-.1-1.2H12.2Z"
          />
        </svg>
      ),
    },
    {
      label: "Instagram",
      href: INSTAGRAM,
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <path
            fill="currentColor"
            d="M16 3H8a5 5 0 0 0-5 5v8a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5V8a5 5 0 0 0-5-5Zm3 13a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v8Zm-7-9a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm4.8-8.6a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="border-b border-black/10 bg-white/95">
      <Container>
        <div className="flex min-h-11 items-center justify-between gap-3 py-2">
          <div className="flex min-w-0 items-center gap-4 text-sm text-black/80">
            <a className="font-medium hover:text-black" href={`tel:${site.phoneE164}`}>
              Call Now
            </a>
            <a className="hidden font-medium hover:text-black sm:inline" href={`mailto:${site.email}`}>
              Email Us
            </a>
            <Link className="hidden font-medium hover:text-black md:inline" href="/contact">
              Client Support
            </Link>
            <span className="hidden text-black/30 md:inline">•</span>
            <span className="hidden truncate text-black/60 lg:inline">{site.phoneDisplay}</span>
          </div>
          <div className="flex items-center gap-2">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/15 text-black/70 transition hover:border-black/30 hover:text-black"
                href={item.href}
                aria-label={item.label}
                {...linkProps}
              >
                {item.icon}
                <span className="sr-only">{item.label}</span>
              </a>
            ))}
            <span className="hidden text-black/30 md:inline">•</span>
            <a className="hidden text-sm text-black/70 hover:text-black md:inline" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </div>
        </div>
        <div className="hidden items-center justify-center gap-3 border-t border-black/5 py-2 text-sm font-semibold lg:flex">
          <Link
            href="/resources"
            className="inline-flex min-w-[12rem] items-center justify-center rounded-md bg-[var(--brand-green)] px-4 py-2 text-white hover:brightness-95"
          >
            Explore Resources
          </Link>
          <Link
            href="/resources#starter-kit"
            className="inline-flex min-w-[12rem] items-center justify-center rounded-md bg-[var(--brand-blue)] px-4 py-2 text-white hover:brightness-95"
          >
            Starter Kit
          </Link>
          <Link
            href="/medicare"
            className="inline-flex min-w-[12rem] items-center justify-center rounded-md bg-[#65b4bf] px-4 py-2 text-white hover:brightness-95"
          >
            New to Medicare
          </Link>
        </div>
      </Container>
    </div>
  );
}
