import { expect, test } from "playwright/test";

test("Vital Guide stays available across pages and doesn't send questions", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", request => { if (/\/api\/(chat|lead)/.test(request.url())) requests.push(request.url()); });
  await page.goto("/");
  const button = page.getByRole("button", { name: "Open Vital Guide" });
  await expect(button).toBeVisible();
  expect(await button.evaluate(element => getComputedStyle(element).position)).toBe("fixed");
  await button.click();
  const dialog = page.getByRole("dialog", { name: "Vital Guide" });
  await expect(dialog.getByRole("button", { name: "Close Vital Guide" })).toBeFocused();
  await dialog.getByRole("button", { name: "Still working" }).click();
  await dialog.getByRole("link", { name: "Read the Working Past 65 guide" }).click();
  await expect(page).toHaveURL(/\/medicare-still-working$/);
  await expect(dialog).toBeHidden();
  await button.click();
  await expect(dialog.getByRole("heading", { name: "Still working? Start here." })).toBeVisible();
  const input = dialog.getByRole("searchbox");
  await input.fill("Does my plan cover my doctor?");
  await input.press("Enter");
  await expect(dialog.getByRole("heading", { name: "Talk to Patrick about this" })).toBeVisible();
  await expect(input).toHaveValue("");
  await expect(dialog.getByText("Does my plan cover my doctor?")).toHaveCount(0);
  await expect(dialog.getByRole("link", { name: "Request a callback" })).toHaveAttribute("href", "/contact");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(button).toBeFocused();
  expect(requests).toEqual([]);
});

test("standalone Vital Guide retains a working callback route", async ({ page }) => {
  await page.goto("/chat");
  await expect(page.getByRole("searchbox")).toBeVisible();
  await expect(page.getByRole("link", { name: "Request a callback" })).toHaveAttribute("href", "/contact");
  await expect(page.getByRole("button", { name: "Open Vital Guide" })).toHaveCount(0);
});
