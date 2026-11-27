import { expect, test } from "playwright/test";
import { PLANENROLL } from "../../src/lib/externalLinks";

test("homepage keeps call, ancillary, resources and comparison paths", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Find Medicare that fits you." })).toBeVisible();
  await expect(page.getByRole("img", { name: "Vital Edge Insurance", exact: true })).toBeVisible();
  await expect(page.getByRole("img", { name: "Patrick Mackin IV", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Call Patrick", exact: true })).toHaveAttribute("href", "tel:+13522148879");
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  await expect(nav.getByRole("link", { name: "Dental, Vision & More" })).toHaveAttribute("href", "/ancillary");
  await expect(nav.getByRole("link", { name: "Resources", exact: true })).toHaveAttribute("href", "/resources");
  await expect(page.getByRole("link", { name: "Compare plans on SunFire" })).toHaveAttribute("href", PLANENROLL);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
});

test("homepage guide answers without collecting details and routes to the right appointment", async ({ page }) => {
  const guideCalls: string[] = [];
  page.on("request", (request) => {
    if (/\/api\/(chat|lead)/.test(request.url())) guideCalls.push(request.url());
  });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: /I’m turning 65 See when/ });
  await trigger.click();
  const guide = page.getByRole("dialog", { name: "Vital Guide" });
  await expect(guide.getByRole("heading", { name: "See when to sign up" })).toBeVisible();
  await expect(guide.getByRole("link", { name: "Book a 20-minute Turning 65 call" })).toHaveAttribute("href", /^https:\/\/calendly\.com\/pmackiniv27\/turning-65-medicare-phone-appointment\?.*utm_source=vital_edge_website/);
  await guide.getByText("Look up a general topic").click();
  const input = guide.getByRole("searchbox");
  await input.fill("Is my doctor in network?");
  await input.press("Enter");
  await expect(guide.getByRole("heading", { name: "Talk to Patrick about this" })).toBeVisible();
  await expect(input).toHaveValue("");
  await page.keyboard.press("Escape");
  await expect(guide).toBeHidden();
  await expect(trigger).toBeFocused();
  expect(guideCalls).toEqual([]);
});
