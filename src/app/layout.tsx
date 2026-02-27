import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import { AuthProvider } from "@/components/providers/auth-provider";
import "./globals.css";

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
  title: "PrepWithAI - The Complete Developer Career Platform",
  description:
    "From your first line of code to your first 200K job offer. AI-powered interview prep with real-time feedback, ELO ratings, company prep packs, code execution and more.",
  keywords: [
    "interview prep",
    "AI interview",
    "coding interview",
    "system design",
    "mock interview",
    "FAANG prep",
    "developer career",
    "ELO rating",
    "technical interview",
    "code execution",
    "company prep packs",
  ],
  authors: [{ name: "Abdullah Tariq" }],
  openGraph: {
    title: "PrepWithAI - The Complete Developer Career Platform",
    description:
      "AI-powered interview prep with real-time feedback, ELO ratings, company prep packs, and more.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${jetbrainsMono.variable} antialiased bg-[#080808] text-[#F5F5F5] min-h-screen`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
