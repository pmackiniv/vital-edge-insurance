"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/lib/site";
import { Container } from "@/components/Container";
import { TopBar } from "@/components/TopBar";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const originalOverflow = document.body.style.overflow;
    const hadNavOpenFlag = document.body.dataset.mobileNavOpen;
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      document.body.dataset.mobileNavOpen = "true";
    } else {
      document.body.style.overflow = originalOverflow || "";
      delete document.body.dataset.mobileNavOpen;
    }
    return () => {
      document.body.style.overflow = originalOverflow || "";
      if (hadNavOpenFlag) {
        document.body.dataset.mobileNavOpen = hadNavOpenFlag;
      } else {
        delete document.body.dataset.mobileNavOpen;
      }
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-[70] border-b border-black/5 bg-white shadow-sm">
      <TopBar />
      <div className="border-b border-black/5">
        <Container>
          <div className="flex h-16 items-center justify-between gap-4">
            <Link
              href="/"
              className="flex items-center gap-3"
              aria-label="Vital Edge Insurance home"
            >
              <Image
                src="/brand/vital-edge-logo.png"
                alt="Vital Edge Insurance logo"
                width={180}
                height={60}
                priority
                className="h-10 w-auto"
              />
              <div className="leading-tight">
                <div className="text-sm font-semibold text-black">{site.name}</div>
                <div className="text-xs text-black/60">Jacksonville, Florida</div>
              </div>
            </Link>

            <nav className="hidden items-center gap-6 md:flex">
              {site.nav.map((item) => (
                <Link key={item.href} href={item.href} className="text-sm font-semibold text-black/75 hover:text-black">
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-blue)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[var(--brand-green)] focus:outline-none focus:ring-2 focus:ring-black/20"
                >
                  Get Personalized Medicare Advice
                </Link>
              </motion.div>
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-black/10 p-2 text-black md:hidden"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-panel"
              aria-label="Toggle navigation"
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 6h18" />
                <path d="M3 12h18" />
                <path d="M3 18h18" />
              </svg>
            </button>
          </div>
        </Container>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-0 z-[90] bg-black/35 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              id="mobile-nav-panel"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative z-[95] border-b border-black/5 bg-white shadow-lg md:hidden"
            >
              <Container>
                <div className="space-y-4 py-6">
                  <nav className="grid gap-2">
                    {site.nav.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="rounded-xl px-3 py-3 text-base font-semibold text-black hover:bg-black/5"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/contact"
                      onClick={() => setMobileOpen(false)}
                      className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--brand-blue)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-green)]"
                    >
                      Get Personalized Medicare Advice
                    </Link>
                  </div>
                </div>
              </Container>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
