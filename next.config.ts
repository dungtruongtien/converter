import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "pdfjs-dist",
    "@sparticuz/chromium",
    "puppeteer-core",
    "canvas",
  ],
};

export default nextConfig;
