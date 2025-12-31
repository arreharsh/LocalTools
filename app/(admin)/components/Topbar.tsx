"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import {
  Menu,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import MobileNav from "./MobileNav";

export default function Topbar() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
 
  const supabase = createSupabaseBrowser();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <>
      <header className="h-14 border-b bg-background flex items-center justify-between px-4">
        <button
          className="md:hidden p-1"
          onClick={() => setOpen(true)}
        >
          <Menu size={20} />
        </button>

        <div className="font-medium">Admin Panel</div>

        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              setTheme(theme === "dark" ? "light" : "dark")
            }
            className="p-1 rounded hover:bg-muted"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Moon size={18} />
            ) : (
              <Sun size={18} />
            )}
          </button>

          <button
            onClick={logout}
            className="p-1 rounded hover:bg-muted text-red-600"
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <MobileNav open={open} onClose={() => setOpen(false)} />
    </>
  );
}
