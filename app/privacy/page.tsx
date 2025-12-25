"use client";

import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function PrivacyPolicyPage() {
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
            className="inline-flex items-center pb-4 gap-2 text-sm text-muted-foreground hover:text-foreground transition"
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
          Privacy Policy
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.1 }}
          className="mt-3 text-muted-foreground max-w-2xl"
        >
          This policy explains what information we collect, how it is used, and
          the choices you have regarding your data.
        </motion.p>
      </section>

      {/* CONTENT CARD */}
      <section className="max-w-5xl mx-auto px-6 pb-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="rounded-2xl border box-shadow shadow border-border bg-card/40 p-8 md:p-10 space-y-10"
        >
          {/* INFORMATION WE COLLECT */}
          <div>
            <h2 className="text-xl font-semibold">
              Information We Collect
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>
                We do not collect personal information unless you voluntarily
                provide it (for example, during payments or support requests).
              </li>
              <li>
                Most tools run entirely in your browser. The data you process is
                not uploaded or stored on our servers.
              </li>
              <li>
                Basic, anonymous usage data may be collected to improve
                performance and reliability.
              </li>
            </ul>
          </div>

          {/* HOW WE USE INFORMATION */}
          <div>
            <h2 className="text-xl font-semibold">
              How We Use Information
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>
                To operate, maintain, and improve our tools and services.
              </li>
              <li>
                To process payments and provide access to paid features.
              </li>
              <li>
                To respond to support requests and communicate important updates.
              </li>
            </ul>
          </div>

          {/* YOUR RIGHTS */}
          <div>
            <h2 className="text-xl font-semibold">
              Your Rights
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>
                You may request access to or deletion of any personal information
                you have shared with us.
              </li>
              <li>
                You can choose not to provide certain information, though this
                may limit access to paid features.
              </li>
              <li>
                You have the right to contact us regarding privacy-related
                concerns at any time.
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h2 className="text-xl font-semibold">
              Contact
            </h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy or how your
              data is handled, please contact us at <a className="font-medium text-accent hover:underline" href="mailto:support@example.com">support@example.com</a>
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
