import { test, expect } from "@playwright/test";

test.describe("Percentage Calculator", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/percentage-calculator");
  });

  test("page loads with correct h1", async ({ page }) => {
    await expect(
      page.getByRole("heading", { level: 1, name: "Percentage Calculator" })
    ).toBeVisible();
  });

  test("default mode is '% of a number' with inputs visible", async ({ page }) => {
    await expect(page.locator('input[type="number"]').nth(0)).toBeVisible();
    await expect(page.locator('input[type="number"]').nth(1)).toBeVisible();
  });

  test.describe("% of a number", () => {
    test("15% of 200 = 30", async ({ page }) => {
      await page.getByRole("button", { name: /% of a number/i }).click();
      await page.locator('input[type="number"]').nth(0).fill("15");
      await page.locator('input[type="number"]').nth(1).fill("200");
      await expect(page.locator(".bg-green-50")).toContainText("30");
    });
  });

  test.describe("What % is X of Y?", () => {
    test("25 is 31.25% of 80", async ({ page }) => {
      await page.getByRole("button", { name: /What % is X of Y?/i }).click();
      await page.locator('input[type="number"]').nth(0).fill("25");
      await page.locator('input[type="number"]').nth(1).fill("80");
      await expect(page.locator(".bg-green-50")).toContainText("31.25%");
    });
  });

  test.describe("% change", () => {
    test("100 to 150 shows 50% increase", async ({ page }) => {
      await page.getByRole("button", { name: /% change/i }).click();
      await page.locator('input[type="number"]').nth(0).fill("100");
      await page.locator('input[type="number"]').nth(1).fill("150");
      await expect(page.locator(".bg-green-50")).toContainText("50%");
      await expect(page.locator(".bg-green-50")).toContainText("increase");
    });

    test("100 to 50 shows 50% decrease", async ({ page }) => {
      await page.getByRole("button", { name: /% change/i }).click();
      await page.locator('input[type="number"]').nth(0).fill("100");
      await page.locator('input[type="number"]').nth(1).fill("50");
      await expect(page.locator(".bg-green-50")).toContainText("50%");
      await expect(page.locator(".bg-green-50")).toContainText("decrease");
    });
  });

  test.describe("Add %", () => {
    test("100 + 20% = 120", async ({ page }) => {
      await page.getByRole("button", { name: /Add %/i }).click();
      await page.locator('input[type="number"]').nth(0).fill("100");
      await page.locator('input[type="number"]').nth(1).fill("20");
      await expect(page.locator(".bg-green-50")).toContainText("120");
    });
  });

  test.describe("Subtract %", () => {
    test("100 - 20% = 80", async ({ page }) => {
      await page.getByRole("button", { name: /Subtract %/i }).click();
      await page.locator('input[type="number"]').nth(0).fill("100");
      await page.locator('input[type="number"]').nth(1).fill("20");
      await expect(page.locator(".bg-green-50")).toContainText("80");
    });
  });

  test("empty inputs show placeholder text in gray box", async ({ page }) => {
    // Empty state is shown in bg-gray-50, not bg-green-50
    await expect(page.locator(".bg-gray-50").first()).toContainText("Enter values above to see the result");
  });

  test("result box shows explanation text alongside the number", async ({ page }) => {
    await page.getByRole("button", { name: /% of a number/i }).click();
    await page.locator('input[type="number"]').nth(0).fill("15");
    await page.locator('input[type="number"]').nth(1).fill("200");
    const result = page.locator(".bg-green-50");
    await expect(result).toContainText("30");
    const text = await result.textContent();
    // Explanation text like "15% of 200 = 30" should also be present
    expect(text && text.length > 5).toBeTruthy();
  });

  test("FAQ section is visible at bottom of page", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /Frequently asked questions/i })
    ).toBeVisible();
  });
});
