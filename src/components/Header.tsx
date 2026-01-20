"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/lib/site";
import { Container } from "@/components/Container";
import { TopBar } from "@/components/TopBar";

const serviceLinks = [
  { label: "ACA Marketplace", href: "/aca", description: "Enrollment windows, subsidies, and plan basics." },
  { label: "Medicare Guidance", href: "/medicare", description: "Routing for Medicare options with SOA compliance." },
  { label: "Medigap", href: "/medicare", description: "Supplement education and timing considerations." },
  { label: "ICHRA", href: "/ichra", description: "Defined contribution guidance for teams." },
  { label: "Off-Exchange", href: "/off-exchange", description: "Alternatives beyond the marketplace." },
  { label: "Small Group", href: "/services", description: "Support for small group decisions." },
];

export function Header() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur">
      <TopBar />
      <div className="border-b border-black/5">
        <Container>
          <div className="flex h-16 items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-black text-xs font-semibold text-white">
                VEI
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-black">{site.name}</div>
                <div className="text-xs text-black/60">Jacksonville, Florida</div>
              </div>
            </Link>

            <nav className="hidden items-center gap-6 md:flex">
              {site.nav.map((item) => {
                if (item.label === "Services") {
                  return (
                    <div
                      key={item.href}
                      className="relative"
                      onMouseEnter={() => setActiveMenu("services")}
                      onMouseLeave={() => setActiveMenu(null)}
                    >
                      <button className="text-sm text-black/70 hover:text-black">Services</button>
                      <AnimatePresence>
                        {activeMenu === "services" ? (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute left-0 top-full z-50 mt-4 w-[520px] rounded-2xl border border-black/10 bg-white p-6 shadow-lg"
                          >
                            <div className="text-xs font-semibold uppercase tracking-wide text-black/60">Explore services</div>
                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                              {serviceLinks.map((service) => (
                                <Link key={service.label} href={service.href} className="rounded-xl border border-black/10 p-4 hover:bg-black/5">
                                  <div className="text-sm font-semibold text-black">{service.label}</div>
                                  <p className="mt-2 text-xs text-black/60">{service.description}</p>
                                </Link>
                              ))}
                            </div>
                            <div className="mt-4 flex gap-3">
                              <Link
                                href="/chat"
                                className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-blue)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-green)]"
                              >
                                Get help now
                              </Link>
                              <Link
                                href="/enroll"
                                className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-orange)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                              >
                                Enroll
                              </Link>
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link key={item.href} href={item.href} className="text-sm text-black/70 hover:text-black">
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
                <Link
                  href="/chat"
                  className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-blue)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[var(--brand-green)] focus:outline-none focus:ring-2 focus:ring-black/20"
                >
                  Get help now
                </Link>
              </motion.div>
              <Link
                href="/enroll"
                className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-orange)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Enroll
              </Link>
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-black/10 p-2 text-black md:hidden"
              aria-expanded={mobileOpen}
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
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="border-b border-black/5 bg-white md:hidden"
          >
            <Container>
              <div className="space-y-4 py-6">
                <nav className="grid gap-3">
                  {site.nav.map((item) => (
                    <Link key={item.href} href={item.href} className="text-sm font-semibold text-black">
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="flex flex-col gap-3">
                  <Link
                    href="/chat"
                    className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-blue)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-green)]"
                  >
                    Get help now
                  </Link>
                  <Link
                    href="/enroll"
                    className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-orange)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                  >
                    Enroll
                  </Link>
                </div>
              </div>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
