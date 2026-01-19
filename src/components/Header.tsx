"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { site } from "@/lib/site";
import { Container } from "@/components/Container";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl border border-black/10 bg-gradient-to-br from-black/5 to-black/0" />
            <div className="leading-tight">
              <div className="text-sm font-semibold text-black">{site.name}</div>
              <div className="text-xs text-black/60">Jacksonville, Florida</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {site.nav.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm text-black/70 hover:text-black">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/contact" className="hidden text-sm text-black/70 hover:text-black sm:inline">
              Contact
            </Link>
            <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
              <Link
                href={site.primaryCta.href}
                className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-black/20"
              >
                {site.primaryCta.label}
              </Link>
            </motion.div>
          </div>
        </div>
      </Container>
    </header>
  );
}
