"use client";

import Link from "next/link";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";
import FAQSection from "@/components/FAQSection";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/footer";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function PlansPage() {
  const router = useRouter();
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* HEADER */}
      <section className="max-w-7xl mx-auto px-6 pb-20 text-center">

        <div className="flex pt-4 md:pt-0 pb-4 justify-start">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-4xl md:text-5xl font-bold tracking-tight"
        >
          Choose your plan
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.1 }}
          className="mt-4 text-muted-foreground max-w-2xl mx-auto"
        >
          Simple pricing for everyone — from quick tasks to heavy daily usage.
          No subscriptions. No hidden fees.
        </motion.p>
      </section>

      {/* PLANS */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* FREE */}
          <motion.div
            variants={fadeUp}
            className="rounded-2xl box-shadow shadow border border-border bg-card/40 p-8 text-left"
          >
            <h3 className="text-xl font-semibold">Free</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              For quick tasks and casual use
            </p>

            <div className="mt-4 text-4xl font-bold">$0</div>

            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Basic tools access",
                "Small JSON & files",
                "Limited daily usage",
                "No account required",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent" />
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* 3 DAY PASS */}
          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-border box-shadow shadow bg-gradient-to-br from-accent/5 to-transparent p-8 text-left"
          >
            <h3 className="text-xl font-semibold">3-Day Pass</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Short access to try everything
            </p>

            <div className="mt-4 text-4xl font-bold">$2</div>

            <ul className="mt-6 space-y-3 text-sm">
              {[
                "All tools unlocked",
                "Large JSON & file support",
                "API & developer utilities",
                "No ads or tracking",
                "Support",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent" />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="#"
              className="mt-8 block w-full rounded-xl border border-border px-4 py-3 text-center text-sm font-medium hover:bg-muted transition"
            >
              Get 3-Day Pass
            </Link>
          </motion.div>

          {/* LIFETIME */}
          <motion.div
            variants={fadeUp}
            className="relative rounded-2xl bg-gradient-to-br from-accent/10 to-transparent p-8 text-left"
          >
            {/* glow */}
            <motion.div
              aria-hidden
              className="absolute inset-0 rounded-2xl pointer-events-none"
              animate={{
                boxShadow: [
                  "0 0 0px rgba(99,102,241,0)",
                  "0 0 22px rgba(99,102,241,0.35)",
                  "0 0 0px rgba(99,102,241,0)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <div className="absolute inset-0 rounded-2xl border border-accent pointer-events-none" />

            <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 font-semibold text-xs text-accent-foreground">
              Best Value
            </span>

            <h3 className="text-xl font-semibold">Pro Lifetime</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              One-time payment. Forever access.
            </p>

            <div className="mt-4 flex items-end gap-3">
              <span className="text-sm text-muted-foreground line-through">
                $20
              </span>
              <span className="text-4xl font-bold">$6</span>
            </div>

            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Unlimited access to all tools",
                "Heavy JSON & file support",
                "Advanced dev utilities",
                "Early access to new tools",
                "Lifetime updates",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent" />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="#"
              className="mt-8 block w-full rounded-xl bg-accent px-4 py-3 text-center text-sm font-medium text-accent-foreground hover:opacity-90 transition"
            >
              Get Lifetime Access
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="border-t border-border bg-muted/20">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <h2 className="text-2xl font-semibold text-center">Compare plans</h2>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full max-w-4xl mx-auto border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 text-left">Feature</th>
                  <th className="py-3 text-center">Free</th>
                  <th className="py-3 text-center">3-Day</th>
                  <th className="py-3 text-center">Lifetime</th>
                </tr>
              </thead>

              <tbody>
                {[
                  ["Basic tools", true, true, true],
                  ["Large files support", false, true, true],
                  ["Advanced dev tools", false, true, true],
                  ["No ads / tracking", false, true, true],
                  ["Unlimited usage", false, false, true],
                  ["Future tools access", false, false, true],
                ].map(([label, f, t, l]) => (
                  <tr key={label as string} className="border-b border-border">
                    <td className="py-3">{label}</td>
                    {[f, t, l].map((v, i) => (
                      <td key={i} className="py-3 text-center">
                        {v ? (
                          <Check className="w-4 h-4 inline text-accent" />
                        ) : (
                          <X className="w-4 h-4 inline text-muted-foreground" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection />

      {/* FINAL CTA */}
      <section className="border-t border-border bg-muted/20">
        <div className="max-w-2xl mx-auto px-6 py-24">
          <div className="rounded-3xl bg-gradient-to-br from-accent/15 to-transparent border border-accent p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold">
              Ready to unlock your productivity?
            </h2>

            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Get lifetime access to all tools. No subscriptions, no limits —
              just fast, reliable utilities whenever you need them.
            </p>

            <Link
              href="#"
              className="inline-flex mt-8 rounded-xl bg-accent px-8 py-3 text-sm font-medium text-accent-foreground hover:opacity-90 transition"
            >
              Get Pro for $6 - Lifetime Access 🡪
            </Link>
          </div>
        </div>
      </section>
        <Footer />
    </main>
  );
}
