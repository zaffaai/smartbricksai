"use client";
import { cn } from "@/lib/cn";
import { INTELLIGENCE_CARDS } from "@/lib/data";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const badgeColors: Record<string, string> = {
  green: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  amber: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  blue: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
};

export default function IntelligenceCards() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
          AI Detected
        </span>
      </div>
      {INTELLIGENCE_CARDS.map((card) => (
        <div
          key={card.id}
          className="intelligence-card rounded-xl border p-4 bg-white/3 hover:bg-white/6 transition-all cursor-default"
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <span className={cn("text-[11px] px-2 py-0.5 rounded-full font-semibold", badgeColors[card.badgeColor])}>
              {card.badge}
            </span>
          </div>
          <p className="text-sm font-semibold text-white leading-snug mb-1">
            {card.headline}
          </p>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">{card.sub}</p>
          <Link
            href={card.ctaHref}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            {card.cta}
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      ))}
    </div>
  );
}
