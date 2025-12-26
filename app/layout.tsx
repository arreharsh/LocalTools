"use clint"

import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { ToolsSidebar } from "@/components/tools-sidebar"
import "./globals.css"
import { ThemeToggle } from "@/components/theme-toggle"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LocalTools - Privacy Focused No-Tracking No-Ads",
  description: "Developer tools for text, JSON, images, and more",
  generator: "Next.js",
 icons: {
  icon: [
    {
      url: "/favicon-32x32.png",
      sizes: "32x32",
      type: "image/png",
    },
    {
      url: "/favicon-16x16.png",
      sizes: "16x16",
      type: "image/png",
    },
    {
      url: "/icon.svg",
      type: "image/svg+xml",
    },
  ],
  apple: [
    {
      url: "/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png",
    },
  ],
},

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
        <head>
          <link
           href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap"
           rel="stylesheet"
          />
       </head>
      <body className="">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="fixed top-4 right-8 z-50">
          <ThemeToggle />
          </div>
          {/* 🔥 GLOBAL SIDEBAR LAYOUT */}
          <SidebarProvider>
            {/* Sidebar always visible */}
            <ToolsSidebar />

            {/* Main content (right / empty space) */}
            <SidebarInset className="h-screen overflow-y-auto">
              {children}
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>

        <Analytics />
      </body>
    </html>
  )
}

