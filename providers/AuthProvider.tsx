"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import type { User } from "@supabase/supabase-js";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import AuthModal from "@/components/AuthModal";

type Plan = "free" | "pro";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  plan: Plan;
  isPro: boolean;
  pro_expires_at: string | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  plan: "free",
  isPro: false,
  pro_expires_at: null,
});

const AuthModalContext = createContext<{ open: () => void }>({
  open: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabaseRef = useRef(createSupabaseBrowser());
  const supabase = supabaseRef.current;

  const [user, setUser] = useState<User | null>(null);
  const [plan, setPlan] = useState<Plan>("free");
  const [proExpiresAt, setProExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ PRO = plan === "pro" AND not expired
  const isPro =
  plan === "pro" &&
  (proExpiresAt === null || new Date(proExpiresAt) > new Date());


  /* ---------------------------
     Load user plan + expiry
  --------------------------- */
  const loadUserPlan = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("plan, pro_expires_at")
      .eq("id", userId)
      .single();

    if (!data) {
      setPlan("free");
      setProExpiresAt(null);
      return;
    }

    // ❌ expired → free
    if (data.pro_expires_at && new Date(data.pro_expires_at) < new Date()) {
      setPlan("free");
      setProExpiresAt(null);
      return;
    }

    // ✅ active
    setPlan(data.plan ?? "free");
    setProExpiresAt(data.pro_expires_at ?? null);
  };

  /* ---------------------------
     Initial session load
  --------------------------- */
  useEffect(() => {
    let active = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;

        const sessionUser = data.session?.user ?? null;
        setUser(sessionUser);

        if (sessionUser) {
          loadUserPlan(sessionUser.id);
        } else {
          setPlan("free");
          setProExpiresAt(null);
        }

        setLoading(false);
      })
      .catch(() => setLoading(false));

    const { data: sub } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const sessionUser = session?.user ?? null;
        setUser(sessionUser);

        if (sessionUser) {
          loadUserPlan(sessionUser.id);

          if (event === "SIGNED_IN") {
            await fetch("/api/email/send-welcome", {
              method: "POST",
            });
          }
        } else {
          setPlan("free");
          setProExpiresAt(null);
        }
      }
    );

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  /* ---------------------------
     Modal body lock
  --------------------------- */
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        plan,
        isPro,
        pro_expires_at: proExpiresAt,
      }}
    >
      <AuthModalContext.Provider value={{ open: () => setIsModalOpen(true) }}>
        {children}
        <AuthModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </AuthModalContext.Provider>
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export const useAuthModal = () => useContext(AuthModalContext);
