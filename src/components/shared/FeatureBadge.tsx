import { cn } from "@/lib/cn";
import { Sparkles, Zap, Clock, CheckCircle2 } from "lucide-react";
import type { ComponentType } from "react";

export type BadgeVariant = "live" | "ai" | "proposed" | "coming-soon";

const MAP: Record<
  BadgeVariant,
  { label: string; cls: string; icon: ComponentType<{ className?: string }> }
> = {
  live: {
    label: "LIVE",
    cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    icon: CheckCircle2,
  },
  ai: {
    label: "AI",
    cls: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    icon: Sparkles,
  },
  proposed: {
    label: "PROPOSED",
    cls: "bg-amber-500/10 text-amber-300 border-amber-500/30 border-dashed",
    icon: Zap,
  },
  "coming-soon": {
    label: "SOON",
    cls: "bg-slate-500/10 text-slate-400 border-slate-600/30",
    icon: Clock,
  },
};

export default function FeatureBadge({
  variant,
  className,
}: {
  variant: BadgeVariant;
  className?: string;
}) {
  const { label, cls, icon: Icon } = MAP[variant];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full border uppercase tracking-wider",
        cls,
        className
      )}
    >
      <Icon className="w-2.5 h-2.5" />
      {label}
    </span>
  );
}
