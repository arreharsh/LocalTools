"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useAuthModal } from "@/providers/AuthProvider";
import { createSupabaseBrowser } from "@/lib/supabase/client";

import { ThemeToggle } from "@/components/theme-toggle";
import UserMenuSkeleton from "@/components/skeletons/UserMenuSkeleton";

import { ChevronDown, LogOut, Sparkles, User } from "lucide-react";
import ProfileUsageModal from "./ProfileUsageModal";

export default function UserMenu() {
  const { user, isPro, plan, loading } = useAuth();
  const [open, setOpen] = useState(false);

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { open: openAuth } = useAuthModal();
  const navigation = useRouter();

  const supabaseRef = useRef(createSupabaseBrowser());
  const supabase = supabaseRef.current;

  /* --- Skeleton while auth resolving --- */
  if (loading) return <UserMenuSkeleton />;

  /* --- Logged out: hide menu --- */
  const isGuest = !user;

  const name = isGuest
    ? "Guest"
    : user.user_metadata?.full_name || user.user_metadata?.name || "LtUser";

  const initial = isGuest ? <User /> : name.charAt(0).toUpperCase();

  return (
    <>
      <div className="fixed hidden lg:flex top-4 right-6 z-50 items-start ">
        {/* User container */}
        <div
          className={`flex flex-col  border backdrop-blur-md shadow-sm overflow-hidden 
       min-w-[180px] bg-gradient-to-br from-foreground/3 to-transparent rounded-xl `}
        >
          {/* Header */}
          <div className="flex gap-2 items-center p-0">
            <button
              onClick={() => setOpen((v) => !v)}
              className={`flex items-center gap-2 px-3 py-1 hover:bg-muted transition border-r `}
            >
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/15 text-primary font-semibold">
                {initial}
              </div>

              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium truncate">{name}</p>

                {/* PLAN LABEL */}
                {plan === null ? (
                  <span className="text-xs text-muted-foreground">
                    Loading…
                  </span>
                ) : (
                  <span className="text-xs bg-primary/10 text-primary px-2 mb-0.5 border border-primary/50 rounded-md">
                    {isPro ? "Pro" : "Free"}
                  </span>
                )}
              </div>

              <ChevronDown
                className={`size-4 opacity-60 transition-transform ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>
            <span className="mr-2">
              <ThemeToggle />
            </span>
          </div>

          {/* Expandable section */}
          {open && (
            <div className="flex flex-col border-t">
              {isGuest && (
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition"
                >
                  Usage Info
                </button>
              )}
              {/* Upgrade (only for FREE users) */}
              {!isPro && (
                <button
                  className={`flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition ${
                    isGuest ? "hidden" : ""
                  }`}
                  onClick={() => {
                    navigation.push("/pricing");
                  }}
                >
                  <Sparkles className="size-4 text-yellow-500" />
                  Upgrade to Pro
                </button>
              )}

              {/* Pro badge (read-only) */}
              {isPro && (
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-yellow-600">
                  <Sparkles className="size-4" />
                  Pro member
                </div>
              )}

              {/* Profile */}
              {!isGuest && (
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition"
                >
                  <User className="size-4 opacity-70" />
                  Profile
                </button>
              )}

              {isGuest && (
                <button
                  onClick={() => openAuth()}
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition"
                >
                  <User className="size-4 opacity-70" />
                  Sign in
                </button>
              )}

              {/* Logout */}
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  setOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition ${
                  isGuest ? "hidden" : ""
                }`}
              >
                <LogOut className="size-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <ProfileUsageModal
        open={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
}
