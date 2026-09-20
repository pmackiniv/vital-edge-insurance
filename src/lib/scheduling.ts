/** Fixed, non-personal source tags distinguish website bookings in Calendly. */
export function websiteScheduleUrl(value: string): string {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:") return "";
    if (url.hostname === "calendly.com" || url.hostname === "www.calendly.com") {
      url.searchParams.set("timezone", "America/New_York");
      url.searchParams.set("utm_source", "vital_edge_website");
      url.searchParams.set("utm_medium", "referral");
      url.searchParams.set("utm_campaign", "website_booking");
    }
    return url.toString();
  } catch {
    return "";
  }
}
