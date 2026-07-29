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
  const [clientReady, setClientReady] = useState(false);
  const closeMobileNav = () => {
    setMobileOpen(false);
    setMobileOpenGroupLabel(null);
  };
  const deferCloseMobileNav = () => {
    setTimeout(closeMobileNav, 0);
  };
  const toggleMobileNav = () => {
    if (mobileOpen) {
      closeMobileNav();
      return;
    }
    setMobileOpen(true);
  };

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setClientReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

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
                    onBlurCapture={(event) => {
                      const nextFocus = event.relatedTarget;
                      if (nextFocus instanceof Node && event.currentTarget.contains(nextFocus)) return;
                      setDesktopOpenLabel((prev) => (prev === item.label ? null : prev));
                    }}
                  >
                    <div className="inline-flex min-h-11 items-center gap-0.5">
                      {item.href ? (
                        <Link
                          href={item.href}
                          className="py-3 pr-1 text-sm font-bold text-[var(--ve-teal)] transition hover:text-[var(--ve-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--ve-teal)]/20"
                          onClick={() => setDesktopOpenLabel(null)}
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <span className="py-3 pr-1 text-sm font-bold text-[var(--ve-teal)]">{item.label}</span>
                      )}
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--ve-teal)] transition hover:bg-[var(--ve-bg)] hover:text-[var(--ve-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--ve-teal)]/20"
                        aria-expanded={isOpen}
                        aria-haspopup={hasChildren ? "menu" : undefined}
                        aria-label={`${isOpen ? "Close" : "Open"} ${item.label} menu`}
                        onClick={() => setDesktopOpenLabel((prev) => (prev === item.label ? null : item.label))}
                      >
                        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                          <path d="m5 7 5 5 5-5" />
                        </svg>
                      </button>
                    </div>
                    {isOpen && hasChildren ? (
                      <div className="absolute left-0 top-full z-[120] mt-2 min-w-[19rem] rounded-2xl border border-[var(--ve-teal)]/10 bg-white p-2 shadow-[0_24px_70px_rgba(15,23,42,0.16)]">
                        {item.children?.map((child) => (
                          <Link
                            key={`${item.label}-${child.label}-${child.href}`}
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

            <div className="hidden items-center gap-3 lg:flex">
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
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-[var(--ve-teal)]/15 bg-white/70 p-2 text-[var(--ve-teal)] shadow-sm disabled:cursor-wait disabled:opacity-60 lg:hidden"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-panel"
              aria-label="Toggle navigation"
              disabled={!clientReady}
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
              className="fixed inset-0 z-[9998] bg-black/35 lg:hidden"
              onClick={closeMobileNav}
            />
            <motion.div
              id="mobile-nav-panel"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-x-0 top-[5.35rem] z-[9999] max-h-[calc(100dvh-5.35rem)] overflow-y-auto border-b border-black/5 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] lg:hidden"
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
                            onClick={deferCloseMobileNav}
                            className="rounded-xl px-3 py-3 text-base font-bold text-[var(--ve-teal)] hover:bg-[var(--ve-bg)]"
                          >
                            {item.label}
                          </Link>
                        );
                      }

                      return (
                        <div key={item.label} className="overflow-hidden rounded-xl border border-black/10 bg-white">
                          <div className="flex min-h-14 items-stretch">
                            {item.href ? (
                              <Link
                                href={item.href}
                                onClick={deferCloseMobileNav}
                                className="flex flex-1 items-center px-3 py-3 text-base font-bold text-[var(--ve-teal)] hover:bg-[var(--ve-bg)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--ve-teal)]/25"
                              >
                                {item.label}
                              </Link>
                            ) : (
                              <span className="flex flex-1 items-center px-3 py-3 text-base font-bold text-[var(--ve-teal)]">
                                {item.label}
                              </span>
                            )}
                            <button
                              type="button"
                              className="inline-flex min-w-14 items-center justify-center border-l border-black/10 text-[var(--ve-teal)] hover:bg-[var(--ve-bg)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--ve-teal)]/25"
                              aria-expanded={groupOpen}
                              aria-controls={`mobile-nav-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                              aria-label={`${groupOpen ? "Close" : "Open"} ${item.label} menu`}
                              onClick={() => setMobileOpenGroupLabel((prev) => (prev === item.label ? null : item.label))}
                            >
                              <span
                                className="pointer-events-none inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--ve-bg)]"
                                aria-hidden="true"
                              >
                                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                                  <path d={groupOpen ? "m5 12 5-5 5 5" : "m5 7 5 5 5-5"} />
                                </svg>
                              </span>
                            </button>
                          </div>
                          {groupOpen ? (
                            <div
                              id={`mobile-nav-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                              className="grid gap-1 border-t border-black/10 px-2 py-3"
                            >
                              {item.children?.map((child) => (
                                <Link
                                  key={`${item.label}-${child.label}-${child.href}`}
                                  href={child.href}
                                  onClick={deferCloseMobileNav}
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
                      href="/contact"
                      onClick={deferCloseMobileNav}
                      className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--ve-teal)] px-4 py-2 text-sm font-bold text-white hover:bg-[var(--ve-teal-2)]"
                    >
                      {site.primaryCta.label}
                    </Link>
                    <a
                      href={`tel:${site.phoneE164}`}
                      onClick={deferCloseMobileNav}
                      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--ve-teal)]/15 px-4 py-2 text-sm font-bold text-[var(--ve-teal)] hover:bg-[var(--ve-bg)]"
                    >
                      Call {site.phoneDisplay}
                    </a>
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
