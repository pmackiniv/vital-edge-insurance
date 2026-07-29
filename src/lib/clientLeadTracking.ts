export type ClientLeadTrackingFlags = {
  linkedinReferral?: boolean;
  eventReferral?: boolean;
  partnerReferral?: boolean;
};

export function buildClientLeadTracking(pageSource: string, leadCategory: string, flags: ClientLeadTrackingFlags = {}) {
  if (typeof window === "undefined") {
    return {
      leadSource: "Website",
      pageSource,
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
      linkedinReferral: flags.linkedinReferral === true,
      eventReferral: flags.eventReferral === true,
      partnerReferral: flags.partnerReferral === true,
      leadCategory,
      consentTimestamp: new Date().toISOString(),
    };
  }

  const params = new URLSearchParams(window.location.search);
  const source = params.get("source") || "";
  const utmSource = params.get("utm_source") || "";
  const referrer = document.referrer || "";
  const linkedinReferral = flags.linkedinReferral === true || /linkedin/i.test([source, utmSource, referrer, pageSource].join(" "));

  return {
    leadSource: source || utmSource || "Website",
    pageSource,
    utmSource,
    utmMedium: params.get("utm_medium") || "",
    utmCampaign: params.get("utm_campaign") || "",
    linkedinReferral,
    eventReferral: flags.eventReferral === true || params.get("event") === "1",
    partnerReferral: flags.partnerReferral === true || params.get("partner") === "1",
    leadCategory,
    consentTimestamp: new Date().toISOString(),
  };
}
