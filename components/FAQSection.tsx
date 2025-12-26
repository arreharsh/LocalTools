"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    sr: "01",
    q: "Do I need an account to use the tools?",
    a: "No. Most tools work instantly without signup. You only need to pay if you want Pro access.",
  },
  {
    sr: "02",
    q: "Is my data safe?",
    a: "Yes. All processing happens locally in your browser. Your data is never uploaded or stored on our servers.",
  },
  {
    sr: "03",
    q: "What happens after the 3-Day Pass ends?",
    a: "Your access expires automatically. You can upgrade to Lifetime anytime without losing anything.",
  },
  {
    sr: "04",
    q: "Is the Lifetime plan really one-time?",
    a: "Absolutely. Pay once and get access to all current and future tools forever.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="border-t border-border">
      <div className="max-w-4xl mx-auto px-6 py-24">
        <h2 className="text-2xl font-semibold text-center">
          Frequently Asked Questions
        </h2>

        <div className="mt-12 space-y-4">
          {faqs.map((item, i) => {
            const isOpen = open === i;

            return (
              <div
                key={item.q}
                className="rounded-2xl border border-border bg-card/40"
              >
                {/* QUESTION */}
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-2xl font-semibold text-muted-foreground">
                      {item.sr}
                    </span>

                    <span className="font-medium text-sm">{item.q}</span>
                  </span>

                  {/* RIGHT ICON */}
                  <span>
                    {isOpen ? (
                      <Minus className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Plus className="w-5 h-5 text-muted-foreground" />
                    )}
                  </span>
                </button>

                {/* ANSWER */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-sm text-muted-foreground">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}