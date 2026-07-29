import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  GOOGLE_BUSINESS_PROFILE_REVIEW_PATH,
  GOOGLE_BUSINESS_PROFILE_URL,
  normalizeGoogleBusinessProfileUrl,
  resolveGoogleBusinessProfileDestination,
} from "../../src/lib/googleBusinessProfile";

describe("Google Business Profile review routing", () => {
  it("uses a stable first-party review path", () => {
    assert.equal(GOOGLE_BUSINESS_PROFILE_REVIEW_PATH, "/review");
  });

  it("prefers a direct Google review link when configured", () => {
    const destination = resolveGoogleBusinessProfileDestination(
      "https://g.page/r/example-review-id/review",
      "https://www.google.com/search?q=Vital+Edge+Insurance",
    );

    assert.equal(destination, "https://g.page/r/example-review-id/review");
  });

  it("rejects non-Google redirect targets", () => {
    assert.equal(normalizeGoogleBusinessProfileUrl("https://example.com/review"), "");
    assert.equal(
      resolveGoogleBusinessProfileDestination("https://example.com/review"),
      GOOGLE_BUSINESS_PROFILE_URL,
    );
  });

  it("falls back to the known profile search result", () => {
    assert.equal(resolveGoogleBusinessProfileDestination(), GOOGLE_BUSINESS_PROFILE_URL);
  });
});
