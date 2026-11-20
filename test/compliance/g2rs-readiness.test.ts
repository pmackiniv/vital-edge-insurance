import assert from "node:assert/strict";
import test from "node:test";
import {
  LOOKUP_FALLBACK_LINE,
  MANDATORY_CMS_DISCLAIMER,
  medicareNewsArticles,
  PATRICK_POSITIONING_LINE,
} from "../../src/lib/medicareNews";
import { getResourcePage, resourcePageSlugs } from "../../src/lib/resourcePages";
import { FL_DFS_VERIFY_URL, insuranceAgencyJsonLd, licensedStateNames, MEDICARE_REVIEW_BOOKING_URL, personJsonLd, site } from "../../src/lib/site";

test("single front-end brand: medicareNews positioning uses Vital Edge Insurance with FL License #G275791", () => {
  assert.equal(/medicare advocates/i.test(PATRICK_POSITIONING_LINE), false);
  assert.match(PATRICK_POSITIONING_LINE, /Vital Edge Insurance/);
  assert.match(PATRICK_POSITIONING_LINE, /NPN 21729046/);
  assert.match(PATRICK_POSITIONING_LINE, /FL License #G275791/);
});

test("entity and AEO JSON-LD carries knowsAbout, identifiers, and sameAs without ACA contamination", () => {
  const navLabels = [
    ...site.nav.map((item) => item.label),
    ...site.mainNav.map((item) => item.label),
    ...site.mainNav.flatMap((item) => (item.children ?? []).map((child) => child.label)),
  ];
  for (const label of navLabels) {
    assert.equal(/\b(aca|marketplace)\b/i.test(label), false, `Unexpected ACA nav item: ${label}`);
  }

  const agency = insuranceAgencyJsonLd();
  const person = personJsonLd();
  assert.equal(/\b(aca|marketplace)\b/i.test(agency.description), false);

  for (const entity of [agency, person]) {
    assert.equal(entity.sameAs.includes(FL_DFS_VERIFY_URL), true);
    assert.equal(entity.sameAs.includes(MEDICARE_REVIEW_BOOKING_URL), true);
    const idValues = entity.identifier.map((entry) => entry.value);
    assert.equal(idValues.includes("NPN 21729046"), true);
    assert.equal(idValues.includes("FL License #G275791"), true);

    for (const requiredTopic of [
      "Medicare Advantage",
      "Medicare Supplement / Medigap",
      "Part D Prescription Drug Plans",
      "Turning 65 Enrollment",
      "Medicare Special Enrollment Periods",
      "Hospital Indemnity",
      "Dental Vision and Hearing",
    ]) {
      assert.equal(entity.knowsAbout.includes(requiredTopic), true, `Missing knowsAbout: ${requiredTopic}`);
    }
    for (const topic of entity.knowsAbout) {
      assert.equal(/\b(aca|marketplace)\b/i.test(topic), false, `Unexpected ACA knowsAbout: ${topic}`);
    }
  }
});

test("all 5 Medicare news explainers carry 3 direct-answer AEO FAQs with zero em-dashes", () => {
  assert.equal(medicareNewsArticles.length, 5);
  for (const article of medicareNewsArticles) {
    assert.equal(article.faqs.length, 3, `${article.slug} should have 3 AEO FAQs`);
    for (const faq of article.faqs) {
      assert.equal(faq.question.includes("\u2014"), false);
      assert.equal(faq.answer.includes("\u2014"), false);
      assert.equal(faq.question.includes("\u2013"), false);
      assert.equal(faq.answer.includes("\u2013"), false);
    }
  }
});

test("all 13 licensed state hubs and The Villages hub carry unique FAQs, verbatim CMS disclaimer, and zero em-dashes", () => {
  const requiredSlugs = [
    ...licensedStateNames.map((state) => `${state.toLowerCase().replace(/\s+/g, "-")}-medicare-help`),
    "the-villages-medicare-help",
  ];

  for (const slug of requiredSlugs) {
    assert.equal(resourcePageSlugs.includes(slug), true, `Missing slug: ${slug}`);
    const page = getResourcePage(slug);
    assert.ok(page);
    assert.equal(page.faqs.length >= 4, true, `${slug} should have >= 4 FAQs`);

    const complianceBlock = page.blocks.find((b) => b.title === "Compliance note");
    assert.ok(complianceBlock);
    const combined = (complianceBlock.paragraphs ?? []).join(" ");
    assert.equal(combined.includes(MANDATORY_CMS_DISCLAIMER), true, `${slug} missing verbatim CMS disclaimer`);
    assert.equal(combined.includes(LOOKUP_FALLBACK_LINE), true, `${slug} missing Humana fallback`);

    const serialized = JSON.stringify(page);
    assert.equal(serialized.includes("\u2014"), false, `${slug} contains em-dash`);
    assert.equal(serialized.includes("\u2013"), false, `${slug} contains en-dash`);
  }
});
