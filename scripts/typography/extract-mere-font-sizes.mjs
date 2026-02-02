import { chromium } from "playwright";

const URL = "https://www.merebenefits.com/?utm_source=chatgpt.com";

async function getFontSize(page, selector) {
  const exists = await page.locator(selector).count();
  if (!exists) return null;

  return await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const cs = window.getComputedStyle(el);
    return {
      selector: sel,
      tag: el.tagName.toLowerCase(),
      text: (el.textContent || "").trim().slice(0, 80),
      fontSize: cs.fontSize,
      lineHeight: cs.lineHeight,
      fontWeight: cs.fontWeight,
    };
  }, selector);
}

const anchors = {
  heroH1: "h1",
  heroBody: "h1 + *",
  offeringsHeading: "text=Mere Offerings",
  stepsHeading: "text=3 Simple Steps",
  whyChooseHeading: "text=Why Choose Us",
  testimonialsHeading: "text=What Our Clients Are Saying",
  faqHeading: "text=Frequently Asked Questions",
  formHeading: "text=Get in Touch",
  consentText: "text=I consent to receive communications",
  solicitationDisclaimer: "text=This is a solicitation of insurance",
  govtDisclaimer: "text=not associated with, endorsed by, or authorized",
  notConnectedDisclaimer: "text=Not connected with or endorsed by the United States government",
  chatButton: "button[aria-label*='chat' i], button[aria-label*='open' i]",
};

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(URL, { waitUntil: "domcontentloaded" });

  await page.evaluate(async () => {
    const step = 900;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 150));
    }
    window.scrollTo(0, 0);
  });

  const results = {};

  for (const [key, sel] of Object.entries(anchors)) {
    if (sel.startsWith("text=")) {
      const text = sel.replace("text=", "");
      const locator = page.getByText(text, { exact: false }).first();
      const count = await locator.count();
      if (!count) {
        results[key] = null;
        continue;
      }
      results[key] = await locator.evaluate((el, label) => {
        const cs = window.getComputedStyle(el);
        return {
          selector: `text=${label}`,
          tag: el.tagName.toLowerCase(),
          text: (el.textContent || "").trim().slice(0, 80),
          fontSize: cs.fontSize,
          lineHeight: cs.lineHeight,
          fontWeight: cs.fontWeight,
        };
      }, text);
    } else {
      results[key] = await getFontSize(page, sel);
    }
  }

  console.log(JSON.stringify({ url: URL, results }, null, 2));
  await browser.close();
})();
