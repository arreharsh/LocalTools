"use client";
export const dynamic = "force-dynamic";

import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import { Lock } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

// ✅ Razorpay payment links
const RAZORPAY_LINKS = {
  pro: "https://rzp.io/i/YOUR_LIFETIME_LINK",
  "3day": "https://rzp.io/i/YOUR_3DAY_LINK",
};

export default function BillingPage() {
  const params = useSearchParams();
  const router = useRouter();

  const SUGGESTED_COUPONS = ["HARSH10", "PROONLY20"];

  const plan = (params.get("plan") as "pro" | "3day") ?? "pro";

  const isProLifetime = plan === "pro";

  // ✅ INR prices
  const basePrice = isProLifetime ? 499 : 199;

  const planLabel = isProLifetime ? "Pro Lifetime" : "3-Day Pro Access";

  const [coupon, setCoupon] = useState("");
  const [finalPrice, setFinalPrice] = useState(basePrice);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function applySuggestedCoupon(code: string) {
    setCoupon(code);
    setError("");
    setDiscountAmount(0);
    setFinalPrice(basePrice);

    setLoading(true);

    try {
      const res = await fetch("/api/coupon/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          plan,
        }),
      });

      const data = await res.json();

      if (!data.valid) {
        setError(data.message || "Invalid coupon");
        return;
      }

      setFinalPrice(data.finalAmount);
      setDiscountAmount(data.discountAmount);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

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
        setError(data.message || "Invalid coupon");
        setFinalPrice(basePrice);
        setDiscountAmount(0);
        return;
      }

      setFinalPrice(data.finalAmount);
      setDiscountAmount(data.discountAmount);
    } catch (e) {
      setError("Something went wrong");
      setFinalPrice(basePrice);
      setDiscountAmount(0);
    } finally {
      setLoading(false);
    }
  }
  async function handlePay() {
    const res = await fetch("/api/razorpay/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: finalPrice, // 👈 coupon applied price
        plan,
      }),
    });

    const order = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "LocalTools",
      description: plan === "pro" ? "Pro Lifetime Access" : "3-Day Pro Access",
      order_id: order.id,
      handler: function (response: any) {
        window.location.href = "/billing/success";
      },
      prefill: {
        email: "",
      },
      theme: {
        color: "#6366f1",
      },
    };

    if (!(window as any).Razorpay) {
      alert("Razorpay SDK failed to load. Please refresh.");
      return;
    }

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
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
              Coupon code
            </label>

            {/* Suggested coupons */}
            <div className="mb-3 flex gap-2 flex-wrap">
              {SUGGESTED_COUPONS.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => applySuggestedCoupon(code)}
                  disabled={loading}
                  className="rounded-md border border-border px-3 py-1 text-xs hover:bg-muted transition disabled:opacity-60"
                >
                  {code} 🎁
                </button>
              ))}
            </div>

            {/* Manual input */}
            <div className="flex gap-2">
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="ENTER CODE"
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

            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>

          {/* PRICE */}
          <div className="mt-8 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{basePrice}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-accent">
                <span>Discount</span>
                <span>-₹{discountAmount}</span>
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
            className="mt-8 w-full rounded-xl bg-accent px-4 py-3 text-sm font-medium text-accent-foreground hover:opacity-90 transition"
          >
            Pay ₹{finalPrice}
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
