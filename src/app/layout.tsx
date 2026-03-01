import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import { AuthProvider } from "@/components/providers/auth-provider";
import { PostHogProvider } from "@/components/providers/posthog-provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://prepwithai.com";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "PrepWithAI — AI Mock Interviews for Developers",
    template: "%s | PrepWithAI",
  },
  description:
    "Practice technical interviews with AI feedback. Voice mode, company-specific prep for Google, Amazon, Meta, and detailed scoring. Start free.",
  keywords: [
    "AI mock interview",
    "technical interview practice",
    "coding interview prep",
    "system design interview",
    "FAANG interview preparation",
    "behavioral interview STAR method",
    "developer career platform",
    "voice interview practice",
    "company specific prep packs",
    "interview feedback AI",
    "DSA practice",
    "software engineer interview",
  ],
  authors: [
    { name: "Abdullah Tariq", url: "https://github.com/AbdullahTariq25" },
  ],
  creator: "Abdullah Tariq",
  publisher: "PrepWithAI",
  openGraph: {
    title: "PrepWithAI — AI Mock Interviews for Developers",
    description:
      "Practice technical interviews with AI feedback. Voice mode, company-specific prep, and detailed scoring. Start free.",
    type: "website",
    url: APP_URL,
    siteName: "PrepWithAI",
    locale: "en_US",
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "PrepWithAI — AI Mock Interviews for Developers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PrepWithAI — AI Mock Interviews for Developers",
    description:
      "Practice technical interviews with AI feedback. Voice mode, company-specific prep, and detailed scoring.",
    images: [`${APP_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "PrepWithAI",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  description:
    "AI-powered mock interviews for developers. Practice coding, system design, and behavioral interviews with real-time AI feedback.",
  url: APP_URL,
  author: {
    "@type": "Person",
    name: "Abdullah Tariq",
    url: "https://github.com/AbdullahTariq25",
  },
  offers: [
    {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      name: "Free",
    },
    {
      "@type": "Offer",
      price: "9",
      priceCurrency: "USD",
      name: "Pro",
      billingIncrement: "P1M",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${dmSans.variable} ${jetbrainsMono.variable} antialiased bg-[#08080C] text-white min-h-screen`}
      >
        <AuthProvider>
          <PostHogProvider>{children}</PostHogProvider>
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
