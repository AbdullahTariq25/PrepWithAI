import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/providers/auth-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PrepWithAI — AI Interview Coach for Developers",
  description:
    "Practice technical interviews with an AI interviewer. Get real-time feedback, track your progress, and ace your next interview at Google, Meta, Amazon & more.",
  keywords: [
    "interview prep",
    "AI interview",
    "coding interview",
    "system design",
    "mock interview",
    "software developer",
    "technical interview",
    "FAANG prep",
  ],
  authors: [{ name: "Abdullah Tariq" }],
  openGraph: {
    title: "PrepWithAI — AI Interview Coach for Developers",
    description:
      "Practice technical interviews with an AI interviewer. Get real-time feedback and ace your next interview.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
