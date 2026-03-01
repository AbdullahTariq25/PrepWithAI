// ===========================================
// PrepWithAI — Sitemap Generator
// Auto-generates sitemap for SEO
// ===========================================

import { MetadataRoute } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://prepwithai.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // Static pages
  const staticPages = [
    { url: `${APP_URL}`, lastModified: now, changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${APP_URL}/login`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${APP_URL}/signup`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${APP_URL}/pricing`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 },
  ];

  // Company pages
  const companies = [
    "google", "meta", "amazon", "apple", "microsoft",
    "netflix", "stripe", "uber", "airbnb", "spotify",
    "shopify", "twitter", "linkedin", "tiktok",
    "careem", "systems-limited", "netsol", "arbisoft",
  ];
  const companyPages = companies.map((slug) => ({
    url: `${APP_URL}/companies/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Dashboard pages (for logged-in users, still indexable)
  const dashboardPages = [
    { url: `${APP_URL}/dashboard`, lastModified: now, changeFrequency: "daily" as const, priority: 0.6 },
    { url: `${APP_URL}/interview`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${APP_URL}/questions`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${APP_URL}/companies`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${APP_URL}/leaderboard`, lastModified: now, changeFrequency: "daily" as const, priority: 0.6 },
  ];

  return [...staticPages, ...companyPages, ...dashboardPages];
}
