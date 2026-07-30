"use client";

import { useEffect, useState } from "react";
import { ANALYTICS_OPT_OUT_KEY } from "./AnalyticsConsent";

/**
 * The user-facing control behind the opt-out promise in the privacy policy.
 *
 * Deliberately not a cookie banner. It lives on /privacy, where someone who
 * wants to opt out will look for it, instead of interrupting every visitor.
 *
 * Writes the same localStorage key AnalyticsConsent reads. The change takes
 * effect on the next page load, which the copy states plainly rather than
 * implying an instant effect it cannot deliver.
 */
export default function AnalyticsOptOutToggle() {
  const [optedOut, setOptedOut] = useState<boolean | null>(null);
  const [gpc, setGpc] = useState(false);

  useEffect(() => {
    const signal = (navigator as Navigator & { globalPrivacyControl?: boolean })
      .globalPrivacyControl;
    setGpc(signal === true);
    try {
      setOptedOut(window.localStorage.getItem(ANALYTICS_OPT_OUT_KEY) === "1");
    } catch {
      setOptedOut(false);
    }
  }, []);

  function update(next: boolean) {
    try {
      if (next) window.localStorage.setItem(ANALYTICS_OPT_OUT_KEY, "1");
      else window.localStorage.removeItem(ANALYTICS_OPT_OUT_KEY);
      setOptedOut(next);
    } catch {
      // Storage unavailable; leave state alone so the UI does not claim a
      // preference was saved when it was not.
    }
  }

  if (optedOut === null) return null;

  if (gpc) {
    return (
      <p className="text-sm">
        Your browser is sending a Global Privacy Control signal, so analytics are
        already switched off for you. No action needed.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm">
        {optedOut
          ? "Analytics are switched off for this browser."
          : "Analytics are currently on for this browser."}
      </p>
      <button
        type="button"
        onClick={() => update(!optedOut)}
        className="premium-small-button border border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/15"
      >
        {optedOut ? "Turn analytics back on" : "Turn analytics off"}
      </button>
      <p className="text-xs opacity-80">
        This preference is stored only in this browser and takes effect the next
        time a page loads. Clearing your browser data will reset it.
      </p>
    </div>
  );
}
