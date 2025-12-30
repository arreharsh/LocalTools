"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import AuthModal from "@/components/AuthModal";

type Plan = "free" | "pro";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  plan: Plan | null;
  isPro: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  plan: null,
  isPro: false,
});

const AuthModalContext = createContext<{ open: () => void }>({
  open: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const supabase = createSupabaseBrowser(); 

  const isPro = plan === "pro";

  async function loadUserPlan(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("plan, pro_expires_at") 
      .eq("id", userId)
      .single();

    if (error || !data) {
      setPlan("free");
      return;
    }

    const expires = data.pro_expires_at ? new Date(data.pro_expires_at) : null;
    if (expires && expires < new Date()) {
      setPlan("free");
      return;
    }

    setPlan(data.plan ?? "free");
  }

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!mounted) return;

      const sessionUser = session?.user ?? null;
      setUser(sessionUser);

      if (sessionUser) await loadUserPlan(sessionUser.id);
      else setPlan("free");

      setLoading(false);
    }

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      const sessionUser = session?.user ?? null;
      setUser(sessionUser);

      if (event === "SIGNED_IN" && sessionUser) {
        await loadUserPlan(sessionUser.id);
      }

      if (event === "SIGNED_OUT") {
        setPlan("free");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isModalOpen]);

  return (
    <AuthContext.Provider value={{ user, loading, plan, isPro }}>
      <AuthModalContext.Provider value={{ open: () => setIsModalOpen(true) }}>
        {children}
        <AuthModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </AuthModalContext.Provider>
    </AuthContext.Provider>
  );
}

// Hooks same
export const useAuth = () => useContext(AuthContext);
export const useAuthModal = () => useContext(AuthModalContext);