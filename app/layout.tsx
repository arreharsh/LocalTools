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
  title: "All-in-One Tools Platform",
  description: "Developer tools for text, JSON, images, and more",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
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

