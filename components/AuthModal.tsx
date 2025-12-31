"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/client";

import { useAuth } from "@/providers/AuthProvider";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AuthModal({ open, onClose }: Props) {
  const { user } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createSupabaseBrowser();

  useEffect(() => {
    if (user && open) onClose();
  }, [user, open, onClose]);

  if (!open) return null;

  /* ---------- Google ---------- */

  const handleGoogle = async () => {
    try {
      setLoading(true);
      await supabase.auth.signInWithOAuth({ provider: "google" });
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Email ---------- */

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setError("Incorrect email or password");
          return;
        }

        return;
      }

      // signup
      if (!name.trim()) {
        setError("Please enter your name");
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      // ⚠️ Auto-login happens automatically
      // IF Supabase → Email confirmation is OFF
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="
    relative w-full
    max-w-md sm:max-w-md
    mx-3 sm:mx-0
    rounded-lg border bg-background
    p-4 sm:p-6
    shadow-xl
  "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-muted"
          aria-label="Close"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold">
          {mode === "login" ? "Sign in to continue" : "Create your account"}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "login"
            ? "Use your account to unlock more tools"
            : "Get started in seconds"}
        </p>

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="mt-4 w-full rounded-md border bg-secondary px-4 py-2 text-sm font-medium
                     hover:bg-secondary/80 flex items-center justify-center gap-3
                     disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <svg
            className="size-4 shrink-0 text-muted-foreground"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="my-4 flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          OR
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Name */}
        {mode === "signup" && (
          <input
            type="text"
            placeholder="What should we call you?"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm
                       outline-none focus:ring-2 focus:ring-ring"
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className={`w-full rounded-md border bg-background px-3 py-2 text-sm
                     outline-none focus:ring-2 focus:ring-ring ${
                       mode === "signup" ? "mt-2" : ""
                     }`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm
                     outline-none focus:ring-2 focus:ring-ring"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="mt-2 text-xs text-destructive">{error}</p>}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium
                     text-primary-foreground hover:opacity-90
                     disabled:opacity-70 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
        >
          {loading && (
            <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
          )}
          {mode === "login"
            ? loading
              ? "Signing in..."
              : "Sign in"
            : loading
            ? "Creating account..."
            : "Create account"}
        </button>

        <p className="mt-3 text-center text-xs text-muted-foreground">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setMode("signup")}
                className="underline text-primary font-medium"
              >
                Create one
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="underline text-primary font-medium"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
