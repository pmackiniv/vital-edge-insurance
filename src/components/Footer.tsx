import Link from "next/link";
import { Container } from "@/components/Container";
import { BottomFinePrint } from "@/components/BottomFinePrint";
import { site } from "@/lib/site";
import { externalLinkProps, FACEBOOK, GBP_REVIEWS, INSTAGRAM } from "@/lib/externalLinks";

export function Footer() {
  const linkProps = externalLinkProps();
  return (
    <footer className="border-t border-white/10 bg-transparent">
      <Container>
        <div className="grid gap-8 py-12 md:grid-cols-3">
          <div>
            <div className="text-sm font-semibold text-black">{site.name}</div>
            <p className="mt-2 text-sm leading-6 text-black/70">
              Independent guidance for individuals, families, and small businesses in Jacksonville and nearby counties.
            </p>
            <div className="mt-3 space-y-1 text-sm">
              <a className="block text-black/70 hover:text-black" href={`tel:${site.phoneE164}`}>
                {site.phoneDisplay}
              </a>
              <a className="block text-black/70 hover:text-black" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-black">Explore</div>
            <ul className="mt-3 space-y-2 text-sm">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link className="text-black/70 hover:text-black" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-black">Compliance</div>
            <p className="mt-3 text-sm leading-6 text-black/70">
              Education-first insurance guidance from a licensed agency serving Jacksonville and counties across Florida.
            </p>
            <div className="mt-4 flex gap-4 text-sm">
              <Link className="text-black/70 hover:text-black" href="/privacy">Privacy</Link>
              <Link className="text-black/70 hover:text-black" href="/contact">Contact</Link>
              <a className="text-black/70 hover:text-black" href="https://www.medicare.gov" {...linkProps}>Medicare.gov</a>
            </div>
            <div className="mt-4 text-sm font-semibold text-black">Connect</div>
            <div className="mt-3 space-y-2 text-sm">
              <a className="block text-black/70 hover:text-black" href={FACEBOOK} {...linkProps}>Facebook</a>
              <a className="block text-black/70 hover:text-black" href={INSTAGRAM} {...linkProps}>Instagram</a>
              <a className="block text-black/70 hover:text-black" href={GBP_REVIEWS} {...linkProps}>Google Business Profile</a>
            </div>
          </div>
        </div>

        <BottomFinePrint />

        <div className="border-t border-black/5 py-6 text-sm text-black/60">
          © {new Date().getFullYear()} {site.legalName}. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
