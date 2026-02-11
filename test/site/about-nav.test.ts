import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import { site } from "../../src/lib/site";

const ABOUT_PAGE_PATH = path.join(process.cwd(), "src", "app", "about", "page.tsx");
const REQUIRED_LINKS = [
  "/about",
  "/about#mission",
  "/about#support-team",
  "/about#faq",
  "/contact",
  "/schedule",
];

function collectMainNavHrefs() {
  const hrefs = new Set<string>();
  for (const item of site.mainNav) {
    if (item.href) hrefs.add(item.href);
    for (const child of item.children ?? []) {
      hrefs.add(child.href);
    }
  }
  return hrefs;
}

test("About navigation includes required links in nav model and page quick-links", async () => {
  const hrefs = collectMainNavHrefs();
  assert.ok(hrefs.has("/about"), "site.mainNav should include /about");
  assert.ok(hrefs.has("/contact"), "site.mainNav should include /contact");
  assert.ok(hrefs.has("/schedule"), "site.mainNav should include /schedule");

  const source = await readFile(ABOUT_PAGE_PATH, "utf8");
  for (const href of REQUIRED_LINKS) {
    assert.match(source, new RegExp(`href=["']${href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`));
  }
});
