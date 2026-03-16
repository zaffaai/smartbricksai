"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Sparkles, Zap, TrendingUp, TrendingDown, Target,
  AlertTriangle, CheckCircle2, Clock, ArrowRight,
  Building2, Shield, Activity, Lock, Flame,
  BarChart3, Star, RefreshCw, BadgePercent, Bell,
} from "lucide-react";
import {
  PORTFOLIO_PROPERTIES,
  ZONE_ALPHAS,
  MARKET_SNAPSHOT,
  calcForesight,
} from "@/lib/data";
import { useDemoAccount } from "@/lib/demo";
import { cn } from "@/lib/cn";

/* ─── Derived portfolio data ─── */
const totalValue = PORTFOLIO_PROPERTIES.reduce((s, p) => s + p.currentValue, 0);
const totalPurchase = PORTFOLIO_PROPERTIES.reduce((s, p) => s + p.purchasePrice, 0);
const totalGainPct = ((totalValue - totalPurchase) / totalPurchase) * 100;
const jvcConcentration = Math.round((PORTFOLIO_PROPERTIES[0].currentValue / totalValue) * 100);
const dlConcentration = Math.round((PORTFOLIO_PROPERTIES[1].currentValue / totalValue) * 100);

const fmt = (v: number) =>
  v >= 1_000_000
    ? `AED ${(v / 1_000_000).toFixed(2)}M`
    : `AED ${(v / 1_000).toFixed(0)}K`;

/* ─── Idea 1: Next Best Actions ─── */
const NEXT_BEST_ACTIONS = [
  {
    id: "nba1",
    priority: "URGENT",
    priorityColor: "text-red-400 bg-red-500/15 border-red-500/30",
    icon: Clock,
    iconColor: "text-red-400",
    title: "Taormina milestone payment due",
    body: "AED 611,997 due in 42 days (Sep 2025). Missing this triggers a RERA penalty clause.",
    aed: 611997,
    aedLabel: "at risk",
    aedColor: "text-red-300",
    cta: "View Payment Plan",
    ctaHref: "/dashboard/portfolio/taormina-majan",
  },
  {
    id: "nba2",
    priority: "HIGH IMPACT",
    priorityColor: "text-amber-400 bg-amber-500/15 border-amber-500/30",
    icon: TrendingUp,
    iconColor: "text-amber-400",
    title: "Switch Autumn 2 to short-term rental",
    body: "AI STR model projects net AED 32,640/yr vs your current AED 21,600 net LT yield — a 51% uplift.",
    aed: 32640,
    aedLabel: "projected annual yield",
    aedColor: "text-amber-300",
    cta: "View STR Plan",
    ctaHref: "/dashboard/portfolio/autumn-jvc/str-plan",
  },
  {
    id: "nba3",
    priority: "OPPORTUNITY",
    priorityColor: "text-blue-400 bg-blue-500/15 border-blue-500/30",
    icon: Star,
    iconColor: "text-blue-400",
    title: "Golden Visa application window is open",
    body: "Your AED 2.85M portfolio exceeds the AED 2M DLD threshold. Start your 10-year visa process now.",
    aed: 2039990,
    aedLabel: "qualifying property value",
    aedColor: "text-blue-300",
    cta: "Start Visa Process",
    ctaHref: "/dashboard/visa",
  },
];

/* ─── Idea 2: Zone Signal Radar ─── */
const ZONE_SIGNALS = [
  {
    id: "zs1",
    zone: "Jumeirah Village Circle",
    signal: "Transaction velocity +34% MoM",
    type: "bullish",
    impact: "+AED 12,400 projected on Autumn 2 (base case)",
    time: "Updated 2h ago",
    badge: "🔥 Hot Zone",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
  {
    id: "zs2",
    zone: "Downtown Dubai",
    signal: "Institutional bulk purchase detected — 7 units same entity",
    type: "bullish",
    impact: "Signal: demand concentration, likely PSF uplift ahead",
    time: "Updated 6h ago",
    badge: "🏛 Institutional",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  },
  {
    id: "zs3",
    zone: "Dubai Land",
    signal: "Off-plan supply pipeline: 1,240 new units registered Q1 2026",
    type: "caution",
    impact: "Supply pressure may dampen alpha in Q3 2026",
    time: "Updated 1d ago",
    badge: "⚠️ Watch",
    badgeColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  },
  {
    id: "zs4",
    zone: "Business Bay",
    signal: "STR occupancy rate up to 84% (peak season)",
    type: "bullish",
    impact: "Yield arbitrage window: LT→STR switch ROI estimated +28%",
    time: "Updated 1d ago",
    badge: "📈 Yield Signal",
    badgeColor: "bg-green-500/20 text-green-300 border-green-500/30",
  },
  {
    id: "zs5",
    zone: "Palm Jumeirah",
    signal: "DLD palm resale comps -4.2% vs 90-day avg",
    type: "bearish",
    impact: "Luxury segment cooling; no direct portfolio exposure",
    time: "Updated 2d ago",
    badge: "📉 Cooling",
    badgeColor: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  },
];

/* ─── Idea 3: Exit Timing Oracle ─── */
const EXIT_ORACLE = PORTFOLIO_PROPERTIES.map((p) => {
  if (p.offPlan) {
    return {
      id: p.id,
      name: p.name,
      zone: p.zone,
      status: "LOCKED" as const,
      statusColor: "text-slate-400 bg-slate-500/15",
      window: "Off-plan — locked until delivery",
      detail: `Earliest exit window: Q4 2027 (handover). Pre-handover resale requires developer NOC.`,
      recommendation: "Hold. Construction at 38%. Early exit before 60% mark forfeits instalment gains.",
      recommendationIcon: Shield,
      score: 20,
    };
  }
  return {
    id: p.id,
    name: p.name,
    zone: p.zone,
    status: "OPEN" as const,
    statusColor: "text-emerald-400 bg-emerald-500/15",
    window: "March – May 2026 · 11 weeks remaining",
    detail:
      "JVC historically peaks in Q1/Q2 (Expo-season migration influx). Current PSF momentum: +3.2% QoQ.",
    recommendation:
      "Sell window is OPEN. Your unrealised gain is +25.7%. Zone alpha trending up — a 6-month hold could add +AED 9K additional gain.",
    recommendationIcon: TrendingUp,
    score: 82,
  };
});

/* ─── Idea 4: Opportunity Board ─── */
const OPPORTUNITIES = [
  {
    id: "op1",
    name: "Binghatti Orchid",
    zone: "Jumeirah Village Circle",
    br: "1 B/R",
    sqft: 710,
    askPrice: 889000,
    buySignal: 87,
    gain5yr: calcForesight(889000, ZONE_ALPHAS["Jumeirah Village Circle"], 5, "base"),
    yieldEst: 8.2,
    benchmarkYield: 6.8,
    tag: "Underpriced vs comps",
    tagColor: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
  },
  {
    id: "op2",
    name: "Reportage Hills",
    zone: "Dubai Land",
    br: "3 B/R",
    sqft: 1540,
    askPrice: 1950000,
    buySignal: 74,
    gain5yr: calcForesight(1950000, ZONE_ALPHAS["Dubai Land"], 5, "base"),
    yieldEst: 7.1,
    benchmarkYield: 6.8,
    tag: "Off-plan early entry",
    tagColor: "text-blue-400 bg-blue-500/15 border-blue-500/30",
  },
  {
    id: "op3",
    name: "Sobha Hartland II",
    zone: "Business Bay",
    br: "2 B/R",
    sqft: 1100,
    askPrice: 2450000,
    buySignal: 91,
    gain5yr: calcForesight(2450000, ZONE_ALPHAS["Business Bay"], 5, "base"),
    yieldEst: 9.1,
    benchmarkYield: 6.8,
    tag: "Highest signal",
    tagColor: "text-amber-400 bg-amber-500/15 border-amber-500/30",
  },
  {
    id: "op4",
    name: "ELARIS Sky",
    zone: "Jumeirah Village Circle",
    br: "1 B/R",
    sqft: 733,
    askPrice: 1057521,
    buySignal: 68,
    gain5yr: calcForesight(1057521, ZONE_ALPHAS["Jumeirah Village Circle"], 5, "base"),
    yieldEst: 7.6,
    benchmarkYield: 6.8,
    tag: "DLD verified comp",
    tagColor: "text-slate-400 bg-slate-500/15 border-slate-500/30",
  },
];

/* ─── Idea 5: Portfolio Rebalancing data ─── */
const REBALANCING = {
  jvcConcentration,
  dlConcentration,
  riskLabel: "ELEVATED" as const,
  riskColor: "text-amber-400",
  recommendation: "DIVERSIFY",
  rationale:
    `Dubai Land represents ${dlConcentration}% of your portfolio AED value (AED ${fmt(PORTFOLIO_PROPERTIES[1].currentValue)}). Zone correlation with JVC is 0.61 — compounding concentrated downside risk. Adding a Business Bay or Downtown asset lowers concentration to ~40% and broadens alpha exposure.`,
  projectedUplift: 41200,
  action: "Explore Business Bay for next acquisition",
  actionHref: "/dashboard/property",
};

/* ─── Idea 6: Smart Benchmarking ─── */
const BENCHMARKS = [
  {
    label: "Portfolio ROI",
    yours: totalGainPct.toFixed(1),
    zone: "JVC avg",
    zoneValue: "14.2",
    unit: "%",
    ahead: true,
    delta: +(totalGainPct - 14.2).toFixed(1),
  },
  {
    label: "Gross Yield (ready assets)",
    yours: "7.9",
    zone: "Platform avg",
    zoneValue: "6.8",
    unit: "%",
    ahead: true,
    delta: 1.1,
  },
  {
    label: "Wealth Score",
    yours: "724",
    zone: "Platform median",
    zoneValue: "641",
    unit: "pts",
    ahead: true,
    delta: 83,
  },
];

/* ─── Idea 7: AI Weekly Briefing data ─── */
const BRIEFING_LINES = [
  `Your portfolio gained AED ${fmt(totalValue - totalPurchase).replace("AED ", "")} (+${totalGainPct.toFixed(1)}%) since purchase — tracking ${totalGainPct > 20 ? "above" : "at"} the Dubai residential CAGR.`,
  "JVC transaction velocity is up 34% week-on-week. Your Autumn 2 unit is benefitting from zone momentum — unrealised gain now AED 164,438.",
  "AI model flags: switching Autumn 2 to STR could net AED 32,640/yr — a 51% yield uplift over your current LT rent. STR Plan awaits your review.",
];

/* ══════════════════════════════════════════
   PAGE COMPONENT
══════════════════════════════════════════ */
export default function IntelligencePage() {
  const { tier } = useDemoAccount();
  const isPro = tier !== "free";
  const [activeSignal, setActiveSignal] = useState<string | null>(null);

  return (
    <div className="foresight-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI-POWERED
              </span>
            </div>
            <h1 className="text-xl font-bold text-white">Intelligence Center</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Recommendations, market signals & next best actions · {MARKET_SNAPSHOT.date}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-400 hover:bg-white/10 transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh signals</span>
            </button>
            <span className="text-xs text-slate-500 bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
              Updated {new Date().toLocaleTimeString("en-AE", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>

        {/* ══ IDEA 7: AI Weekly Briefing ══ */}
        <div className="rounded-2xl border border-blue-500/20 bg-linear-to-r from-blue-600/10 via-blue-500/5 to-transparent p-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4.5 h-4.5 text-blue-400" style={{ width: "18px", height: "18px" }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-bold text-white">Your Monday Intelligence Briefing</p>
                <span className="text-[10px] text-blue-400 bg-blue-500/15 border border-blue-500/20 px-1.5 py-0.5 rounded-full">AI GENERATED</span>
              </div>
              <ul className="space-y-1.5">
                {BRIEFING_LINES.map((line, i) => (
                  <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5 shrink-0">{"0" + (i + 1)}.</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[10px] text-slate-500 mt-3">
                Generated by SmartBricks AI · March 16, 2026 · Based on live portfolio + DLD market data
              </p>
            </div>
          </div>
        </div>

        {/* ══ IDEA 1: Next Best Actions ══ */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white">Next Best Actions</h2>
            <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
              Ranked by urgency × AED impact
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {NEXT_BEST_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <div
                  key={action.id}
                  className="rounded-2xl border border-white/10 bg-white/3 p-4 flex flex-col gap-3 hover:border-white/20 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center border", action.priorityColor.split(" ").slice(1).join(" "))}>
                      <Icon className={cn("w-4 h-4", action.iconColor)} />
                    </div>
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border", action.priorityColor)}>
                      {action.priority}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white mb-1">{action.title}</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{action.body}</p>
                  </div>
                  <div className="mt-auto">
                    <p className={cn("text-lg font-bold tabular-nums", action.aedColor)}>
                      {fmt(action.aed)}
                    </p>
                    <p className="text-[10px] text-slate-500">{action.aedLabel}</p>
                  </div>
                  <Link
                    href={action.ctaHref}
                    className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-semibold hover:bg-white/10 transition-colors"
                  >
                    {action.cta}
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* ══ IDEA 5 + 6: Rebalancing + Benchmarking ══ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Idea 5: Portfolio Rebalancing Assistant */}
          <div className="rounded-2xl border border-white/10 bg-white/3 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white">Portfolio Rebalancing Assistant</h2>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 rounded-full ml-auto">
                {REBALANCING.riskLabel}
              </span>
            </div>

            {/* Concentration bars */}
            <div className="space-y-2">
              <p className="text-xs text-slate-400">Zone concentration</p>
              {[
                { label: "Dubai Land (Taormina)", pct: REBALANCING.dlConcentration, color: "bg-amber-500" },
                { label: "Jumeirah Village Circle (Autumn 2)", pct: REBALANCING.jvcConcentration, color: "bg-blue-500" },
              ].map((z) => (
                <div key={z.label}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-slate-400">{z.label}</span>
                    <span className="text-white font-semibold">{z.pct}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", z.color)} style={{ width: `${z.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-3">
              <p className="text-xs text-slate-300 leading-relaxed">{REBALANCING.rationale}</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Projected uplift if diversified</p>
                <p className="text-base font-bold text-emerald-400">+AED {REBALANCING.projectedUplift.toLocaleString()}</p>
              </div>
              <Link
                href={REBALANCING.actionHref}
                className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/20 border border-amber-500/30 rounded-xl text-xs text-amber-300 font-semibold hover:bg-amber-500/30 transition-colors"
              >
                Explore zones
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Idea 6: Smart Benchmarking Feed */}
          <div className="rounded-2xl border border-white/10 bg-white/3 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-bold text-white">Smart Benchmarking</h2>
            </div>

            <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <p className="text-xs text-emerald-300 font-medium">
                You&apos;re in the <strong>top 18%</strong> of tracked JVC investors this quarter
              </p>
            </div>

            <div className="space-y-3">
              {BENCHMARKS.map((b) => (
                <div key={b.label} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400 mb-0.5">{b.label}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-bold text-white tabular-nums">
                        {b.yours}{b.unit}
                      </span>
                      <span className="text-xs text-slate-500">vs {b.zone} {b.zoneValue}{b.unit}</span>
                    </div>
                  </div>
                  <span className={cn(
                    "text-xs font-bold px-2 py-1 rounded-lg shrink-0",
                    b.ahead ? "text-emerald-400 bg-emerald-500/15" : "text-red-400 bg-red-500/15"
                  )}>
                    {b.ahead ? "+" : ""}{b.delta}{b.unit}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-3">
              <p className="text-[10px] text-slate-500">
                Benchmarks computed from aggregated, anonymised platform data.{" "}
                <span className="text-blue-400">500+ UAE investor portfolios tracked.</span>
              </p>
            </div>
          </div>
        </div>

        {/* ══ IDEA 2: Zone Signal Radar ══ */}
        <div className="rounded-2xl border border-white/10 bg-white/3 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-bold text-white">Zone Signal Radar</h2>
            <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10 ml-auto">
              Filtered to your zones + watchlist
            </span>
          </div>

          <div className="space-y-2">
            {ZONE_SIGNALS.map((sig) => (
              <button
                key={sig.id}
                onClick={() => setActiveSignal(activeSignal === sig.id ? null : sig.id)}
                className="w-full text-left rounded-xl border border-white/8 bg-white/3 px-4 py-3 hover:border-white/15 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-xs font-semibold text-white">{sig.zone}</span>
                      <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full border", sig.badgeColor)}>
                        {sig.badge}
                      </span>
                      <span className="text-[10px] text-slate-500 ml-auto">{sig.time}</span>
                    </div>
                    <p className="text-xs text-slate-300">{sig.signal}</p>
                    {activeSignal === sig.id && (
                      <p className="text-xs text-blue-300 mt-2 pl-2 border-l border-blue-500/40">
                        Portfolio impact: {sig.impact}
                      </p>
                    )}
                  </div>
                  <span className="text-slate-500 text-[10px] shrink-0 mt-0.5">
                    {activeSignal === sig.id ? "▲" : "▼"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ══ IDEA 3: Exit Timing Oracle ══ */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">Exit Timing Oracle</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EXIT_ORACLE.map((prop) => {
              const RecIcon = prop.recommendationIcon;
              const scoreColor =
                prop.score >= 70
                  ? "text-emerald-400"
                  : prop.score >= 40
                  ? "text-amber-400"
                  : "text-slate-400";
              const arcFill = `conic-gradient(${
                prop.score >= 70 ? "#10b981" : prop.score >= 40 ? "#f59e0b" : "#64748b"
              } ${prop.score * 3.6}deg, rgba(255,255,255,0.06) 0deg)`;
              return (
                <div key={prop.id} className="rounded-2xl border border-white/10 bg-white/3 p-5">
                  <div className="flex items-start gap-4">
                    {/* Sell-window dial */}
                    <div className="shrink-0 flex flex-col items-center gap-1">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center relative"
                        style={{
                          background: arcFill,
                          padding: "3px",
                        }}
                      >
                        <div className="w-full h-full rounded-full bg-[#0a0e1a] flex items-center justify-center">
                          <span className={cn("text-lg font-bold tabular-nums", scoreColor)}>
                            {prop.score}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400">sell score</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-sm font-bold text-white">{prop.name}</p>
                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", prop.statusColor)}>
                          {prop.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">{prop.zone}</p>
                      {prop.status === "OPEN" && (
                        <p className="text-xs text-emerald-300 font-medium mb-2">
                          ⏰ {prop.window}
                        </p>
                      )}
                      <p className="text-xs text-slate-400 leading-relaxed">{prop.detail}</p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl border border-white/8 bg-white/3 p-3 flex items-start gap-2">
                    <RecIcon className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-300">{prop.recommendation}</p>
                  </div>

                  <Link
                    href={`/dashboard/portfolio/${prop.id}`}
                    className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-semibold hover:bg-white/10 transition-colors"
                  >
                    View property <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* ══ IDEA 4: Opportunity Board ══ */}
        <div className="rounded-2xl border border-white/10 bg-white/3 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white">Opportunity Board</h2>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 rounded-full ml-auto flex items-center gap-1">
              {!isPro && <Lock className="w-2.5 h-2.5" />} PRO
            </span>
          </div>
          <p className="text-xs text-slate-400">
            AI-ranked acquisition targets based on buy signal strength, 5-yr projected gain, and yield vs benchmark.
          </p>

          <div className="relative">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/10">
                    {["Property", "Zone", "Ask Price", "Buy Signal", "5-Yr Gain (Base)", "Est. Yield", "vs Bench"].map((h) => (
                      <th key={h} className="text-left text-slate-400 pb-2 pr-4 font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className={cn("space-y-1", !isPro && "blur-sm pointer-events-none select-none")}>
                  {OPPORTUNITIES.map((op) => {
                    const gain5 = op.gain5yr - op.askPrice;
                    const gain5pct = ((gain5 / op.askPrice) * 100).toFixed(1);
                    return (
                      <tr key={op.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                        <td className="py-2.5 pr-4">
                          <div>
                            <p className="text-white font-semibold">{op.name}</p>
                            <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full border", op.tagColor)}>
                              {op.tag}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 pr-4 text-slate-300 whitespace-nowrap">{op.zone}</td>
                        <td className="py-2.5 pr-4 text-white font-semibold tabular-nums whitespace-nowrap">
                          {fmt(op.askPrice)}
                        </td>
                        <td className="py-2.5 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="w-14 h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className={cn("h-full rounded-full", op.buySignal >= 80 ? "bg-emerald-500" : op.buySignal >= 65 ? "bg-amber-500" : "bg-slate-500")}
                                style={{ width: `${op.buySignal}%` }}
                              />
                            </div>
                            <span className={cn("font-bold tabular-nums", op.buySignal >= 80 ? "text-emerald-400" : op.buySignal >= 65 ? "text-amber-400" : "text-slate-400")}>
                              {op.buySignal}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 pr-4 text-emerald-400 font-semibold tabular-nums whitespace-nowrap">
                          +{gain5pct}%
                        </td>
                        <td className="py-2.5 pr-4 text-white tabular-nums">{op.yieldEst}%</td>
                        <td className="py-2.5 pr-4">
                          <span className={cn(
                            "font-bold tabular-nums",
                            op.yieldEst > op.benchmarkYield ? "text-emerald-400" : "text-red-400"
                          )}>
                            {op.yieldEst > op.benchmarkYield ? "+" : ""}{(op.yieldEst - op.benchmarkYield).toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pro gate overlay */}
            {!isPro && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0e1a]/70 backdrop-blur-sm rounded-xl mt-8">
                <Lock className="w-5 h-5 text-amber-400 mb-2" />
                <p className="text-sm font-bold text-white">Opportunity Board · Pro Feature</p>
                <p className="text-xs text-slate-400 mt-1 text-center max-w-xs">
                  AI-ranked buy signals, 5-yr projections, and yield benchmarking for every active listing.
                </p>
                <Link
                  href="/dashboard/foresight/report"
                  className="mt-3 px-4 py-2 bg-amber-500 text-black text-xs font-bold rounded-xl hover:bg-amber-400 transition-colors"
                >
                  Unlock with Pro · AED 149/mo
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* CTA strip */}
        <div className="rounded-2xl border border-blue-500/20 bg-blue-600/5 p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white">Get weekly Intelligence Briefings by email</p>
              <p className="text-xs text-slate-400">Portfolio snapshot, zone signals, and 1 priority action — every Monday 07:00 GST.</p>
            </div>
          </div>
          <Link
            href="https://calendly.com/d/csz4-4hq-m39/smart-bricks-investment-consultation"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Subscribe · Free
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
