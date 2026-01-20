import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { siteConfig } from "@/lib";
import TargetCursor from '../components/ui/targetCursor';
import Header from '../components/layout/Header';
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | Helpful Solutions for the Open Source Community`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["open source", "developer tools", "community", "github", "collaboration"],
  authors: [{ name: siteConfig.name }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} antialiased min-h-[100dvh] flex flex-col`}>
        <TargetCursor 
          spinDuration={21}
          hideDefaultCursor
          parallaxOn={false}
          hoverDuration={0.3}
        />
        <Header />
        {children}
      </body>
    </html>
  );
}
