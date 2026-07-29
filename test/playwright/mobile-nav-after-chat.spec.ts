import { expect, test } from "playwright/test";

test("mobile navigation remains usable after chat open/send/close flow", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) >= 1024, "Mobile and tablet navigation only");

  await page.goto("/aca");

  await page.getByRole("button", { name: "Open 24/7 Coverage Guide" }).click();
  await expect(page.getByRole("button", { name: "Close chat", exact: true })).toBeVisible();

  await page
    .getByPlaceholder("Ask a coverage question")
    .fill("Can I enroll in a Medicare plan?");
  await page.getByRole("button", { name: /^Send$/ }).click();
  await expect(page.getByText(/licensed-agent follow-up/i)).toBeVisible();

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
  await mobilePanel.getByRole("link", { name: "ACA", exact: true }).click();

  await expect(page).toHaveURL(/\/aca$/);
});

test("desktop parent links and submenu controls have separate actions", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) < 1024, "Desktop navigation only");

  await page.goto("/");
  await page.getByRole("link", { name: "Medicare", exact: true }).click();
  await expect(page).toHaveURL(/\/medicare$/);

  await page.goto("/");
  await page.getByRole("button", { name: "Open Resources menu" }).click();
  await expect(page.getByRole("link", { name: "Resource Hub", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Resource Hub", exact: true }).click();
  await expect(page).toHaveURL(/\/resources$/);
});

test("Vital Guide conversation surface stays readable and bounded", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open 24/7 Coverage Guide" }).click();

  const dialog = page.getByRole("dialog", { name: "Vital Guide" });
  await expect(dialog).toBeVisible();
  const transcript = dialog.getByRole("log", { name: "Vital Guide conversation" });
  await expect(transcript).toBeVisible();
  await expect(transcript.getByText("Ask a coverage question.", { exact: true })).toBeVisible();

  const measurements = await transcript.evaluate((element) => {
    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return {
      color: style.color,
      backgroundColor: style.backgroundColor,
      height: rect.height,
      overflowY: style.overflowY,
    };
  });

  expect(measurements.color).not.toBe("rgba(0, 0, 0, 0)");
  expect(measurements.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
  expect(measurements.height).toBeGreaterThan(140);
  expect(measurements.overflowY).toBe("auto");
});

test("ancillary deep link lands on a real section", async ({ page }) => {
  await page.goto("/ancillary#dental-vision-hearing");
  const section = page.locator("#dental-vision-hearing");
  await expect(section).toBeVisible();
  await expect(section).toBeInViewport();
});

test("ancillary page exposes distinct UnitedHealthcare and Allstate quote paths", async ({ page }) => {
  await page.goto("/ancillary");

  const unitedHealthcareLink = page
    .getByRole("link", { name: "Quote UnitedHealthcare Options" })
    .first();
  const allstateLink = page
    .getByRole("link", { name: "Quote Allstate Health Solutions" })
    .first();

  await expect(unitedHealthcareLink).toBeVisible();
  await expect(unitedHealthcareLink).toHaveAttribute(
    "href",
    "https://shop.uhone.com/en/quote/census?brokerid=AA5620604",
  );
  await expect(allstateLink).toBeVisible();
  await expect(allstateLink).toHaveAttribute(
    "href",
    "https://customer.enroll.natgenhealth.com/quick-quote/?agent=CfDJ8FIfQXHyEOZEm91JXGawb_HZSIuV-qXpMQ3xIPcSLZtjt_k9FumEyZoGRRPlQ5KlwyIAA80toXG285u3amEHnPq1Sw&product=all-products",
  );
  await expect(unitedHealthcareLink).toHaveAttribute("target", "_blank");
  await expect(allstateLink).toHaveAttribute("target", "_blank");
});
