"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

type CTA =
  | { label: string; disabled: true }
  | { label: string; onClick: () => void };

type Feature = {
  label: string;
  available: boolean;
};

type PlanCardProps = {
  title: string;
  price: string;
  subtitle?: string;
  originalPrice?: string;
  features: Feature[];
  highlight?: boolean;
  badge?: string;
  cta: CTA;
};

export function PlanCard({
  title,
  price,
  subtitle,
  originalPrice,
  features,
  highlight,
  badge,
  cta,
}: PlanCardProps) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
      className={`relative rounded-2xl p-8 text-left shadow-xl transition
        ${
          highlight
            ? "border border-accent bg-gradient-to-br from-accent/5 to-transparent backdrop-blur-sm"
            : "border border-border hover:bg-gradient-to-br from-accent/10 to-transparent"
        }
      `}
    >
      {badge && (
        <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
          {badge}
        </span>
      )}

      <h3 className="text-xl font-semibold">{title}</h3>

      <div className="mt-4 flex items-end gap-2">
        {originalPrice && (
          <span className="text-md font-semibold text-muted-foreground line-through">
            {originalPrice}
          </span>
        )}
        <span className="text-4xl text-accent font-bold">{price}</span>
        {subtitle && (
          <span className="text-md font-semibold text-muted-foreground">
            {subtitle}
          </span>
        )}
      </div>

      <ul className="mt-6 space-y-3 text-sm">
        {features.map((f) => (
          <li
            key={f.label}
            className={`flex items-center gap-2 ${
              !f.available ? "text-muted-foreground" : ""
            }`}
          >
            {f.available ? (
              <Check className="w-4 h-4 text-accent" />
            ) : (
              <X className="w-4 h-4 text-muted-foreground" />
            )}
            {f.label}
          </li>
        ))}
      </ul>

      {"disabled" in cta ? (
        <button
          disabled
          className="mt-8 w-full rounded-xl bg-muted border border-border px-4 py-3 text-sm font-medium text-muted-foreground cursor-not-allowed"
        >
          {cta.label}
        </button>
      ) : (
        <button
          onClick={cta.onClick}
          className={`mt-8 w-full rounded-xl px-4 py-3 text-sm font-medium transition
            ${
              highlight
                ? "bg-accent text-accent-foreground hover:opacity-90"
                : "border border-border hover:bg-accent hover:text-accent-foreground"
            }
          `}
        >
          {cta.label}
        </button>
      )}
    </motion.div>
  );
}
