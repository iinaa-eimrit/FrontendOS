import { test, expect } from "@playwright/test";

test.describe("Shell App", () => {
  test("should load the dashboard", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/FrontendOS/);
    await expect(page.locator("text=FrontendOS Dashboard")).toBeVisible();
  });

  test("should display zone status cards", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('[class*="grid"]').first()).toBeVisible();
  });

  test("should navigate via sidebar", async ({ page }) => {
    await page.goto("/");
    const sidebar = page.locator("aside, nav").first();
    await expect(sidebar).toBeVisible();
  });
});
