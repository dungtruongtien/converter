import { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://gadify.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const tools = [
    { url: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { url: "/instagram-photo-downloader", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/instagram-reel-downloader", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/facebook-video-downloader", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/twitter-video-downloader", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/pdf-to-html", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/html-to-pdf", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/pdf-toolkit", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/image-tools", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/word-counter", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/character-counter", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/case-converter", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/base64", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/url-encode", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/cron-generator", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/timestamp-converter", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/unit-converter", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/loan-calculator", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/percentage-calculator", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/spin-wheel", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/qr-code", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/random-picker", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/mindmap", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/pricing", priority: 0.7, changeFrequency: "monthly" as const },
  ];

  return tools.map(({ url, priority, changeFrequency }) => ({
    url: `${siteUrl}${url}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
