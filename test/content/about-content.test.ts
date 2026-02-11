import assert from "node:assert/strict";
import path from "node:path";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { aboutFaqItems, buildAboutFaqJsonLd } from "../../src/app/about/content";

const ABOUT_PAGE_PATH = path.join(process.cwd(), "src", "app", "about", "page.tsx");
const BANNED_BRANDS_PATTERN = /MereBenefits|MereCare|Mere Benefits/i;

test("About page content has no Mere branding references", async () => {
  const source = await readFile(ABOUT_PAGE_PATH, "utf8");
  assert.equal(BANNED_BRANDS_PATTERN.test(source), false, "About page should not contain Mere branding terms");
});

test("About FAQ items are non-empty and FAQ schema count matches exported items", () => {
  assert.ok(aboutFaqItems.length > 0, "aboutFaqItems should not be empty");
  for (const item of aboutFaqItems) {
    assert.ok(item.question.trim().length > 0, "FAQ question must be non-empty");
    assert.ok(item.answer.trim().length > 0, "FAQ answer must be non-empty");
  }

  const jsonLd = buildAboutFaqJsonLd();
  const entities = Array.isArray(jsonLd.mainEntity) ? jsonLd.mainEntity : [];
  assert.equal(entities.length, aboutFaqItems.length, "FAQ schema entity count must match exported FAQ count");
});
