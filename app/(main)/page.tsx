"use client";

import Link from "next/link";
import Testimonials from "@/components/Testimonials";
import { ArrowRight, Sparkles, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Footer } from "@/components/footer";
import { PricingSection } from "@/components/PricingSection";
import ShinyText from "@/components/ui/ShinyText";
import BlurText from "@/components/BlurText";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};
const MotionLink = motion(Link);



export default function HomePage() {
  return (
    <main className="min-h-screen bg-background  text-foreground">
      {/* HERO */}

      <div className="relative w-full overflow-hidden">
        {/* Grid background */}
        <div
          className={cn(
            "absolute inset-0",
            "[background-size:40px_40px]",
            "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
            "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
          )}
        />

        {/* Radial fade */}
        <div className="pointer-events-none absolute inset-0 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_25%,black)] dark:bg-black" />

        {/* HERO CONTENT (UNCHANGED) */}
        <section className="relative z-9 max-w-7xl mx-auto px-6 pb-20 pt-24 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center text-accent gap-2 px-4 py-1 mb-6 backdrop-blur-sm rounded-full bg-green-500/10 border-green-200/20 border border-border text-sm"
          >
            <ShinyText
              text="Privacy-first utility tools"
              speed={2}
              delay={0}
              color={`#000000ff  `}
              shineColor="#ffffffff"
              spread={120}
              direction="left"
              pauseOnHover
              className="font-medium"
            />
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight"
          >
            <div className="mx-auto text-center">
              <span className="block">
                <BlurText
                  className="inline-block text-foreground mb-2 "
                  text="Powerful tools"
                />
              </span>

              <span className="block sm:hidden">
                <BlurText
                  className="inline-block text-accent mb-2"
                  text="Your data never leaves your device"
                />
              </span>

              <span className="hidden sm:block">
                <BlurText
                  className="inline-block text-accent mb-2"
                  text="Your data never leaves"
                />
              </span>

              <span className="hidden sm:block">
                <BlurText
                  className="inline-block text-accent mb-2"
                  text="your device"
                />
              </span>
            </div>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mt-6 mx-auto max-w-sm text-sm md:text-base text-muted-foreground"
          >
            {/* subtle glass box */}
            <span
              className="
      absolute inset-0 -z-10 rounded-xl
       backdrop-blur-[2px]
    "
            />

            <span className="block px-5 py-3 text-center">
              High-quality tools directly in your browser.
              <br />
              No uploads. No tracking. No ads.
            </span>
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex justify-center gap-4"
          >
            <MotionLink
              href="/tools"
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="inline-flex shadow-md items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-medium text-accent-foreground"
            >
              Explore tools
              <ArrowRight className="w-4 h-4" />
            </MotionLink>

            <MotionLink
              href="/tools/invoice-generator"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="inline-flex shadow-md items-center gap-2 backdrop-blur-sm rounded-xl border px-6 py-3 text-sm font-medium hover:bg-muted"
            >
              Try tools instantly
            </MotionLink>
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
                className="rounded-2xl border border-border backdrop-blur-sm shadow-sm p-6"
              >
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>

      {/*  VALUE SECTION  */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-24 bg-gradient-to-br from-accent/5 to-transparent ">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-2xl md:text-3xl font-semibold">
            Everything you need to get work done - fast
          </h2>

          <p className="mt-4 text-muted-foreground text-base">
            Practical tools for JSON, PDFs, APIs and everyday tasks.
            <br className="hidden sm:block" />
            No installs. No uploads. No tracking.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.08 }}
          className="mt-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        >
          {[
            {
              title: "Format & validate JSON",
              desc: "Clean, readable JSON with instant validation.",
            },
            {
              title: "Edit, merge & reorder PDFs",
              desc: "Handle PDFs directly in your browser.",
            },
            {
              title: "Generate invoices instantly",
              desc: "Simple invoices without complex software.",
            },
            {
              title: "Test APIs locally",
              desc: "Send requests and inspect responses fast.",
            },
            {
              title: "Decode & encode tokens",
              desc: "JWT, Base64 and common encodings.",
            },
            {
              title: "Small tools for daily work",
              desc: "Focused utilities that save time.",
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              whileHover={{
                rotateX: 6,
                rotateY: -6,
                scale: 1.04,
              }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              style={{ transformStyle: "preserve-3d" }}
              className="group relative rounded-2xl border border-border bg-card/40 p-6 shadow-sm"
            >
              {/* subtle glow layer */}
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition"
                style={{
                  background:
                    "radial-gradient(600px at 50% 0%, hsl(var(--accent) / 0.15), transparent 70%)",
                  transform: "translateZ(-1px)",
                }}
              />

              <div style={{ transform: "translateZ(20px)" }}>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* PRICING */}
      <PricingSection />

      {/* TESTIMONIALS */}
      <Testimonials />
      {/* FOOTER */}
      <Footer />
    </main>
  );
}
