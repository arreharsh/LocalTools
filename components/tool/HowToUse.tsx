import { Info, Lightbulb } from "lucide-react";

type HowToUseProps = {
  title?: string;
  steps: string[];
  tip?: string;
};

export default function HowToUse({
  title = "How to Use",
  steps,
  tip,
}: HowToUseProps) {
  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 px-5 py-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 text-primary font-medium">
        <Info className="w-4 h-4" />
        {title}
      </div>

      {/* Steps */}
      <p className="text-sm text-foreground leading-relaxed">
        {steps.map((step, i) => (
          <span key={i}>
            <span className="font-medium">{i + 1}.</span> {step}
            {i !== steps.length - 1 && " → "}
          </span>
        ))}
      </p>

      {/* Tip */}
      {tip && (
        <div className="flex items-start gap-2 text-sm text-primary">
          <Lightbulb className="w-4 h-4 mt-0.5" />
          <span>{tip}</span>
        </div>
      )}
    </div>
  );
}
