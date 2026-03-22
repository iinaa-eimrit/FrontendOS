import { test, expect } from "@playwright/test";

test.describe("Shell App", () => {
  test("should load the dashboard", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveTitle(/FrontendOS/);
    await expect(page.getByRole("heading", { name: "FrontendOS" })).toBeVisible();
  });

  test("should display zone status cards", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator('[class*="grid"]').first()).toBeVisible();
  });

  test("should navigate via sidebar", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const sidebar = page.locator("aside, nav").first();
    await expect(sidebar).toBeVisible();
  });
});
