import Link from "next/link";
import { Container } from "@/components/Container";
import { BottomFinePrint } from "@/components/BottomFinePrint";
import { serviceAreaStatement, site } from "@/lib/site";
import {
  externalLinkProps,
  FACEBOOK,
  GBP_REVIEWS,
  INSTAGRAM,
  LINKEDIN_COMPANY_PUBLIC,
  LINKEDIN_PERSONAL,
} from "@/lib/externalLinks";

export function Footer() {
  const linkProps = externalLinkProps();
  return (
    <footer className="border-t border-white/10 bg-[rgba(7,18,36,0.86)] text-white backdrop-blur-md">
      <Container>
        <div className="grid gap-8 py-12 md:grid-cols-3">
          <div>
            <div className="text-sm font-semibold text-white">{site.name}</div>
            <p className="mt-2 text-sm leading-6 text-white/80">
              Independent guidance for individuals, families, and small businesses. {serviceAreaStatement}
            </p>
            <div className="mt-3 space-y-1 text-sm">
              <a className="block text-white/80 hover:text-white" href={`tel:${site.phoneE164}`}>
                {site.phoneDisplay}
              </a>
              <a className="block text-white/80 hover:text-white" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-white">Explore</div>
            <ul className="mt-3 space-y-2 text-sm">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link className="text-white/80 hover:text-white" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li><Link className="text-white/80 hover:text-white" href="/schedule">Schedule a call</Link></li>
              <li><Link className="text-white/80 hover:text-white" href="/blog">Blog</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-white">Compliance</div>
            <p className="mt-3 text-sm leading-6 text-white/80">
              Licensed insurance agency with education-first guidance across approved service states. Plan availability
              still varies by state, county, ZIP code, carrier, eligibility, and enrollment timing.
            </p>
            <div className="mt-4 flex gap-4 text-sm">
              <Link className="text-white/80 hover:text-white" href="/privacy">Privacy</Link>
              <Link className="text-white/80 hover:text-white" href="/contact">Contact</Link>
              <a className="text-white/80 hover:text-white" href="https://www.medicare.gov" {...linkProps}>Medicare.gov</a>
            </div>
            <div className="mt-4 text-sm font-semibold text-white">Connect</div>
            <div className="mt-3 space-y-2 text-sm">
              <a className="block text-white/80 hover:text-white" href={FACEBOOK} {...linkProps}>Facebook</a>
              <a className="block text-white/80 hover:text-white" href={LINKEDIN_PERSONAL} {...linkProps}>Patrick on LinkedIn</a>
              <a className="block text-white/80 hover:text-white" href={LINKEDIN_COMPANY_PUBLIC} {...linkProps}>Vital Edge on LinkedIn</a>
              <a className="block text-white/80 hover:text-white" href={INSTAGRAM} {...linkProps}>Instagram</a>
              <a className="block text-white/80 hover:text-white" href={GBP_REVIEWS} {...linkProps}>Google Business Profile</a>
            </div>
          </div>
        </div>

        <BottomFinePrint />

        <div className="border-t border-white/10 py-6 text-sm text-white/70">
          © {new Date().getFullYear()} {site.legalName}. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
