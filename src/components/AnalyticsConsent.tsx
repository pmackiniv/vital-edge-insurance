"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const ANALYTICS_OPT_OUT_KEY = "ve-analytics-opt-out";

/**
 * Gates Vercel Analytics and Speed Insights.
 *
 * Model: disclosure plus opt-out, not a blocking consent banner.
 *
 * Vercel Analytics is first-party and cookieless -- it sets no cookies, does no
 * cross-site tracking, and collects no direct identifiers. Vital Edge serves US
 * consumers only (licensed in 12 states, no EU targeting), and US state privacy
 * laws require opt-out for sale/sharing and targeted advertising rather than
 * prior consent for first-party measurement. A blocking banner would also sit on
 * a lead-capture surface and cost conversions for no compliance gain.
 *
 * Two signals suppress loading:
 *   1. Global Privacy Control (`navigator.globalPrivacyControl`), which is
 *      legally recognised in California and several other states.
 *   2. An explicit opt-out stored by AnalyticsOptOutToggle on /privacy.
 *
 * If either is set, no analytics script is requested at all -- a real gate, not
 * a flag handed to a script that already loaded.
 *
 * Anything collecting personal data directly (forms, chat, SMS) is governed by
 * the consent captured at submission and recorded in LeadDisclosureAudit, not by
 * this component.
 */
export default function AnalyticsConsent() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Global Privacy Control overrides any stored preference.
    const gpc = (navigator as Navigator & { globalPrivacyControl?: boolean })
      .globalPrivacyControl;
    if (gpc === true) {
      setEnabled(false);
      return;
    }

    try {
      setEnabled(window.localStorage.getItem(ANALYTICS_OPT_OUT_KEY) !== "1");
    } catch {
      // Storage blocked. Analytics is cookieless and no preference is readable,
      // so default to measuring.
      setEnabled(true);
    }
  }, []);

  if (!enabled) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
