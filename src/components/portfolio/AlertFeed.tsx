"use client";
import { cn } from "@/lib/cn";
import { ALERT_FEED } from "@/lib/data";
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Info,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const iconMap = {
  opportunity: { Icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  positive: { Icon: CheckCircle2, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  warning: { Icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  info: { Icon: Info, color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20" },
};

export default function AlertFeed() {
  return (
    <div className="space-y-2">
      {ALERT_FEED.map((alert) => {
        const { Icon, color, bg, border } = iconMap[alert.type];
        return (
          <div
            key={alert.id}
            className={cn(
              "rounded-xl p-3.5 border transition-all hover:border-opacity-60",
              bg,
              border
            )}
          >
            <div className="flex gap-3">
              <div className={cn("mt-0.5 shrink-0", color)}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-white leading-snug">{alert.title}</p>
                  <span className="text-xs text-slate-500 shrink-0 mt-0.5">{alert.time}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{alert.body}</p>
                <Link
                  href={alert.actionHref}
                  className={cn(
                    "inline-flex items-center gap-1 text-xs font-medium mt-2 transition-opacity hover:opacity-80",
                    color
                  )}
                >
                  {alert.actionLabel}
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
