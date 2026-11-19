import assert from "node:assert/strict";
import test from "node:test";
import { websiteScheduleUrl } from "../../src/lib/scheduling";

test("Calendly links preserve the event and default to Eastern time with fixed website attribution", () => {
  const url = new URL(websiteScheduleUrl(" https://calendly.com/pmackiniv27/medicare-annual-review?month=2026-10 "));
  assert.equal(url.pathname, "/pmackiniv27/medicare-annual-review");
  assert.equal(url.searchParams.get("timezone"), "America/New_York");
  assert.equal(url.searchParams.get("month"), "2026-10");
  assert.equal(url.searchParams.get("utm_source"), "vital_edge_website");
  assert.equal(websiteScheduleUrl("javascript:alert(1)"), "");
  assert.equal(websiteScheduleUrl("https://calendar.example.com/meeting"), "https://calendar.example.com/meeting");
});
