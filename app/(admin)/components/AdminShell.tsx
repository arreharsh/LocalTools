import { ReactNode } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { ThemeProvider } from "@/components/theme-provider";

export default function AdminShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ThemeProvider>
    <div className="min-h-screen flex bg-muted">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:block w-64 border-r bg-background">
        <Sidebar />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
    </ThemeProvider>
  );
}
