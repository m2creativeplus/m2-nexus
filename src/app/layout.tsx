import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "M2 NEXUS — Sovereign AI Dashboard",
  description:
    "Centralized command center for M2 Creative & Consulting. Monitor systems, manage projects, and control automation agents.",
};

import ConvexClientProvider from "@/components/ConvexClientProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased bg-[var(--m2-void)] text-[var(--m2-text-primary)]`}
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
