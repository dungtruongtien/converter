export type PageSize = "A4" | "Letter" | "A3" | "Legal";
export type MarginPreset = "normal" | "narrow" | "none";

export interface HtmlToPdfOptions {
  pageSize: PageSize;
  margins: MarginPreset;
  landscape: boolean;
}

const MARGIN_MAP: Record<MarginPreset, { top: string; right: string; bottom: string; left: string }> = {
  normal: { top: "1in", right: "1in", bottom: "1in", left: "1in" },
  narrow: { top: "0.5in", right: "0.5in", bottom: "0.5in", left: "0.5in" },
  none: { top: "0", right: "0", bottom: "0", left: "0" },
};

export async function convertHtmlToPdf(
  html: string,
  options: HtmlToPdfOptions
): Promise<Buffer> {
  // Use @sparticuz/chromium on Lambda/Vercel OR when explicitly opted-in (e.g. Railway)
  const useSparkituz =
    !!process.env.AWS_LAMBDA_FUNCTION_NAME ||
    !!process.env.VERCEL ||
    !!process.env.USE_SPARTICUZ_CHROMIUM;

  let browser;

  if (useSparkituz) {
    const chromium = (await import("@sparticuz/chromium")).default;
    const puppeteer = await import("puppeteer-core");

    browser = await puppeteer.default.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  } else {
    // Local dev: use system Chrome
    const puppeteer = await import("puppeteer-core");
    const executablePath =
      process.env.PUPPETEER_EXECUTABLE_PATH ||
      (process.platform === "darwin"
        ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        : process.platform === "win32"
        ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
        : "/usr/bin/google-chrome");

    browser = await puppeteer.default.launch({
      executablePath,
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }

  try {
    const page = await browser.newPage();

    // Inject base URL so relative assets resolve
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3005";
    await page.setContent(html, {
      waitUntil: "load",
      timeout: 30_000,
    });

    const pdfBuffer = await page.pdf({
      format: options.pageSize,
      margin: MARGIN_MAP[options.margins],
      landscape: options.landscape,
      printBackground: true,
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}
