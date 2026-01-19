import Link from "next/link";
import { Container } from "@/components/Container";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white">
      <Container>
        <div className="grid gap-8 py-12 md:grid-cols-3">
          <div>
            <div className="text-sm font-semibold text-black">{site.name}</div>
            <p className="mt-2 text-sm leading-6 text-black/70">
              Independent guidance for individuals, families, and small businesses in Jacksonville and nearby counties.
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold text-black">Explore</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link className="text-black/70 hover:text-black" href="/services">Services</Link></li>
              <li><Link className="text-black/70 hover:text-black" href="/duval-county">Duval County</Link></li>
              <li><Link className="text-black/70 hover:text-black" href="/st-johns-county">St. Johns County</Link></li>
              <li><Link className="text-black/70 hover:text-black" href="/blog">Blog</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-black">Compliance</div>
            <p className="mt-3 text-sm leading-6 text-black/70">
              Medicare disclaimer: Not connected with or endorsed by the U.S. government or the federal Medicare program.
            </p>
            <div className="mt-4 flex gap-4 text-sm">
              <Link className="text-black/70 hover:text-black" href="/privacy">Privacy</Link>
              <Link className="text-black/70 hover:text-black" href="/contact">Contact</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-black/5 py-6 text-xs text-black/60">
          © {new Date().getFullYear()} {site.legalName}. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
