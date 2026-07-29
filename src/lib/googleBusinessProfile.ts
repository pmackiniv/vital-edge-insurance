export const GOOGLE_BUSINESS_PROFILE_REVIEW_PATH = "/review";

export const GOOGLE_BUSINESS_PROFILE_URL =
  "https://www.google.com/search?q=Vital+Edge+Insurance&stick=H4sIAAAAAAAA_-NgU1I1qEi0TDZOTUs1MzIwME4yT0uzMqgwSzE0sjA0NEpOSk5NMjEwWcQqEpZZkpij4JqSnqrgmVdcWpSYl5wKANLkHDxAAAAA&hl=en&mat=CW35JL1kTIqIElcBTVDHnqVfH-Wi1kZaybAAgEkbbguVbMIiOx3q7WK137Zlmt8PEjkzMjCVWgPbHAq2C2xH1w8p9BoEq0B1ljI2u_pt8FnNlaK60z23RCABICMr0GIQYIw&authuser=1";

function isAllowedGoogleReviewHost(hostname: string) {
  const host = hostname.toLowerCase();
  return (
    host === "g.page" ||
    host === "maps.app.goo.gl" ||
    host === "goo.gl" ||
    host === "google.com" ||
    host.endsWith(".google.com")
  );
}

export function normalizeGoogleBusinessProfileUrl(value?: string) {
  if (!value) return "";

  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:") return "";
    if (!isAllowedGoogleReviewHost(url.hostname)) return "";
    return url.toString();
  } catch {
    return "";
  }
}

export function resolveGoogleBusinessProfileDestination(
  reviewUrl?: string,
  profileUrl?: string,
) {
  return (
    normalizeGoogleBusinessProfileUrl(reviewUrl) ||
    normalizeGoogleBusinessProfileUrl(profileUrl) ||
    GOOGLE_BUSINESS_PROFILE_URL
  );
}
