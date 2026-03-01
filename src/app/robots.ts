// ===========================================
// PrepWithAI — Robots.txt Generator
// Controls search engine crawling
// ===========================================

import { MetadataRoute } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://prepwithai.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/interview/*/report",
          "/settings/",
          "/onboarding/",
        ],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
