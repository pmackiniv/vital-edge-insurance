"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  CALENDLY_MEDICARE_REVIEW_URL,
  openCalendlyPopup,
  preconnectCalendly,
} from "@/lib/calendly";

/**
 * First-party scheduling button, replacing the Calendly floating badge.
 *
 * Three reasons this is owned markup rather than the vendor widget:
 *
 *   - Consent. No third-party request is made until the visitor clicks, so
 *     Calendly is not told about every page view.
 *   - Accessibility. The badge is third-party DOM that can regress without
 *     warning; a real <button> and a focus-managed dialog are testable here.
 *   - Routing. A Medicare plan review and a general question need different
 *     next steps, and the SOA belongs on the Medicare path only.
 *
 * The dialog does not block booking on the SOA. Gating the calendar behind a
 * form would cost non-Medicare enquiries and would over-collect from people who
 * only wanted to ask a question.
 */
const PANEL_ID = "ve-schedule-panel";
const TITLE_ID = "ve-schedule-title";

type Path = "choose" | "medicare";

export function ScheduleButton() {
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState<Path>("choose");
  const [bookingError, setBookingError] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setPath("choose");
    setBookingError(false);
    triggerRef.current?.focus();
  }, []);

  // Escape to close, and a simple Tab cycle so focus cannot escape the dialog
  // into the page behind it.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        close();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    // Move focus into the panel once it exists.
    const raf = requestAnimationFrame(() => {
      panelRef.current
        ?.querySelector<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])')
        ?.focus();
    });

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(raf);
    };
  }, [open, close]);

  async function book() {
    setBookingError(false);
    const ok = await openCalendlyPopup(CALENDLY_MEDICARE_REVIEW_URL);
    if (ok) {
      setOpen(false);
      setPath("choose");
    } else {
      setBookingError(true);
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        onPointerEnter={preconnectCalendly}
        onFocus={preconnectCalendly}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? PANEL_ID : undefined}
        className="fixed bottom-[5.25rem] left-3 z-[110] inline-flex items-center gap-2 rounded-full bg-[var(--ve-teal)] px-5 py-3 font-sans text-sm font-extrabold text-white shadow-[0_10px_30px_rgba(15,23,42,0.22)] transition hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--ve-gold)] sm:bottom-5 sm:left-5"
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 fill-current">
          <path d="M6 2a1 1 0 0 1 1 1v1h6V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1Zm10 6H4v8h12V8Z" />
        </svg>
        Schedule time with me
      </button>

      {open ? (
        <div className="fixed inset-0 z-[130] flex items-end justify-start p-3 sm:items-end sm:p-5">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={close}
            aria-hidden="true"
          />
          <div
            ref={panelRef}
            id={PANEL_ID}
            role="dialog"
            aria-modal="true"
            aria-labelledby={TITLE_ID}
            className="relative w-full max-w-md rounded-3xl border border-[var(--ve-teal)]/10 bg-white p-6 shadow-[0_28px_80px_rgba(15,23,42,0.28)]"
          >
            <button
              type="button"
              onClick={close}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-500 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ve-teal)]"
              aria-label="Close scheduling panel"
            >
              <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 fill-current">
                <path d="M4.3 4.3a1 1 0 0 1 1.4 0L10 8.6l4.3-4.3a1 1 0 1 1 1.4 1.4L11.4 10l4.3 4.3a1 1 0 0 1-1.4 1.4L10 11.4l-4.3 4.3a1 1 0 0 1-1.4-1.4L8.6 10 4.3 5.7a1 1 0 0 1 0-1.4Z" />
              </svg>
            </button>

            {path === "choose" ? (
              <>
                <h2 id={TITLE_ID} className="font-display text-2xl font-bold text-[var(--ve-teal)]">
                  What would you like to cover?
                </h2>
                <p className="mt-2 font-sans text-sm leading-6 text-slate-600">
                  This just points you to the right next step.
                </p>
                <div className="mt-5 space-y-3">
                  <button
                    type="button"
                    onClick={() => setPath("medicare")}
                    className="w-full rounded-2xl border border-[var(--ve-teal)]/20 p-4 text-left transition hover:bg-[var(--ve-teal)]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ve-teal)]"
                  >
                    <span className="block font-sans text-sm font-extrabold text-[var(--ve-teal)]">
                      A specific Medicare plan review
                    </span>
                    <span className="mt-1 block font-sans text-sm leading-6 text-slate-600">
                      Medicare Advantage, Part D, or supplement coverage.
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={book}
                    onPointerEnter={preconnectCalendly}
                    className="w-full rounded-2xl border border-[var(--ve-teal)]/20 p-4 text-left transition hover:bg-[var(--ve-teal)]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ve-teal)]"
                  >
                    <span className="block font-sans text-sm font-extrabold text-[var(--ve-teal)]">
                      Something else
                    </span>
                    <span className="mt-1 block font-sans text-sm leading-6 text-slate-600">
                      Ancillary coverage, small group, or a general question.
                    </span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 id={TITLE_ID} className="font-display text-2xl font-bold text-[var(--ve-teal)]">
                  One step that works in your favor
                </h2>
                <p className="mt-3 font-sans text-sm leading-6 text-slate-700">
                  Before a plan-specific Medicare appointment, you can complete a{" "}
                  <strong>Scope of Appointment</strong>. It is a short form where{" "}
                  <em>you</em> pick the topics, and once you have, those are the only
                  products I am permitted to bring up.
                </p>
                <p className="mt-3 font-sans text-sm leading-6 text-slate-700">
                  It takes about a minute, it is free, and it does not enroll you in
                  anything or obligate you in any way.
                </p>
                <div className="mt-5 space-y-3">
                  <Link
                    href="/scope-of-appointment"
                    onClick={close}
                    className="premium-small-button premium-small-button-primary w-full justify-center"
                  >
                    Set my agenda, then book
                  </Link>
                  <button
                    type="button"
                    onClick={book}
                    onPointerEnter={preconnectCalendly}
                    className="premium-small-button premium-small-button-light w-full justify-center"
                  >
                    Just book the time
                  </button>
                </div>
                <p className="mt-4 font-sans text-xs leading-5 text-slate-500">
                  Prefer to skip it? Completely fine. We will keep the conversation to
                  general Medicare education, and you can complete one later if the topic
                  turns specific.{" "}
                  <Link
                    href="/medicare-scope-of-appointment"
                    onClick={close}
                    className="font-bold text-[var(--ve-teal)] underline underline-offset-2"
                  >
                    What is a Scope of Appointment?
                  </Link>
                </p>
              </>
            )}

            {bookingError ? (
              <p role="alert" className="mt-4 rounded-xl bg-amber-50 p-3 font-sans text-sm text-amber-900">
                The booking window could not load.{" "}
                <a
                  href={CALENDLY_MEDICARE_REVIEW_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline"
                >
                  Open the calendar in a new tab
                </a>
                .
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
