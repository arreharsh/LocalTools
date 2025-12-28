"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import AuthModal from "@/components/AuthModal";

/* =========================
   Auth Context
========================= */

const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
}>({
  user: null,
  loading: true,
});

/* =========================
   Auth Modal Context
========================= */

const AuthModalContext = createContext<{
  open: () => void;
}>({
  open: () => {},
});

/* =========================
   Provider
========================= */

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* --- Session bootstrap + listener --- */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  /* --- Lock body scroll when modal open (UX polish) --- */
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      <AuthModalContext.Provider
        value={{ open: () => setIsModalOpen(true) }}
      >
        {children}

        {/* Global Auth Modal */}
        <AuthModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </AuthModalContext.Provider>
    </AuthContext.Provider>
  );
}

/* =========================
   Hooks
========================= */

export const useAuth = () => useContext(AuthContext);
export const useAuthModal = () => useContext(AuthModalContext);
