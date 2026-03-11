import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/ConvexClientProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: '--font-outfit'
});

export const metadata: Metadata = {
  metadataBase: new URL("https://m2-nexus.vercel.app"),
  title: {
    default: "M2 NEXUS — Strategic Command Center",
    template: "%s | M2 NEXUS",
  },
  description:
    "M2 NEXUS is the sovereign operations dashboard for M2 Creative & Consulting — AI-powered strategy, automation, and digital governance for Somaliland and East Africa.",
  keywords: [
    "M2 Creative",
    "M2 NEXUS",
    "GovTech Somaliland",
    "digital transformation East Africa",
    "AI Dashboard",
    "strategic automation",
  ],
  authors: [{ name: "Mahmoud Awaleh", url: "https://github.com/mahmoudawaleh" }],
  creator: "M2 Creative & Consulting",
  openGraph: {
    title: "M2 NEXUS — Strategic Command Center",
    description: "Sovereign AI-powered operations dashboard by M2 Creative.",
    url: "https://m2-nexus.vercel.app",
    siteName: "M2 NEXUS",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "M2 NEXUS — Strategic Command Center",
    description: "Sovereign AI-powered operations dashboard by M2 Creative.",
    creator: "@m2creativeplus",
  },
  robots: {
    index: false,
    follow: false,
  },
};

import DashboardLayout from "@/components/DashboardLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} ${outfit.variable} antialiased bg-zinc-950 text-white overflow-x-hidden`}>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] bg-[#D4AF37] text-black px-4 py-2 rounded-md font-bold focus:outline-none focus:ring-4 focus:ring-yellow-500/50">
            Skip to main content
          </a>
          <ConvexClientProvider>
            <DashboardLayout>
              {children}
            </DashboardLayout>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
