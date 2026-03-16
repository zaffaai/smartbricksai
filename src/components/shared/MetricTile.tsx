"use client";
import { ReactNode } from "react";
import { cn } from "@/lib/cn";
import InfoTooltip from "@/components/shared/InfoTooltip";

interface MetricTileProps {
  label: string;
  value: string;
  sub?: string;
  subPositive?: boolean;
  icon?: ReactNode;
  accent?: "blue" | "green" | "amber" | "slate";
  tooltip?: string;
}

const accents = {
  blue: "border-blue-500/20 bg-blue-500/5",
  green: "border-emerald-500/20 bg-emerald-500/5",
  amber: "border-amber-500/20 bg-amber-500/5",
  slate: "border-slate-700 bg-white/3",
};

export default function MetricTile({
  label,
  value,
  sub,
  subPositive,
  icon,
  accent = "slate",
  tooltip,
}: MetricTileProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-5 flex flex-col gap-3 transition-all hover:scale-[1.01]",
        accents[accent]
      )}
    >
      {icon && <div className="text-slate-400">{icon}</div>}
      <div>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1 flex items-center gap-1">
          {label}
          {tooltip && <InfoTooltip content={tooltip} side="bottom" />}
        </p>
        <p className="text-2xl font-bold text-white leading-tight">{value}</p>
        {sub && (
          <p
            className={cn(
              "text-xs mt-1 font-medium",
              subPositive ? "text-emerald-400" : subPositive === false ? "text-red-400" : "text-slate-400"
            )}
          >
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}
