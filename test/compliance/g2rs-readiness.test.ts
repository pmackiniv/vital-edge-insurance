import assert from "node:assert/strict";
import test from "node:test";
import { LOOKUP_FALLBACK_LINE, MANDATORY_CMS_DISCLAIMER, PATRICK_POSITIONING_LINE } from "../../src/lib/medicareNews";
import { getResourcePage, resourcePageSlugs } from "../../src/lib/resourcePages";
import { insuranceAgencyJsonLd, personJsonLd, site } from "../../src/lib/site";

test("single front-end brand: medicareNews positioning uses Vital Edge Insurance with FL License #G275791", () => {
  assert.equal(/medicare advocates/i.test(PATRICK_POSITIONING_LINE), false);
  assert.match(PATRICK_POSITIONING_LINE, /Vital Edge Insurance/);
  assert.match(PATRICK_POSITIONING_LINE, /NPN 21729046/);
  assert.match(PATRICK_POSITIONING_LINE, /FL License #G275791/);
});

test("global navigation and JSON-LD schema are free of ACA Marketplace contamination", () => {
  const navLabels = [
    ...site.nav.map((item) => item.label),
    ...site.mainNav.map((item) => item.label),
    ...site.mainNav.flatMap((item) => (item.children ?? []).map((child) => child.label)),
  ];
  for (const label of navLabels) {
    assert.equal(/\b(aca|marketplace)\b/i.test(label), false, `Unexpected ACA nav item: ${label}`);
  }

  const agency = insuranceAgencyJsonLd();
  assert.equal(/\b(aca|marketplace)\b/i.test(agency.description), false);

  const person = personJsonLd();
  for (const topic of person.knowsAbout) {
    assert.equal(/\b(aca|marketplace)\b/i.test(topic), false, `Unexpected ACA knowsAbout: ${topic}`);
  }
});

test("The Villages Medicare help page is published with verbatim CMS disclaimer and lookup fallback", () => {
  assert.equal(resourcePageSlugs.includes("the-villages-medicare-help"), true);
  const villages = getResourcePage("the-villages-medicare-help");
  assert.ok(villages);

  const complianceBlock = villages.blocks.find((b) => b.title === "Compliance note");
  assert.ok(complianceBlock);
  const combined = (complianceBlock.paragraphs ?? []).join(" ");
  assert.equal(combined.includes(MANDATORY_CMS_DISCLAIMER), true);
  assert.equal(combined.includes(LOOKUP_FALLBACK_LINE), true);
});
