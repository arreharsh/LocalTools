"use client";

import Link from "next/link";
import Testimonials from "@/components/Testimonials";
import { ArrowRight, Sparkles, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Footer } from "@/components/footer";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pb-20 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1 mb-6 rounded-full bg-green-500/10 border-green-200/20 border border-border text-sm"
        >
          {/* <img src="/logo.png" alt="Sparkles" className="w-4 h-4" />  baad me use krunga */}
          <Sparkles className="w-4 h-4" />
          Privacy-first utility tools
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold tracking-tight"
        >
          Powerful tools <br className="hidden sm:block" />
          <span className="text-accent">Zero data tracking</span>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          A growing collection of local tools that run entirely in your browser Your data never
          leaves your device <span className="text-accent">″</span>Privacy focused — no tracking, no ads<span className="text-accent">″</span>
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex justify-center gap-4"
        >
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:opacity-90 transition"
          >
            Explore Tools
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/tools/json-formatter"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-medium hover:bg-muted transition"
          >
            Try JSON Formatter
          </Link>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              title: "Built for real workflows",
              desc: "High-usage tools like JSON, APIs and PDFs — not random gimmicks.",
            },
            {
              title: "Fast & distraction-free",
              desc: "No clutter, no ads. Just tools that do one thing really well.",
            },
            {
              title: "Privacy-first by design",
              desc: "Your data stays in your browser. Nothing is stored.",
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              className="rounded-2xl border border-border bg-card/40 p-6"
            >
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* PRICING */}
      <section className="border-t  bg-gradient-to-br from-foreground/3 to-transparent">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-2xl md:text-3xl font-semibold"
          >
            Simple, honest pricing
          </motion.h2>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ delay: 0.1 }}
            className="mt-3 text-muted-foreground"
          >
            Try it first or get lifetime access — no subscriptions
          </motion.p>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.2 }}
            className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {/* 3 DAY PASS */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border border-border hover:bg-gradient-to-br from-accent/10 to-transparent p-8 text-left transition"
            >
              <h3 className="text-xl font-semibold">3-Day Pass</h3>

              <div className="mt-4 flex items-end gap-2">
                <span className="text-4xl text-accent font-bold">$2</span>
                <span className="text-md font-semibold text-muted-foreground">
                  / 3 days
                </span>
              </div>

              <ul className="mt-6 space-y-3 text-sm">
                {[
                  "All tools unlocked for 3 days",
                  "Support for large JSON & files",
                  "Access to API & developer utilities",
                  "Fast performance with no limits",
                  "No ads, no tracking, no clutter",
                  "Works fully in your browser",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="#"
                className="mt-8 block w-full rounded-xl border border-border px-4 py-3 text-center text-sm font-medium hover:bg-accent hover:text-accent-foreground transition"
              >
                Get 3-Day Pass
              </Link>
            </motion.div>

            {/* LIFETIME */}
            <motion.div
              variants={fadeUp}
              className="relative rounded-2xl border border-accent bg-gradient-to-br from-accent/5 to-transparent backdrop-blur-sm p-8 text-left"
            >
              <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                Best Value
              </span>

              <h3 className="text-xl font-semibold">Pro Lifetime</h3>

              <div className="mt-4 flex items-end gap-2">
                <span className="text-md font-semibold text-muted-foreground line-through">
                  $20
                </span>
                <span className="text-4xl text-accent font-bold">$6</span>
              </div>

              <ul className="mt-6 space-y-3 text-sm">
                {[
                  "Unlimited access to all tools",
                  "Large JSON & heavy file support",
                  "Advanced API & developer utilities",
                  "Early access to upcoming tools",
                  "Privacy-first, browser-only processing",
                  "No ads, no subscriptions, ever",
                  "Lifetime updates included",
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
        </div>
      </section>

      {/* TESTIMONIALS */}
      <Testimonials />
      {/* FOOTER */}
      <Footer />
    </main>
  );
}
