"use client";

import { motion } from "framer-motion";
import { Footer } from "@/components/footer";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";


const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function RefundPolicyPage() {
  const lastUpdated = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
    const router = useRouter();

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* HEADER */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-12">
        <div className="flex justify-start pb-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm pb-4 text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to home
          </button>
        </div>
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-3xl md:text-4xl font-bold tracking-tight"
        >
          Refund Policy
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.1 }}
          className="mt-3 text-muted-foreground max-w-2xl"
        >
          This policy explains when refunds are applicable and how refund
          requests are handled.
        </motion.p>
      </section>

      {/* CONTENT CARD */}
      <section className="max-w-5xl mx-auto px-6 pb-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="rounded-2xl box-shadow shadow border border-border bg-card/40 p-8 md:p-10 space-y-10"
        >
          {/* ELIGIBILITY */}
          <div>
            <h2 className="text-xl font-semibold">
              Refund Eligibility
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>
                Refunds are only applicable to paid plans, such as the 3-Day
                Pass or Lifetime access.
              </li>
              <li>
                Refund requests must be submitted within a reasonable time
                after purchase and before excessive usage.
              </li>
            </ul>
          </div>

          {/* NON-REFUNDABLE CASES */}
          <div>
            <h2 className="text-xl font-semibold">
              Non-Refundable Cases
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>
                Refunds are not provided if the service has been used
                extensively after purchase.
              </li>
              <li>
                Issues caused by misuse, unsupported environments, or user
                error are not eligible.
              </li>
              <li>
                Change of mind after significant usage may not qualify for a
                refund.
              </li>
            </ul>
          </div>

          {/* HOW TO REQUEST */}
          <div>
            <h2 className="text-xl font-semibold">
              How to Request a Refund
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>
                Contact our support team with your purchase details and reason
                for the request.
              </li>
              <li>
                Refund requests are reviewed on a case-by-case basis.
              </li>
              <li>
                If approved, refunds are processed using the original payment
                method.
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h2 className="text-xl font-semibold">
              Contact
            </h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              For refund-related questions or requests, please reach out to us
              at:
            </p>
            <p className="mt-2 text-sm">
              <span className="font-medium">Email:</span>{" "}
              <a
                href="mailto:support@example.com"
                className="text-accent hover:underline"
              >
                support@example.com
              </a>
            </p>
          </div>

          {/* LAST UPDATED */}
          <div className="pt-6 border-t border-border text-xs text-muted-foreground">
            Last updated: {lastUpdated}
          </div>
        </motion.div>
      </section>
        <Footer />
    </main>
  );
}
