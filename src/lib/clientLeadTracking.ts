export type ClientLeadTrackingFlags = {
  linkedinReferral?: boolean;
  eventReferral?: boolean;
  partnerReferral?: boolean;
};

/**
 * Where the visitor came from, captured on arrival rather than at submit time.
 *
 * The query string only exists on the landing page. Someone who arrives on
 * /medicare-101?utm_source=linkedin and then clicks through to /contact before
 * filling anything in has already lost those parameters by the time the form
 * posts -- and that is the normal path, since the entry page is rarely the form
 * page. Reading window.location at submit therefore recorded blank attribution
 * for nearly every tagged visit, which made link tagging pointless.
 *
 * First touch wins. The first arrival in the session carrying any signal is
 * kept and later navigation never overwrites it, so the recorded answer is
 * "what introduced this person to Vital Edge" rather than "which page they
 * happened to be on when they filled in the form".
 *
 * sessionStorage rather than a cookie: first-party, no identifiers, discarded
 * when the tab closes. This is the same data the form already sent -- persisting
 * it only makes it accurate. Consent for the submission itself is captured at
 * the form and recorded in LeadDisclosureAudit.
 */
const ATTRIBUTION_KEY = "ve-lead-attribution";

type LandingAttribution = {
  source: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  referrer: string;
  event: boolean;
  partner: boolean;
};

const EMPTY_ATTRIBUTION: LandingAttribution = {
  source: "",
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  referrer: "",
  event: false,
  partner: false,
};

function readLandingAttribution(): LandingAttribution {
  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get("source") || "",
    utmSource: params.get("utm_source") || "",
    utmMedium: params.get("utm_medium") || "",
    utmCampaign: params.get("utm_campaign") || "",
    referrer: document.referrer || "",
    event: params.get("event") === "1",
    partner: params.get("partner") === "1",
  };
}

function hasSignal(attribution: LandingAttribution) {
  return Boolean(
    attribution.source ||
      attribution.utmSource ||
      attribution.utmMedium ||
      attribution.utmCampaign ||
      attribution.referrer ||
      attribution.event ||
      attribution.partner,
  );
}

function storedAttribution(): LandingAttribution | null {
  try {
    const raw = window.sessionStorage.getItem(ATTRIBUTION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<LandingAttribution>;
    return { ...EMPTY_ATTRIBUTION, ...parsed };
  } catch {
    // Unreadable or malformed. Treated as absent so the caller falls back to
    // the live URL rather than throwing inside a form submit handler.
    return null;
  }
}

/**
 * Records the landing attribution once per session. Mounted in the root layout
 * via AttributionCapture, so it runs on the first page load and not again on
 * client-side navigation -- which is what keeps first touch first.
 *
 * A visit with no signal at all (direct, no referrer, no parameters) stores
 * nothing, leaving a later signal-bearing arrival free to be the first touch.
 */
export function captureLandingAttribution() {
  if (typeof window === "undefined") return;

  const landing = readLandingAttribution();
  if (!hasSignal(landing)) return;

  try {
    if (window.sessionStorage.getItem(ATTRIBUTION_KEY)) return;
    window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(landing));
  } catch {
    // Storage blocked (private mode, hardened settings). buildClientLeadTracking
    // falls back to the live URL, which is exactly the previous behaviour --
    // degraded, never broken, and never throwing.
  }
}

export function buildClientLeadTracking(pageSource: string, leadCategory: string, flags: ClientLeadTrackingFlags = {}) {
  const base = {
    pageSource,
    leadCategory,
    consentTimestamp: new Date().toISOString(),
  };

  if (typeof window === "undefined") {
    return {
      ...base,
      leadSource: "Website",
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
      linkedinReferral: flags.linkedinReferral === true,
      eventReferral: flags.eventReferral === true,
      partnerReferral: flags.partnerReferral === true,
    };
  }

  // Prefer what was captured on arrival; fall back to the live URL so a blocked
  // sessionStorage still behaves the way this function always has.
  const attribution = storedAttribution() ?? readLandingAttribution();

  return {
    ...base,
    leadSource: attribution.source || attribution.utmSource || "Website",
    utmSource: attribution.utmSource,
    utmMedium: attribution.utmMedium,
    utmCampaign: attribution.utmCampaign,
    linkedinReferral:
      flags.linkedinReferral === true ||
      /linkedin/i.test([attribution.source, attribution.utmSource, attribution.referrer, pageSource].join(" ")),
    eventReferral: flags.eventReferral === true || attribution.event,
    partnerReferral: flags.partnerReferral === true || attribution.partner,
  };
}
