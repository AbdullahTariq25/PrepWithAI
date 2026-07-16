import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import { AuthProvider } from "@/components/providers/auth-provider";
import { PostHogProvider } from "@/components/providers/posthog-provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://aiinterviewcoach-one.vercel.app";

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
    default: "PrepWithAI — Interview & Career Intelligence for Developers",
    template: "%s | PrepWithAI",
  },
  description:
    "Prepare technical and behavioral interviews, build reusable STAR stories, match your resume to real roles, track applications, retain weak concepts, and compare offers in one evidence-based career workspace.",
  keywords: [
    "AI mock interview",
    "technical interview practice",
    "coding interview prep",
    "system design interview",
    "behavioral interview STAR method",
    "behavioral story bank",
    "resume job match",
    "developer career platform",
    "job application tracker",
    "offer comparison tool",
    "salary negotiation preparation",
    "voice interview practice",
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
    title: "PrepWithAI — Interview & Career Intelligence for Developers",
    description:
      "A connected workspace for role targeting, mock interviews, evidence reports, behavioral stories, application tracking, and offer decisions.",
    type: "website",
    url: APP_URL,
    siteName: "PrepWithAI",
    locale: "en_US",
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "PrepWithAI interview and career intelligence workspace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PrepWithAI — Interview & Career Intelligence for Developers",
    description:
      "Practice interviews, inspect the evidence, organize behavioral stories, track applications, and compare offers in one connected workspace.",
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "PrepWithAI",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  description:
    "Evidence-based interview and career preparation for software professionals, including mock interviews, behavioral story development, resume matching, application tracking, spaced repetition, and offer comparison.",
  url: APP_URL,
  featureList: [
    "AI mock interviews",
    "Voice, video, coding, technical, behavioral, and system-design practice",
    "Evidence-backed interview reports",
    "Behavioral Story Bank",
    "Resume to job matching",
    "Spaced repetition flashcards",
    "Application pipeline",
    "Offer and negotiation comparison",
  ],
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
