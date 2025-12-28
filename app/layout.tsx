
import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import RequestToolModal from "@/components/RequestToolModal";
import { ToolsSidebar } from "@/components/tools-sidebar"
import "./globals.css"
import { ThemeToggle } from "@/components/theme-toggle"
import MobileHeader from "@/components/mobile-header"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })


export const metadata: Metadata = {
  title: "LocalTools - Privacy Focused No-Tracking No-Ads",
  description: "Developer tools for text, JSON, images, and more",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
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
        {/* ✅ ThemeProvider MUST be top-level */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
         
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* Mobile Header */}
          <MobileHeader />


          {/* Desktop Theme Toggle */}
          <div className="fixed top-4 right-8 z-50 hidden md:block">
            <ThemeToggle />
          </div>

          {/* Sidebar Layout */}
          <SidebarProvider>
           {/* @ts-expect-error Server Component */}
            <ToolsSidebar />

            <SidebarInset className="min-h-screen overflow-y-auto pt-18 ">
              {children}
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>

        <Analytics />
      </body>
    </html>
  )
}

