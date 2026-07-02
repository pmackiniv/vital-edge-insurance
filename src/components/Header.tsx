"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/Container";
import { site } from "@/lib/site";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpenLabel, setDesktopOpenLabel] = useState<string | null>(null);
  const [mobileOpenGroupLabel, setMobileOpenGroupLabel] = useState<string | null>(null);
  const closeMobileNav = () => {
    setMobileOpen(false);
    setMobileOpenGroupLabel(null);
  };
  const toggleMobileNav = () => {
    if (mobileOpen) {
      closeMobileNav();
      return;
    }
    setMobileOpen(true);
  };

  useEffect(() => {
    if (typeof document === "undefined") return;
    const originalOverflow = document.body.style.overflow;
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      document.body.dataset.mobileNavOpen = "true";
    } else {
      document.body.style.overflow = "";
      delete document.body.dataset.mobileNavOpen;
    }
    return () => {
      document.body.style.overflow = originalOverflow || "";
      delete document.body.dataset.mobileNavOpen;
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setDesktopOpenLabel(null);
      setMobileOpen(false);
      setMobileOpenGroupLabel(null);
    };
    const handleOutsidePress = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      if (event.target.closest("[data-main-nav]")) return;
      setDesktopOpenLabel(null);
    };
    window.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleOutsidePress);
    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleOutsidePress);
    };
  }, []);

  return (
    <header className="sticky top-0 z-[70] border-b border-white/40 bg-white/82 shadow-[0_10px_40px_rgba(0,63,69,0.08)] backdrop-blur-xl">
      <div>
        <Container>
          <div className="flex min-h-[5.4rem] items-center justify-between gap-4 py-3">
            <Link
              href="/"
              className="flex items-center gap-3"
              aria-label="Vital Edge Insurance home"
            >
              <Image
                src="/brand/vital-edge-logo.png"
                alt="Vital Edge Insurance logo"
                width={200}
                height={200}
                priority
                className="h-14 w-14 rounded-2xl object-contain sm:h-16 sm:w-16"
              />
              <div className="leading-tight">
                <div className="font-display text-xl font-bold leading-none tracking-normal text-[var(--ve-teal)] sm:text-2xl">
                  Vital Edge
                </div>
                <div className="mt-1 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--ve-gold)]">
                  Insurance
                </div>
                <div className="mt-1 hidden text-[0.64rem] font-bold uppercase tracking-[0.12em] text-[var(--ve-teal)]/80 sm:block">
                  Guidance you can trust
                </div>
              </div>
            </Link>

            <nav className="hidden items-center gap-6 lg:flex" data-main-nav>
              {site.mainNav.map((item) => {
                const hasChildren = Array.isArray(item.children) && item.children.length > 0;
                const isOpen = desktopOpenLabel === item.label;
                if (!hasChildren && item.href) {
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="text-sm font-bold text-[var(--ve-teal)] transition hover:text-[var(--ve-gold)]"
                      onFocus={() => setDesktopOpenLabel(null)}
                    >
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setDesktopOpenLabel(item.label)}
                    onMouseLeave={() => setDesktopOpenLabel((prev) => (prev === item.label ? null : prev))}
                  >
                    <button
                      type="button"
                      className="inline-flex min-h-11 items-center gap-1 text-sm font-bold text-[var(--ve-teal)] transition hover:text-[var(--ve-gold)]"
                      aria-expanded={isOpen}
                      aria-haspopup={hasChildren ? "menu" : undefined}
                      onClick={() => setDesktopOpenLabel((prev) => (prev === item.label ? null : item.label))}
                    >
                      {item.href ? <span>{item.label}</span> : item.label}
                      <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="m5 7 5 5 5-5" />
                      </svg>
                    </button>
                    {isOpen && hasChildren ? (
                      <div className="absolute left-0 top-full z-[120] mt-3 min-w-[17rem] rounded-2xl border border-[var(--ve-teal)]/10 bg-white p-2 shadow-[0_24px_70px_rgba(15,23,42,0.16)]">
                        {item.children?.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 hover:bg-[var(--ve-bg)] hover:text-[var(--ve-teal)]"
                            onClick={() => setDesktopOpenLabel(null)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
                <Link
                  href="/contact"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--ve-teal)] px-5 py-2.5 text-sm font-extrabold text-white shadow-[0_14px_34px_rgba(0,63,69,0.22)] hover:bg-[var(--ve-teal-2)] focus:outline-none focus:ring-2 focus:ring-[var(--ve-teal)]/30"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M7.6 4.2 5.3 6.5c-.8.8-.8 2.1-.2 3.2 2 3.8 5.4 7.2 9.2 9.2 1.1.6 2.4.6 3.2-.2l2.3-2.3-4-3-1.8 1.8c-2.3-1.1-4.1-2.9-5.2-5.2l1.8-1.8-3-4Z" />
                  </svg>
                  {site.primaryCta.label}
                </Link>
              </motion.div>
            </div>

            <button
              type="button"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-[var(--ve-teal)]/15 bg-white/70 p-2 text-[var(--ve-teal)] shadow-sm md:hidden"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-panel"
              aria-label="Toggle navigation"
              onClick={toggleMobileNav}
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
              className="fixed inset-0 z-[9998] bg-black/35 md:hidden"
              onClick={closeMobileNav}
            />
            <motion.div
              id="mobile-nav-panel"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative z-[9999] border-b border-black/5 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] md:hidden"
            >
              <Container>
                <div className="space-y-4 py-6">
                  <div className="flex items-center justify-between gap-3 px-1">
                    <div className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--ve-teal)]/70">
                      Menu
                    </div>
                    <button
                      type="button"
                      aria-label="Close menu"
                      onClick={closeMobileNav}
                      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-[var(--ve-teal)]/15 bg-white text-[var(--ve-teal)] shadow-sm hover:bg-[var(--ve-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--ve-teal)]/25"
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M6 6l12 12" />
                        <path d="M18 6 6 18" />
                      </svg>
                    </button>
                  </div>
                  <nav className="grid gap-2">
                    {site.mainNav.map((item) => {
                      const hasChildren = Array.isArray(item.children) && item.children.length > 0;
                      const groupOpen = mobileOpenGroupLabel === item.label;

                      if (!hasChildren && item.href) {
                        return (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={closeMobileNav}
                            className="rounded-xl px-3 py-3 text-base font-bold text-[var(--ve-teal)] hover:bg-[var(--ve-bg)]"
                          >
                            {item.label}
                          </Link>
                        );
                      }

                      return (
                        <div key={item.label} className="rounded-xl border border-black/10">
                          <div className="flex items-stretch">
                            {item.href ? (
                              <Link
                                href={item.href}
                                onClick={closeMobileNav}
                                className="flex-1 rounded-l-xl px-3 py-3 text-base font-bold text-[var(--ve-teal)] hover:bg-[var(--ve-bg)]"
                              >
                                {item.label}
                              </Link>
                            ) : (
                              <div className="flex-1 rounded-l-xl px-3 py-3 text-base font-bold text-[var(--ve-teal)]">
                                {item.label}
                              </div>
                            )}
                            <button
                              type="button"
                              className="inline-flex min-w-12 items-center justify-center rounded-r-xl border-l border-black/10 px-3 py-3 text-[var(--ve-teal)] hover:bg-[var(--ve-bg)]"
                              aria-expanded={groupOpen}
                              aria-label={`Toggle ${item.label} submenu`}
                              onClick={() => setMobileOpenGroupLabel((prev) => (prev === item.label ? null : item.label))}
                            >
                              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <path d={groupOpen ? "m5 12 5-5 5 5" : "m5 7 5 5 5-5"} />
                              </svg>
                            </button>
                          </div>
                          {groupOpen ? (
                            <div className="grid gap-1 px-2 pb-3">
                              {item.children?.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={closeMobileNav}
                                  className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-[var(--ve-bg)] hover:text-[var(--ve-teal)]"
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </nav>
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/enroll"
                      onClick={closeMobileNav}
                      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--ve-teal)]/15 px-4 py-2 text-sm font-bold text-[var(--ve-teal)] hover:bg-[var(--ve-bg)]"
                    >
                      Secure enrollment links
                    </Link>
                    <Link
                      href="/contact"
                      onClick={closeMobileNav}
                      className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--ve-teal)] px-4 py-2 text-sm font-bold text-white hover:bg-[var(--ve-teal-2)]"
                    >
                      {site.primaryCta.label}
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
