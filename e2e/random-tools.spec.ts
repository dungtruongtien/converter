import { test, expect } from "@playwright/test";

test.describe("Spin the Wheel", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/spin-wheel");
  });

  test("page loads with h1 Spin the Wheel", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1, name: /spin the wheel/i })).toBeVisible();
  });

  test("SVG wheel is visible", async ({ page }) => {
    // The wheel is an SVG with colored slice paths
    await expect(page.locator("svg").first()).toBeVisible();
  });

  test("default items are shown on the wheel", async ({ page }) => {
    // Items are also listed in the edit panel textarea
    await page.getByRole("button", { name: /Edit options/i }).click();
    const textarea = page.locator("textarea");
    await expect(textarea).toBeVisible();
    const content = await textarea.inputValue();
    expect(content).toMatch(/Option [1-6]/);
    // Close the panel
    await page.getByRole("button", { name: /Cancel/i }).click();
  });

  test("SPIN button is visible and enabled", async ({ page }) => {
    const spinBtn = page.getByRole("button", { name: /^Spin!$/i });
    await expect(spinBtn).toBeVisible();
    await expect(spinBtn).toBeEnabled();
  });

  test("clicking SPIN shows winner banner", async ({ page }) => {
    await page.getByRole("button", { name: /^Spin!$/i }).click();
    const winner = page.locator(".bg-indigo-50.border-indigo-200");
    await winner.waitFor({ timeout: 8000 });
    await expect(winner).toBeVisible();
  });

  test("winner banner contains 'Winner!' and one of the option names", async ({ page }) => {
    await page.getByRole("button", { name: /^Spin!$/i }).click();
    const winner = page.locator(".bg-indigo-50.border-indigo-200");
    await winner.waitFor({ timeout: 8000 });
    const text = await winner.textContent();
    expect(text).toMatch(/Winner!/);
    expect(text).toMatch(/Option [1-6]/);
  });

  test("editing options to 2 items and spinning shows one of those items", async ({ page }) => {
    await page.getByRole("button", { name: /Edit options/i }).click();
    const textarea = page.locator("textarea");
    await textarea.fill("Yes\nNo");
    await page.getByRole("button", { name: /^Apply$/i }).click();
    await page.getByRole("button", { name: /^Spin!$/i }).click();
    const winner = page.locator(".bg-indigo-50.border-indigo-200");
    await winner.waitFor({ timeout: 8000 });
    const text = await winner.textContent();
    expect(text).toMatch(/Yes|No/);
  });

  test("fewer than 2 items shows error and disables Apply", async ({ page }) => {
    await page.getByRole("button", { name: /Edit options/i }).click();
    const textarea = page.locator("textarea");
    await textarea.fill("OnlyOne");
    await expect(page.locator("text=Enter at least 2 options")).toBeVisible();
    await expect(page.getByRole("button", { name: /^Apply$/i })).toBeDisabled();
  });
});

test.describe("Random Picker", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/random-picker");
  });

  test("page loads with h1 Random Picker", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1, name: /random picker/i })).toBeVisible();
  });

  test("default mode From List is active", async ({ page }) => {
    const fromListBtn = page.getByRole("button", { name: /from list/i });
    await expect(fromListBtn).toHaveClass(/bg-indigo-600/);
  });

  test("From List: pick returns one of the default items", async ({ page }) => {
    await expect(page.locator("textarea")).toBeVisible();
    await page.getByRole("button", { name: /^Pick!$/ }).click();
    const result = page.locator(".bg-indigo-50.border-indigo-200");
    await result.waitFor({ timeout: 4000 });
    const text = await result.textContent();
    expect(text).toMatch(/Alice|Bob|Charlie|Diana|Eve/);
  });

  test("Numbers: generate returns a number in range 1–10", async ({ page }) => {
    await page.getByRole("button", { name: /Numbers/i }).click();
    const inputs = page.locator('input[type="number"]');
    await inputs.nth(0).fill("1");
    await inputs.nth(1).fill("10");
    await page.getByRole("button", { name: /^Pick!$/ }).click();
    const result = page.locator(".bg-indigo-50.border-indigo-200");
    await result.waitFor({ timeout: 4000 });
    const text = (await result.textContent()) ?? "";
    const num = parseInt(text.replace(/\D+/g, ""));
    expect(num).toBeGreaterThanOrEqual(1);
    expect(num).toBeLessThanOrEqual(10);
  });

  test("Coin Flip: result shows Heads or Tails", async ({ page }) => {
    await page.getByRole("button", { name: /Coin Flip/i }).click();
    await page.getByRole("button", { name: /^Flip!$/ }).click();
    // Coin result uses bg-yellow-50 or bg-gray-50, not bg-indigo-50
    const result = page.locator(".text-2xl.font-bold");
    await result.waitFor({ timeout: 4000 });
    const text = await result.textContent();
    expect(text).toMatch(/Heads|Tails/);
  });

  test("Dice Roll: result contains a dice emoji", async ({ page }) => {
    await page.getByRole("button", { name: /Dice Roll/i }).click();
    await page.getByRole("button", { name: /^Roll!$/ }).click();
    const result = page.locator(".bg-indigo-50.border-indigo-200");
    await result.waitFor({ timeout: 4000 });
    const text = (await result.textContent()) ?? "";
    expect(text).toMatch(/[⚀⚁⚂⚃⚄⚅]/);
  });

  test("Card Draw: result contains a suit symbol", async ({ page }) => {
    await page.getByRole("button", { name: /Card Draw/i }).click();
    await page.getByRole("button", { name: /Draw!/i }).click();
    // Cards render in .bg-indigo-50 result area (card mode)
    const result = page.locator(".bg-indigo-50.border-indigo-200");
    await result.waitFor({ timeout: 4000 });
    const text = (await result.textContent()) ?? "";
    expect(text).toMatch(/[♠♥♦♣]/);
  });

  test("history section appears after picks", async ({ page }) => {
    await page.getByRole("button", { name: /^Pick!$/ }).click();
    await page.waitForTimeout(200);
    await page.getByRole("button", { name: /^Pick!$/ }).click();
    await page.locator("text=Recent picks").waitFor({ timeout: 4000 });
    await expect(page.locator("text=Recent picks")).toBeVisible();
  });
});
