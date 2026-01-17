"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth, useAuthModal } from "@/providers/AuthProvider";
import { useState } from "react";
import { Lock } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const RAZORPAY_LINKS = {
  pro: {
    normal: "https://rzp.io/rzp/localtools-pro",
    coupon: "https://rzp.io/rzp/Ltpro10off",
  },
  "3day": {
    normal: "https://rzp.io/rzp/Ltpro3day",
    coupon: "https://rzp.io/rzp/Ltpro10off3day",
  },
};

export default function BillingPage() {
  const params = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { open } = useAuthModal();

  const plan = (params.get("plan") as "pro" | "3day") ?? "pro";
  const isProLifetime = plan === "pro";

  const basePrice = isProLifetime ? 499 : 199;

  const [coupon, setCoupon] = useState("");
  const [couponValid, setCouponValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const finalPrice = couponValid ? Math.round(basePrice * 0.9) : basePrice;

  const planLabel = isProLifetime ? "Pro Lifetime" : "3-Day Pro Access";

  async function applyCoupon() {
    if (!coupon.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/coupon/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: coupon,
          plan,
        }),
      });

      const data = await res.json();

      if (!data.valid) {
        setCouponValid(false);
        setError(data.message || "Invalid coupon");
        return;
      }

      setCouponValid(true);
    } catch {
      setError("Coupon verification failed");
      setCouponValid(false);
    } finally {
      setLoading(false);
    }
  }

  function handlePay() {
    if (authLoading) return;

    if (!user) {
      open();
      return;
    }

    const link = couponValid
      ? RAZORPAY_LINKS[plan].coupon
      : RAZORPAY_LINKS[plan].normal;

    window.location.href = link;
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-6 py-24">
        {/* HEADER */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center"
        >
          <h1 className="text-2xl md:text-3xl font-semibold">
            Complete your purchase
          </h1>
          <p className="mt-3 text-muted-foreground">
            Secure one-time payment. No subscriptions.
          </p>
        </motion.div>

        {/* CARD */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.1 }}
          className="mt-12 rounded-2xl border border-border bg-card/40 p-8 shadow-xl"
        >
          {/* PLAN */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">{planLabel}</h2>
              <p className="text-sm text-muted-foreground">
                {isProLifetime
                  ? "Unlimited access forever"
                  : "Full Pro access for 3 days"}
              </p>
            </div>
            <div className="text-2xl font-bold">₹{basePrice}</div>
          </div>

          {/* COUPON */}
          <div className="mt-8">
            <label className="block text-sm font-medium mb-2">
              Have a coupon?
            </label>

            <div className="flex gap-2">
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
              <button
                onClick={applyCoupon}
                disabled={loading}
                className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted transition disabled:opacity-60"
              >
                {loading ? "Checking..." : "Apply"}
              </button>
            </div>

            {couponValid && (
              <p className="mt-2 text-xs text-accent">
                Coupon applied 🎉 You’ll get 10% OFF
              </p>
            )}

            {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
          </div>

          {/* PRICE */}
          <div className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{basePrice}</span>
            </div>

            {couponValid && (
              <div className="flex justify-between text-accent">
                <span>Discount (10%)</span>
                <span>-₹{basePrice - finalPrice}</span>
              </div>
            )}

            <div className="border-t border-border pt-2 flex justify-between font-medium">
              <span>Total</span>
              <span>₹{finalPrice}</span>
            </div>
          </div>

          {/* PAY */}
          <button
            onClick={handlePay}
            disabled={loading || authLoading}
            className="mt-8 w-full rounded-xl bg-accent px-4 py-3 text-sm font-medium text-accent-foreground hover:opacity-90 transition disabled:opacity-60"
          >
            {authLoading
              ? "Checking session..."
              : user
                ? `Pay ₹${finalPrice}`
                : "Login to continue"}
          </button>

          {/* TRUST */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Lock className="w-4 h-4" />
            Secure payment via Razorpay • One-time charge
          </div>
        </motion.div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.back()}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Go back
          </button>
        </div>
      </div>
    </main>
  );
}
