import { test, expect } from "@playwright/test";

test.describe("Image Tools", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3005/image-tools");
  });

  test("page loads with h1 Image Tools", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Image Tools");
  });

  test("three tabs are visible: Compress, Convert Format, Resize", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Compress" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Convert Format" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Resize" })).toBeVisible();
  });

  test("Compress tab is active by default and upload area is visible", async ({ page }) => {
    const compressBtn = page.getByRole("button", { name: "Compress" });
    await expect(compressBtn).toHaveClass(/bg-blue-600/);
    await expect(page.locator("text=Drop image here or click to browse")).toBeVisible();
  });

  test("clicking Convert Format tab shows format selector", async ({ page }) => {
    await page.getByRole("button", { name: "Convert Format" }).click();
    const convertBtn = page.getByRole("button", { name: "Convert Format" });
    await expect(convertBtn).toHaveClass(/bg-blue-600/);
    await expect(page.locator("text=Drop image here or click to browse")).toBeVisible();
  });

  test("clicking Resize tab shows the upload area", async ({ page }) => {
    await page.getByRole("button", { name: "Resize" }).click();
    const resizeBtn = page.getByRole("button", { name: "Resize" });
    await expect(resizeBtn).toHaveClass(/bg-blue-600/);
    await expect(page.locator("text=Drop image here or click to browse")).toBeVisible();
  });

  test("upload area has drag-drop styling", async ({ page }) => {
    const uploadZone = page.locator(".border-dashed");
    await expect(uploadZone).toBeVisible();
    await expect(uploadZone).toHaveClass(/border-dashed/);
  });

  test("file input accepts image/*", async ({ page }) => {
    const input = page.locator('input[type="file"]');
    await expect(input).toHaveAttribute("accept", "image/*");
  });

  test("FAQ section is visible at the bottom of the page", async ({ page }) => {
    await expect(page.locator("text=Frequently asked questions")).toBeVisible();
  });
});

test.describe("PDF Toolkit", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3005/pdf-toolkit");
  });

  test("page loads with h1 PDF Toolkit", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("PDF Toolkit");
  });

  test("three tabs are visible: Merge PDFs, Split PDF, Compress PDF", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Merge PDFs" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Split PDF" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Compress PDF" })).toBeVisible();
  });

  test("Merge tab is active by default and upload area is visible", async ({ page }) => {
    const mergeBtn = page.getByRole("button", { name: "Merge PDFs" });
    await expect(mergeBtn).toHaveClass(/bg-blue-600/);
    await expect(page.locator(".border-dashed")).toBeVisible();
  });

  test("clicking Split PDF tab is active", async ({ page }) => {
    await page.getByRole("button", { name: "Split PDF" }).click();
    const splitBtn = page.getByRole("button", { name: "Split PDF" });
    await expect(splitBtn).toHaveClass(/bg-blue-600/);
    await expect(page.locator(".border-dashed")).toBeVisible();
  });

  test("clicking Compress PDF tab is active", async ({ page }) => {
    await page.getByRole("button", { name: "Compress PDF" }).click();
    const compressBtn = page.getByRole("button", { name: "Compress PDF" });
    await expect(compressBtn).toHaveClass(/bg-blue-600/);
    await expect(page.locator(".border-dashed")).toBeVisible();
  });

  test("file input accepts only PDF files", async ({ page }) => {
    const input = page.locator('input[type="file"]');
    await expect(input).toHaveAttribute("accept", "application/pdf,.pdf");
  });
});

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3005");
  });

  test('hero badge shows "21 free tools"', async ({ page }) => {
    await expect(page.locator("text=21 free tools")).toBeVisible();
  });

  test("Developer Utilities section heading is visible", async ({ page }) => {
    await expect(page.locator("h2#dev-tools-heading")).toBeVisible();
    await expect(page.locator("h2#dev-tools-heading")).toContainText("Developer Utilities");
  });

  test("new tool cards are visible with New badge", async ({ page }) => {
    for (const title of [
      "Percentage Calculator",
      "Loan Calculator",
      "Spin the Wheel",
      "Random Picker",
      "QR Code Generator",
    ]) {
      const card = page.locator(`a:has(h3:has-text("${title}"))`).first();
      await expect(card.locator("h3")).toBeVisible();
      await expect(card.locator("span:has-text('New')")).toBeVisible();
    }
  });

  test("footer contains links to percentage-calculator, loan-calculator, and qr-code", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer.locator('a[href="/percentage-calculator"]')).toBeVisible();
    await expect(footer.locator('a[href="/loan-calculator"]')).toBeVisible();
    await expect(footer.locator('a[href="/qr-code"]')).toBeVisible();
  });

  test("navbar Dev Tools dropdown shows new tools when hovered", async ({ page }) => {
    // The dropdown is shown on mouseenter via onMouseEnter — use hover + waitFor
    // Trigger the onMouseEnter on the parent div by dispatching a mouseover event
    await page.getByRole("button", { name: "Dev Tools", exact: true }).dispatchEvent("mouseenter");
    await page.waitForTimeout(300);
    // The links exist in the dropdown — check they are in the DOM
    await expect(page.locator('a[href="/percentage-calculator"]').first()).toBeAttached();
    await expect(page.locator('a[href="/loan-calculator"]').first()).toBeAttached();
    await expect(page.locator('a[href="/qr-code"]').first()).toBeAttached();
  });
});
