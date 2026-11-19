"use client";

import { useEffect } from "react";
import { captureLandingAttribution } from "@/lib/clientLeadTracking";

/**
 * Records how the visitor arrived, once, on the first page load.
 *
 * Lives in the root layout so it mounts before any client-side navigation and
 * does not re-run afterwards. That is what makes first-touch attribution hold:
 * by the time the visitor reaches a form, the landing query string is long gone
 * from the URL but still recorded for the session.
 *
 * Renders nothing.
 */
export default function AttributionCapture() {
  useEffect(() => {
    captureLandingAttribution();
  }, []);

  return null;
}
