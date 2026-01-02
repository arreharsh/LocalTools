"use client";

import { motion } from "framer-motion";
import { PlanCard } from "./PlanCard";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};



export function PricingSection() {
  const { plan, pro_expires_at } = useAuth();
 
  const router = useRouter();

  const goToLifetime = () => {
  router.push("/billing?plan=pro");
};

const goTo3Day = () => {
  router.push("/billing?plan=3day");
};

  const isPro =
    plan === "pro" &&
    pro_expires_at &&
    new Date(pro_expires_at) > new Date();

  const isLifetime =
    isPro && new Date(pro_expires_at) > new Date("2090-01-01");

  return (
    <section className=" bg-background to-transparent">
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-2xl md:text-3xl font-semibold"
        >
          Simple and honest pricing
        </motion.h2>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ delay: 0.1 }}
          className="mt-3 text-muted-foreground"
        >
          Start free. Upgrade only if you need more. No subscriptions ever.
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.2 }}
          className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {/* FOREVER FREE */}
          <PlanCard
            title="Forever Free"
            price="₹0"
            features={[
              { label: "Limited daily usage", available: true },
              { label: "Essential tools access", available: true },
              { label: "Privacy-first, browser-only", available: true },
              { label: "Community support", available: false },
              { label: "Early access to new features", available: false },
              { label: "Priority support", available: false },
              { label: "Exclusive community access", available: false },
              { label: "All tools unlocked", available: false },

            ]}
            cta={{
              label: !isPro ? "✓ Current Plan" : "Included",
              disabled: true,
            }}
          />

          {/* 3 DAY PASS */}
          <PlanCard
            title="3-Day Pass"
            price="₹199"
            subtitle="/ 3 days"
            features={[
             { label: "All tools unlocked", available: true },
              { label: "Unlimited access to all tools", available: true },
              { label: "No usage limits", available: true },
              { label: "No subscriptions ever", available: true },
              { label: "Priority support", available: true },
              { label: "Early access to new features", available: true },
              { label: "Exclusive community access", available: true },
              { label: "Privacy-first, browser-only", available: true },

            ]}
            cta={
              isPro && !isLifetime
                ? { label: "✓ Active", disabled: true }
                : isLifetime
                ? { label: "Included", disabled: true }
                : {
                    label: "Get 3-Day Pass",
                    onClick: () =>
                      goTo3Day(),
                  }
            }
          />

          {/* PRO LIFETIME */}
          <PlanCard
            title="Pro Lifetime"
            price="₹499"
            originalPrice="₹999"
            badge="Best Value"
            highlight
            features={[
              { label: "Unlimited access to all tools", available: true },
              { label: "No usage limits", available: true },
              { label: "Lifetime updates", available: true },
              { label: "No subscriptions ever", available: true },
              { label: "Priority support", available: true },
              { label: "Early access to new features", available: true },
              { label: "Exclusive community access", available: true },
              { label: "Privacy-first, browser-only", available: true },
            ]}
            cta={
              isLifetime
                ? { label: "✓ Current Plan", disabled: true }
                : {
                    label: "Get Lifetime Access",
                    onClick: () =>
                      goToLifetime(),
                  }
            }
          />
        </motion.div>
      </div>
    </section>
  );
}
