"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import UserMenu from "@/components/user-menu";
import MobileHeader from "@/components/mobile-header";
import { AuthProvider } from "@/providers/AuthProvider";
import { ToolsSidebar } from "@/components/tools-sidebar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

        <SidebarProvider>
            {/* @ts-expect-error Server Component */}
          <ToolsSidebar />
          <SidebarInset className="min-h-screen overflow-y-auto pt-18">
            {children}
          </SidebarInset>
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
