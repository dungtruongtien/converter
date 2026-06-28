import { test, expect } from "@playwright/test";

const QR_IMG = 'img[alt="QR Code"]';
const QR_TIMEOUT = 6000;

test.describe("QR Code Generator", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/qr-code");
  });

  test("page loads with type selector buttons visible", async ({ page }) => {
    // Buttons contain emoji + label + desc nested divs, so use partial text match
    await expect(page.getByRole("button", { name: /URL \/ Link/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Plain Text/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Wi-Fi/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Contact/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Email/i }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /SMS/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Phone/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Payment \/ VietQR/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Calendar Event/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Geo Location/i })).toBeVisible();
  });

  test.describe("URL type", () => {
    test("fill URL and QR generates", async ({ page }) => {
      const urlInput = page.locator('input[placeholder="https://example.com"]');
      await urlInput.fill("https://gadify.app");
      await page.waitForSelector(QR_IMG, { timeout: QR_TIMEOUT });
      await expect(page.locator(QR_IMG)).toBeVisible();
    });
  });

  test.describe("Plain Text type", () => {
    test("switch to Plain Text, fill text, QR generates", async ({ page }) => {
      await page.getByRole("button", { name: "Plain Text" }).click();
      await page.locator("textarea").first().fill("Hello, Gadify!");
      await page.waitForSelector(QR_IMG, { timeout: QR_TIMEOUT });
      await expect(page.locator(QR_IMG)).toBeVisible();
    });
  });

  test.describe("Wi-Fi type", () => {
    test("fill SSID + password and QR generates", async ({ page }) => {
      await page.getByRole("button", { name: "Wi-Fi" }).click();
      await page.locator('input[placeholder="MyWiFiNetwork"]').fill("HomeNetwork");
      await page.locator('input[placeholder="••••••••"]').fill("secret123");
      await page.waitForSelector(QR_IMG, { timeout: QR_TIMEOUT });
      await expect(page.locator(QR_IMG)).toBeVisible();
    });

    test("eye icon toggles password visibility", async ({ page }) => {
      await page.getByRole("button", { name: "Wi-Fi" }).click();
      const passwordInput = page.locator('input[placeholder="••••••••"]');
      await passwordInput.fill("secret123");

      await expect(passwordInput).toHaveAttribute("type", "password");

      await page.getByRole("button", { name: "Show password" }).click();
      await expect(passwordInput).toHaveAttribute("type", "text");

      await page.getByRole("button", { name: "Hide password" }).click();
      await expect(passwordInput).toHaveAttribute("type", "password");
    });
  });

  test.describe("Contact (vCard) type", () => {
    test("fill name, phone, email and QR generates", async ({ page }) => {
      await page.getByRole("button", { name: /Contact/i }).click();
      await page.locator('input[placeholder="Jane Smith"]').fill("John Doe");
      await page.locator('input[placeholder="+84 123 456 789"]').first().fill("+1234567890");
      await page.locator('input[placeholder="jane@example.com"]').fill("john@example.com");
      await page.waitForSelector(QR_IMG, { timeout: QR_TIMEOUT });
      await expect(page.locator(QR_IMG)).toBeVisible();
    });
  });

  test.describe("Email type", () => {
    test("fill To and Subject and QR generates", async ({ page }) => {
      await page.getByRole("button", { name: /Email/i }).click();
      await page.locator('input[placeholder="hello@example.com"]').fill("test@example.com");
      await page.locator('input[placeholder="Hello!"]').fill("Test subject");
      await page.waitForSelector(QR_IMG, { timeout: QR_TIMEOUT });
      await expect(page.locator(QR_IMG)).toBeVisible();
    });
  });

  test.describe("SMS type", () => {
    test("fill phone and message and QR generates", async ({ page }) => {
      await page.getByRole("button", { name: /SMS/i }).click();
      await page.locator('input[placeholder="+84 123 456 789"]').fill("+1234567890");
      await page.locator("textarea").first().fill("Hello via SMS");
      await page.waitForSelector(QR_IMG, { timeout: QR_TIMEOUT });
      await expect(page.locator(QR_IMG)).toBeVisible();
    });
  });

  test.describe("Phone type", () => {
    test("fill phone number and QR generates", async ({ page }) => {
      await page.getByRole("button", { name: /Phone/i }).click();
      await page.locator('input[placeholder="+84 123 456 789"]').fill("+1234567890");
      await page.waitForSelector(QR_IMG, { timeout: QR_TIMEOUT });
      await expect(page.locator(QR_IMG)).toBeVisible();
    });
  });

  test.describe("Payment / VietQR type", () => {
    test("fill bank BIN, account number, name and QR generates", async ({ page }) => {
      await page.getByRole("button", { name: /Payment \/ VietQR/i }).click();
      await page.locator('input[placeholder="970436 (Vietcombank)"]').fill("970415");
      await page.locator('input[placeholder="0123456789"]').fill("1234567890");
      await page.locator('input[placeholder="NGUYEN VAN A"]').fill("NGUYEN VAN A");
      await page.waitForSelector(QR_IMG, { timeout: QR_TIMEOUT });
      await expect(page.locator(QR_IMG)).toBeVisible();
    });
  });

  test.describe("Calendar Event type", () => {
    test("fill title and start/end datetime and QR generates", async ({ page }) => {
      await page.getByRole("button", { name: /Calendar Event/i }).click();
      await page.locator('input[placeholder="Team Meeting"]').fill("Standup");
      await page.locator('input[type="datetime-local"]').nth(0).fill("2026-07-01T09:00");
      await page.locator('input[type="datetime-local"]').nth(1).fill("2026-07-01T10:00");
      await page.waitForSelector(QR_IMG, { timeout: QR_TIMEOUT });
      await expect(page.locator(QR_IMG)).toBeVisible();
    });
  });

  test.describe("Geo Location type", () => {
    test("fill lat/lng and QR generates", async ({ page }) => {
      await page.getByRole("button", { name: /Geo Location/i }).click();
      await page.locator('input[placeholder="21.0278"]').fill("10.7769");
      await page.locator('input[placeholder="105.8342"]').fill("106.7009");
      await page.waitForSelector(QR_IMG, { timeout: QR_TIMEOUT });
      await expect(page.locator(QR_IMG)).toBeVisible();
    });
  });

  test.describe("Error correction level", () => {
    test("clicking Q applies active styling", async ({ page }) => {
      await page.locator('input[placeholder="https://example.com"]').fill("https://gadify.app");
      await page.waitForSelector(QR_IMG, { timeout: QR_TIMEOUT });
      const qButton = page.getByRole("button", { name: /^Q$/ });
      await qButton.click();
      await expect(qButton).toHaveClass(/bg-indigo-600/);
    });
  });

  test.describe("Download button", () => {
    test("appears after QR is generated", async ({ page }) => {
      await page.locator('input[placeholder="https://example.com"]').fill("https://gadify.app");
      await page.waitForSelector(QR_IMG, { timeout: QR_TIMEOUT });
      await expect(page.getByRole("button", { name: /Download PNG/i })).toBeVisible();
    });
  });

  test.describe("Type switching", () => {
    test("switching from Wi-Fi to Email hides password field and shows email field", async ({ page }) => {
      await page.getByRole("button", { name: "Wi-Fi" }).click();
      await expect(page.locator('input[placeholder="••••••••"]')).toBeVisible();

      await page.getByRole("button", { name: /Email/i }).click();
      await expect(page.locator('input[placeholder="••••••••"]')).toHaveCount(0);
      await expect(page.locator('input[placeholder="hello@example.com"]')).toBeVisible();
    });

    test("switching to Plain Text shows textarea", async ({ page }) => {
      await page.getByRole("button", { name: "Plain Text" }).click();
      await expect(page.locator("textarea").first()).toBeVisible();
    });
  });
});
