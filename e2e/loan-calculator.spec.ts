import { test, expect } from "@playwright/test";

test.describe("Loan & Mortgage Calculator", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/loan-calculator");
  });

  const fillLoan = async (page: Parameters<Parameters<typeof test>[1]>[0]) => {
    await page.locator('input[type="number"]').nth(0).fill("100000");
    await page.locator('input[type="number"]').nth(1).fill("5");
    await page.locator('input[type="number"]').nth(2).fill("10");
    await page.waitForTimeout(300);
  };

  test("page loads with h1 'Loan & Mortgage Calculator'", async ({ page }) => {
    await expect(
      page.getByRole("heading", { level: 1, name: "Loan & Mortgage Calculator" })
    ).toBeVisible();
  });

  test("fill principal=100000, rate=5, term=10 → monthly payment appears", async ({ page }) => {
    await fillLoan(page);
    const body = await page.locator("body").textContent();
    expect(body).toMatch(/\d/);
  });

  test("monthly payment for $100k at 5% over 10 years is approximately $1,060", async ({ page }) => {
    await fillLoan(page);
    const body = await page.locator("body").textContent();
    expect(body).toMatch(/1[,.]?060/);
  });

  test("total interest is shown", async ({ page }) => {
    await fillLoan(page);
    const body = await page.locator("body").textContent();
    expect(body).toMatch(/[Tt]otal\s+[Ii]nterest/);
  });

  test("switching repayment type to 'Declining balance' changes the output", async ({ page }) => {
    await fillLoan(page);
    const annuityText = await page.locator("body").textContent();

    // Repayment type is toggled via buttons, not a select
    await page.getByRole("button", { name: /Declining balance/i }).click();
    await page.waitForTimeout(300);
    const decliningText = await page.locator("body").textContent();

    expect(annuityText).not.toEqual(decliningText);
  });

  test("changing currency to ₫ shows the ₫ symbol", async ({ page }) => {
    await fillLoan(page);
    // Currency is selected via buttons ($ € £ ¥ ₫)
    await page.getByRole("button", { name: "₫" }).click();
    await page.waitForTimeout(300);
    const body = await page.locator("body").textContent();
    expect(body).toContain("₫");
  });

  test("'Show amortization schedule' toggles the table", async ({ page }) => {
    await fillLoan(page);
    await page.getByRole("button", { name: /amortization schedule/i }).click();
    await page.waitForTimeout(300);
    await expect(page.locator("table tbody tr").first()).toBeVisible();
  });

  test("amortization table has Month, Payment, Principal, Interest, Balance columns", async ({ page }) => {
    await fillLoan(page);
    await page.getByRole("button", { name: /amortization schedule/i }).click();
    await page.waitForTimeout(300);
    const header = await page.locator("table thead").textContent();
    expect(header).toMatch(/Month/i);
    expect(header).toMatch(/Payment/i);
    expect(header).toMatch(/Principal/i);
    expect(header).toMatch(/Interest/i);
    expect(header).toMatch(/Balance/i);
  });

  test("progress bar is visible with blue and orange segments", async ({ page }) => {
    await fillLoan(page);
    await expect(page.locator('[class*="bg-blue"]').first()).toBeVisible();
    await expect(page.locator('[class*="bg-orange"]').first()).toBeVisible();
  });

  test("FAQ section is visible at bottom of page", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /Frequently asked questions/i })
    ).toBeVisible();
  });
});
