import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
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

export const metadata = {
  title: "M2 NEXUS",
  description: "Mahmoud Awaleh Strategic Command Center",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${outfit.variable} antialiased bg-zinc-950 text-white`}>
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
