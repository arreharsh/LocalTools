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
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  plan: "free",
  isPro: false,
});

const AuthModalContext = createContext<{ open: () => void }>({
  open: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabaseRef = useRef(createSupabaseBrowser()); // ✅ SINGLE INSTANCE
  const supabase = supabaseRef.current;

  const [user, setUser] = useState<User | null>(null);
  const [plan, setPlan] = useState<Plan>("free");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isPro = plan === "pro";

  async function loadUserPlan(userId: string) {
    const { data } = await supabase
      .from("profiles")
      .select("plan, pro_expires_at")
      .eq("id", userId)
      .single();

    if (!data) {
      setPlan("free");
      return;
    }

    if (data.pro_expires_at && new Date(data.pro_expires_at) < new Date()) {
      setPlan("free");
      return;
    }

    setPlan(data.plan ?? "free");
  }

  // ✅ INITIAL LOAD
  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;

      const sessionUser = data.session?.user ?? null;
      setUser(sessionUser);

      if (sessionUser) {
        loadUserPlan(sessionUser.id); // ❌ no await
      } else {
        setPlan("free");
      }

      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const sessionUser = session?.user ?? null;
        setUser(sessionUser);

        if (sessionUser) {
          loadUserPlan(sessionUser.id); // ❌ no await
        } else {
          setPlan("free");
        }
      }
    );

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
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

export const useAuth = () => useContext(AuthContext);
export const useAuthModal = () => useContext(AuthModalContext);
