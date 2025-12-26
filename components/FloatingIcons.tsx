import { cn } from "@/lib/utils";

const ICON_STYLES = [
  { bg: "bg-blue-500/15", text: "text-blue-500", shadow: "shadow-blue-500/30" },
  { bg: "bg-emerald-500/15", text: "text-emerald-500", shadow: "shadow-emerald-500/30" },
  { bg: "bg-violet-500/15", text: "text-violet-500", shadow: "shadow-violet-500/30" },
  { bg: "bg-pink-500/15", text: "text-pink-500", shadow: "shadow-pink-500/30" },
  { bg: "bg-orange-500/15", text: "text-orange-500", shadow: "shadow-orange-500/30" },
  { bg: "bg-cyan-500/15", text: "text-cyan-500", shadow: "shadow-cyan-500/30" },
  { bg: "bg-pink-500/15", text: "text-pink-500", shadow: "shadow-pink-500/30" },
];

// manual positions around search (circle-ish)
const POSITIONS = [
  // LEFT CLUSTER (upper, slightly tight)
 { top: "-2%", left: "4%" },
  { top: "-12%", left: "-6%" },
  { top: "12%", left: "-10%" },
 { top: "16%", left: "-4%" },
  { top: "25%", left: "7%" },


  // RIGHT CLUSTER (upper, slightly tight)
  { top: "-2%", right: "4%" },
  { top: "-12%", right: "-6%" },
  { top: "12%", right: "-10%" },
 { top: "16%", right: "-4%" },
  { top: "25%", right: "7%" },
];


export default function FloatingIcons({ icons }: { icons: any[] }) {
  return (
    <div className="absolute inset-0 pointer-events-none hidden md:block">
      {icons.slice(0, POSITIONS.length).map((Icon, index) => {
        const style = ICON_STYLES[index % ICON_STYLES.length];
        const pos = POSITIONS[index];

        return (
          <div
            key={index}
            className="absolute animate-float"
            style={{
              ...pos,
              animationDelay: `${index * 0.6}s`,
            }}
          >
            <div
              className={cn(
                "flex items-center justify-center",
                "size-14 rounded-2xl",
                style.bg,
                style.shadow,
                "shadow-lg"
              )}
            >
              <Icon className={cn("size-6", style.text)} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
