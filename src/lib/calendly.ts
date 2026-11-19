/**
 * On-demand Calendly loader.
 *
 * Nothing from assets.calendly.com is requested until the visitor asks to book.
 * That is the consent boundary: a third party learns about the visit only after
 * a deliberate click, not on every page view. It is also why the site carries no
 * always-on booking widget any more.
 *
 * The loader assets are small (~5 KB gzipped combined) but Calendly serves them
 * with `max-age=300`, so a persistent widget re-handshakes with a third-party
 * origin on essentially every visit. Deferring to click removes that entirely
 * for the large majority of visitors who never book.
 */
import { MEDICARE_REVIEW_BOOKING_URL } from "@/lib/site";

const WIDGET_JS = "https://assets.calendly.com/assets/external/widget.js";
const WIDGET_CSS = "https://assets.calendly.com/assets/external/widget.css";
const ORIGIN = "https://assets.calendly.com";

export const CALENDLY_MEDICARE_REVIEW_URL = MEDICARE_REVIEW_BOOKING_URL;

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (opts: { url: string }) => void;
      closePopupWidget?: () => void;
    };
  }
}

let loadPromise: Promise<void> | null = null;
let preconnected = false;

/**
 * Warm the connection on hover/focus intent. Cheap, idempotent, and it removes
 * the DNS + TLS round trip from the moment the visitor actually clicks. Doing it
 * on intent rather than on page load keeps the third-party contact tied to a
 * user action.
 */
export function preconnectCalendly(): void {
  if (preconnected || typeof document === "undefined") return;
  preconnected = true;
  for (const rel of ["preconnect", "dns-prefetch"]) {
    const link = document.createElement("link");
    link.rel = rel;
    link.href = ORIGIN;
    if (rel === "preconnect") link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  }
}

function loadStylesheet(): void {
  if (document.querySelector(`link[href="${WIDGET_CSS}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = WIDGET_CSS;
  document.head.appendChild(link);
}

function loadScript(): Promise<void> {
  if (window.Calendly) return Promise.resolve();

  const existing = document.querySelector<HTMLScriptElement>(`script[src="${WIDGET_JS}"]`);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("calendly_script_error")), { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = WIDGET_JS;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("calendly_script_error"));
    document.head.appendChild(script);
  });
}

export function loadCalendly(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (!loadPromise) {
    loadPromise = (async () => {
      loadStylesheet();
      await loadScript();
    })().catch((error) => {
      // Allow a later retry rather than caching the failure forever.
      loadPromise = null;
      throw error;
    });
  }
  return loadPromise;
}

/**
 * Open the Calendly popup. Resolves false when the third party could not be
 * reached, so the caller can fall back to a real link instead of leaving the
 * visitor with a dead button.
 */
export async function openCalendlyPopup(url: string): Promise<boolean> {
  try {
    await loadCalendly();
    if (!window.Calendly) return false;
    window.Calendly.initPopupWidget({ url });
    return true;
  } catch {
    return false;
  }
}
