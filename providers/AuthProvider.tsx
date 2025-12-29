"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import AuthModal from "@/components/AuthModal";

/* =========================
   Auth Context
========================= */

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
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

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* --- Session bootstrap + listener --- */
  useEffect(() => {
    let mounted = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        setUser(data.session?.user ?? null);
        setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /* --- Lock body scroll when modal open --- */
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
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
