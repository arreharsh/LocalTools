"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  Sparkles,
  X,
  LogOut,
  User,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import RequestToolModal from "@/components/RequestToolModal";
import { useAuth, useAuthModal } from "@/providers/AuthProvider";
import { createSupabaseBrowser } from "@/lib/supabase/client";

const supabase = createSupabaseBrowser();



const PLACEHOLDERS = [
  "PDF Merge",
  "Image to PDF",
  "PDF Split",
  "Regex Tester",
  "JWT Decoder",
];

export default function MobileHeader() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { open: openAuth } = useAuthModal();

  const [openRequest, setOpenRequest] = useState(false);

  /* scroll hide */
  const lastScroll = useRef(0);
  const [hidden, setHidden] = useState(false);

  /* menu */
  const [menuOpen, setMenuOpen] = useState(false);

  /* placeholder */
  const [phIndex, setPhIndex] = useState(0);

  /* hide / show on scroll */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > lastScroll.current && y > 60);
      lastScroll.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* placeholder rotate */
  useEffect(() => {
    const i = setInterval(() => {
      setPhIndex((p) => (p + 1) % PLACEHOLDERS.length);
    }, 2000);
    return () => clearInterval(i);
  }, []);

  /* close menu on route change */
  useEffect(() => {
    setMenuOpen(false);
  }, [router]);

  const name =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    "User";

  const initial = name.charAt(0).toUpperCase();

  return (
    <>
      {/* HEADER */}
      <header
        className={`
          md:hidden fixed top-0 inset-x-0 z-50 rounded-b-2xl
          bg-background/80 backdrop-blur-xl shadow-md
          border-b border-border/60
          transition-transform duration-300
          ${hidden ? "-translate-y-full" : "translate-y-0"}
        `}
      >
        <div className="flex items-center justify-between px-4 py-3">
          {/* LOGO */}
          <button
            onClick={() => router.push("/")}
            className="flex font-bold text-lg items-center gap-2"
          >
            <Image src="/logo.png" alt="Logo" width={26} height={26} />
            LocalTools
          </button>

          {/* RIGHT */}
          <div className="flex items-center gap-2">
            {/* SEARCH */}
            <button
              onClick={() => router.push("/tools")}
              className="
                flex items-center gap-2
                px-3 py-2 rounded-md
                bg-muted/70 border border-border/60
                text-sm text-muted-foreground
              "
            >
              <Search size={16} />
              <span
                key={phIndex}
                className="animate-in fade-in slide-in-from-bottom-1"
              >
                '{PLACEHOLDERS[phIndex]}'
              </span>
            </button>

            {/* MENU */}
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="w-10 h-9 flex items-center justify-center rounded-md hover:bg-muted"
            >
              {menuOpen ? (
                <X size={22} />
              ) : (
                <Image
                  src="/menu.png"
                  alt="Menu"
                  width={24}
                  height={24}
                  className="dark:invert"
                />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* BACKDROP */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-black/20"
        />
      )}

      {/* DROPDOWN */}
      <div
        className={`
          md:hidden fixed top-[60px] inset-x-0 z-50
          transition-all duration-200 origin-top
          ${
            menuOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "pointer-events-none opacity-0 scale-95 -translate-y-2"
          }
        `}
      >
        <div className="mx-2 rounded-xl bg-background/80 backdrop-blur-xl border shadow-lg">
          <div className="px-4 py-3 space-y-2">
            {/* THEME */}
            <div className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted/60">
              <span className="text-sm font-semibold">Theme</span>
              <ThemeToggle />
            </div>

            <div className="border-t border-border p-1" />

            {/* USER SECTION */}
            {!loading && user && (
              <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-muted/40">
                <div className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary font-semibold">
                  {initial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{name}</p>
                  <p className="text-xs text-muted-foreground">
                    Free plan
                  </p>
                </div>
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    setMenuOpen(false);
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}

            {!loading && !user && (
              <button
                onClick={() => {
                  openAuth();
                  setMenuOpen(false);
                }}
                className="w-full px-3 py-2 rounded-md bg-primary shadow-md
                           border border-border text-center font-medium
                           text-sm text-primary-foreground"
              >
                Login | Sign Up
              </button>
            )}

            <div className="border-t border-border p-1" />

            <button
              onClick={() => router.push("/pricing")}
              className="
                w-full flex items-center gap-2
                px-3 py-2 rounded-md border border-border
                text-sm hover:bg-muted/60 font-semibold
              "
            >
              <Sparkles size={14} />
              Get Pro
            </button>

            <button
              onClick={() => router.push("/tools")}
              className="w-full px-3 py-2 rounded-md border border-border text-left font-semibold text-sm"
            >
              All Tools
            </button>

            <button
              onClick={() => setOpenRequest(true)}
              className="w-full px-3 py-2 rounded-md border border-border text-left font-semibold text-sm"
            >
              Request a Tool
            </button>
          </div>
        </div>
      </div>

      <RequestToolModal
        open={openRequest}
        onClose={() => setOpenRequest(false)}
      />
    </>
  );
}
