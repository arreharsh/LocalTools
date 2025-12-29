"use client";

import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/theme-toggle";
import  UserMenuSkeleton  from "@/components/skeletons/UserMenuSkeleton";


import {
  ChevronDown,
  LogOut,
  Sparkles,
  User,
} from "lucide-react";

/* =========================
   Skeleton
========================= */


/* =========================
   User Menu
========================= */

export default function UserMenu() {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);

  /* --- Skeleton while auth resolving --- */
  if (loading) return <UserMenuSkeleton />;

  /* --- Logged out: hide menu but keep layout stable --- */
  if (!user) return null;

  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    "User";

  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="fixed hidden lg:flex top-4 right-6 z-50 items-start gap-2">
      {/* User container */}
      <div className="flex flex-col rounded-xl border backdrop-blur-md shadow-sm overflow-hidden min-w-[180px] bg-gradient-to-br from-foreground/3 to-transparent">
        {/* Header */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 px-3 py-2 hover:bg-muted transition"
        >
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/15 text-primary font-semibold">
            {initial}
          </div>

          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-medium truncate">
              {name}
            </p>
            <p className="text-xs text-muted-foreground">
              Free plan
            </p>
          </div>

          <ChevronDown
            className={`size-4 opacity-60 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Expandable section */}
        {open && (
          <div className="flex flex-col border-t">
            {/* Upgrade */}
            <button
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition"
            >
              <Sparkles className="size-4 text-yellow-500" />
              Upgrade to Pro
            </button>

            {/* Profile */}
            <button
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition"
            >
              <User className="size-4 opacity-70" />
              Profile
            </button>

            {/* Logout */}
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                setOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition"
            >
              <LogOut className="size-4" />
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Theme toggle */}
      <ThemeToggle />
    </div>
  );
}
