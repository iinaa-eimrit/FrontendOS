import { test, expect } from "@playwright/test";

test.describe("Accessibility", () => {
  test("should have no critical accessibility violations on dashboard", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // Check for basic a11y: main landmark
    const main = page.locator("main");
    await expect(main).toBeVisible();

    // All images should have alt text
    const images = await page.locator("img").all();
    for (const img of images) {
      const alt = await img.getAttribute("alt");
      expect(alt).not.toBeNull();
    }

    // All visible buttons should have accessible names
    const buttons = await page.locator("button:visible").all();
    for (const button of buttons) {
      await expect(button).toHaveAccessibleName(/\S/);
    }
  });

  test("should support keyboard navigation", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.keyboard.press("Tab");
    const focused = page.locator(":focus");
    await expect(focused).toBeVisible();
  });
});
