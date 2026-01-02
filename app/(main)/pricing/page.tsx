"use client";

import Link from "next/link";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";
import FAQSection from "@/components/FAQSection";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { PricingSection } from "@/components/PricingSection";
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

      <PricingSection />

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
      <section className=" border-border bg-background">
        <div className="max-w-2xl mx-auto px-6 py-24">
          <div className="rounded-3xl bg-gradient-to-br from-accent/15 to-transparent shadow-md border border-accent p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold">
              Ready to unlock your productivity?
            </h2>

            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Get lifetime access to all tools. No subscriptions, no limits —
              just fast, reliable utilities whenever you need them.
            </p>

            <Link
              href="/billing?plan=pro"
              className="inline-flex items-center gap-2 mt-8 rounded-xl bg-accent px-8 py-3 text-sm font-medium text-accent-foreground hover:opacity-90 transition"
            >
              Get Pro for
              <span className="line-through text-xs opacity-70">₹999</span>
              <span className="text-base font-semibold">₹499</span>
              <span className="text-xs">- Lifetime Access 🡪</span>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
