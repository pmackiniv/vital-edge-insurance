import { expect, test } from "playwright/test";

test("mobile navigation remains usable after chat open/send/close flow", async ({ page }) => {
  await page.goto("/aca");

  await page.getByRole("button", { name: /chat with a licensed agent now/i }).click();
  await expect(page.getByRole("button", { name: "Close chat", exact: true })).toBeVisible();

  await page
    .getByPlaceholder("e.g. What is Part D? How do I speak to a licensed agent?")
    .fill("Can I review enrollment timing?");
  await page.getByRole("button", { name: /^Send$/ }).click();

  await page.getByRole("button", { name: "Close chat", exact: true }).click();
  await expect(page.getByRole("button", { name: "Close chat", exact: true })).toBeHidden();
  await expect
    .poll(() => page.evaluate(() => document.body.dataset.chatWidgetOpen || ""))
    .toBe("");

  await page.getByLabel("Vital Edge Insurance home").click();
  await expect(page).toHaveURL(/\/$/);

  await page.getByRole("button", { name: /toggle navigation/i }).click();
  const mobilePanel = page.locator("#mobile-nav-panel");
  await expect(mobilePanel).toBeVisible();
  await mobilePanel.getByRole("link", { name: "Health Insurance" }).click();

  await expect(page).toHaveURL(/\/aca$/);
});
