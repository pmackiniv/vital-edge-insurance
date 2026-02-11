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

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setDesktopOpenLabel(null);
      setMobileOpen(false);
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

            <nav className="hidden items-center gap-5 lg:flex" data-main-nav>
              {site.mainNav.map((item) => {
                const hasChildren = Array.isArray(item.children) && item.children.length > 0;
                const isOpen = desktopOpenLabel === item.label;
                if (!hasChildren && item.href) {
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="text-sm font-semibold text-black/80 transition hover:text-black"
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
                      className="inline-flex items-center gap-1 text-sm font-semibold text-black/80 transition hover:text-black"
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
                      <div className="absolute left-0 top-full z-[120] mt-3 min-w-[16rem] rounded-2xl border border-black/10 bg-white p-2 shadow-xl">
                        {item.children?.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block rounded-xl px-3 py-2 text-sm text-black/85 hover:bg-black/5 hover:text-black"
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
                  className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-blue)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[var(--brand-green)] focus:outline-none focus:ring-2 focus:ring-black/20"
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
              className="fixed inset-0 z-[90] bg-black/35 md:hidden"
              onClick={closeMobileNav}
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
                    {site.mainNav.map((item) => {
                      const hasChildren = Array.isArray(item.children) && item.children.length > 0;
                      const groupOpen = mobileOpenGroupLabel === item.label;

                      if (!hasChildren && item.href) {
                        return (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={closeMobileNav}
                            className="rounded-xl px-3 py-3 text-base font-semibold text-black hover:bg-black/5"
                          >
                            {item.label}
                          </Link>
                        );
                      }

                      return (
                        <div key={item.label} className="rounded-xl border border-black/10">
                          <button
                            type="button"
                            className="flex w-full items-center justify-between px-3 py-3 text-left text-base font-semibold text-black"
                            aria-expanded={groupOpen}
                            onClick={() => setMobileOpenGroupLabel((prev) => (prev === item.label ? null : item.label))}
                          >
                            <span>{item.label}</span>
                            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                              <path d={groupOpen ? "m5 12 5-5 5 5" : "m5 7 5 5 5-5"} />
                            </svg>
                          </button>
                          {groupOpen ? (
                            <div className="grid gap-1 px-2 pb-3">
                              {item.children?.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={closeMobileNav}
                                  className="rounded-lg px-3 py-2 text-sm text-black/80 hover:bg-black/5 hover:text-black"
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
                      onClick={closeMobileNav}
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
