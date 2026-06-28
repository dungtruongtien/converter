import { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://gadify.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
