"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import UserMenu from "@/components/user-menu";
import { useEffect, useState } from "react";
import MobileHeader from "@/components/mobile-header";
import { AuthProvider } from "@/providers/AuthProvider";
import { ToolsSidebar } from "@/components/tools-sidebar";
import { usePathname } from "next/navigation"
import { Toaster } from "sonner";


export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  const pathname = usePathname()
  const isHome = pathname === "/" || pathname === "/tools" || pathname === "/billing"

  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (isHome) {
      setOpen(false)
    } else {
      setOpen(true)
    }
  }, [isHome])
  

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <AuthProvider>
        <MobileHeader />
        <UserMenu />

        <SidebarProvider open={open} onOpenChange={setOpen}>
          {/* @ts-expect-error Server Component */}
          <ToolsSidebar />
          <SidebarInset className="min-h-screen overflow-y-auto pt-16 md:pt-0">
            {children}
            <Toaster position="bottom-right" />
          </SidebarInset>
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
