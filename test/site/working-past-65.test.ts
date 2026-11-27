import assert from "node:assert/strict";
import test from "node:test";
import { getResourcePage } from "../../src/lib/resourcePages";

test("Working Past 65 keeps the educational checklist and dedicated appointment distinct", () => {
  const page = getResourcePage("medicare-still-working");
  assert.ok(page);
  const booking = new URL(page.primaryCtaHref);
  assert.equal(booking.origin, "https://calendly.com");
  assert.equal(booking.pathname, "/pmackiniv27/turning-65-medicare-phone-appointment");
  assert.equal(booking.searchParams.get("utm_source"), "vital_edge_website");
  assert.equal(page.primaryExternal, true);
  assert.equal(page.secondaryCtaHref, "/turning-65-medicare");
  assert.equal(page.blocks[0].bullets?.length, 5);
  assert.ok(page.blocks[0].links?.some(({ href }) => href.endsWith("cms-l564-request-employment-information")));
  assert.ok(page.blocks[1].links?.some(({ href }) => href === "https://www.ssa.gov/medicare/sign-up/part-b-only"));
});
