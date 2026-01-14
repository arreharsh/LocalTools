import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";


import "./globals.css";
import Script from "next/script";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://localtools.app"),
  title: {
    default: "Local Tools – Free Online Tools",
    template: "%s | Local Tools",
  },
  description:
    "Local Tools offers fast, secure, privacy-first online tools for PDF, images, text, and more.",
  keywords: [
    "online tools",
    "pdf tools",
    "image tools",
    "free tools",
    "localtools",
    "privacy-first",
    "secure tools",
    "text tools",
    "file conversion",
    "local processing",
    "offline tools",
    "browser-based tools",
    "media tools",
    "utility tools",
    "productivity tools",
    "localtools app",
    "local tools online",
    "local tools"
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: "Local Tools",
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* ClientLayout */}
        {children}
        <Analytics />
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
      </body>
      
    </html>
  );
}