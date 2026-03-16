"use client";
import { PORTFOLIO_PROPERTIES, calcForesight, BASE_CAGR, BETA_MACRO, DELTA_RISK, ZONE_ALPHAS } from "@/lib/data";
import { useDemoAccount } from "@/lib/demo";
import ForesightChart from "@/components/foresight/ForesightChart";
import { useState } from "react";
import { InlineMath, BlockMath } from "react-katex";
import { cn } from "@/lib/cn";
import { Lock, FileText, Download, Star } from "lucide-react";
import Link from "next/link";
import InfoTooltip from "@/components/shared/InfoTooltip";

const fmt = (v: number) =>
  v >= 1000000
    ? `AED ${(v / 1000000).toFixed(2)}M`
    : `AED ${(v / 1000).toFixed(0)}K`;

export default function ForesightPage() {
  const [selectedPropIdx, setSelectedPropIdx] = useState(0);
  const prop = PORTFOLIO_PROPERTIES[selectedPropIdx];
  const { tier, account } = useDemoAccount();
  const isFree = tier === "free";

  const bear5 = calcForesight(prop.currentValue, prop.alphaZone, 5, "bear");
  const base5 = calcForesight(prop.currentValue, prop.alphaZone, 5, "base");
  const bull5 = calcForesight(prop.currentValue, prop.alphaZone, 5, "bull");

  return (
    <div className="foresight-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold">
                PRO FEATURE
              </span>
            </div>
            <h1 className="text-xl font-bold text-white">Smartbricks Foresight</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              5-year property value prediction engine · UAE market
            </p>
          </div>
          <Link
            href="/dashboard/foresight/report"
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-colors text-sm"
          >
            <FileText className="w-4 h-4" />
            Generate Full Report · AED 299
          </Link>
        </div>

        {/* Property selector */}
        <div className="flex gap-2 flex-wrap">
          {PORTFOLIO_PROPERTIES.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setSelectedPropIdx(i)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-sm font-medium transition-all border",
                selectedPropIdx === i
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white/5 text-slate-300 border-white/10 hover:border-white/20"
              )}
            >
              {p.name}
              <span className="ml-1.5 text-[10px] opacity-70">{p.zone}</span>
            </button>
          ))}
        </div>

        {/* Main two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Chart panel */}
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/3 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-bold text-white">{prop.name}</h2>
                <p className="text-xs text-slate-400">{prop.community} · {prop.zone}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Current value</p>
                <p className="text-lg font-bold text-white">{fmt(prop.currentValue)}</p>
              </div>
            </div>
            <div className="relative">
              <div className={isFree ? "blur-sm pointer-events-none select-none" : ""}>
                <ForesightChart
                  propertyName={prop.name}
                  v0={prop.currentValue}
                  alphaZone={prop.alphaZone}
                  compact={false}
                />
              </div>
              {isFree && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0a0e1a]/60 backdrop-blur-[1px] rounded-xl">
                  <div className="text-center p-4">
                    <Lock className="w-6 h-6 text-amber-400 mx-auto mb-1.5" />
                    <p className="text-sm font-bold text-white">Years 2–5 Chart Locked</p>
                    <p className="text-xs text-slate-400 mt-1">Year 5 base: <span className="text-white font-semibold blur-sm">{fmt(base5)}</span></p>
                    <p className="text-[10px] text-slate-500 mt-1">Upgrade to Pro · AED 149/mo</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Model & coefficients panel */}
          <div className="space-y-4">

            {/* Formula card */}
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
              <div className="flex items-center gap-1.5 mb-3">
                <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                  Growth Model
                </p>
                <InfoTooltip
                  content="SmartBricks Foresight uses a closed-form CAGR model: V_t = V₀ × (1 + r_base + α_zone + β_macro − δ_risk)^t. Each parameter is sourced from Dubai 10-year historical data and UAE Vision 2031 macro indicators. Zone premiums (α) are updated quarterly from DLD transaction data."
                  side="bottom"
                  width="w-72"
                />
              </div>
              <div className="text-xs text-slate-300 overflow-x-auto">
                <BlockMath math="V_t = V_0 \cdot (1 + r_{base} + \alpha_{zone} + \beta_{macro} - \delta_{risk})^t" />
              </div>
              <div className="space-y-2 mt-4 text-xs text-slate-400">
                {[
                  { sym: "V_0", label: "Current value", val: fmt(prop.currentValue), tip: "The base value from which all projections are calculated. In production, this is the SmartBricks AVM estimate updated monthly from DLD transactions." },
                  { sym: "r_{base}", label: "Dubai CAGR", val: `${(BASE_CAGR * 100).toFixed(1)}%`, tip: "Dubai residential compound annual growth rate derived from 10 years of DLD transaction data (2014–2024). Represents the floor growth assumption." },
                  { sym: "\\alpha_{zone}", label: `${prop.zone} premium`, val: `+${prop.alphaZone.toFixed(1)}%`, tip: `Zone Alpha: the per-zone outperformance premium above the base CAGR, derived from zone-level supply/demand regression. ${prop.zone} carries a +${prop.alphaZone.toFixed(1)}% premium.` },
                  { sym: "\\beta_{macro}", label: "UAE Vision 2031", val: `+${(BETA_MACRO * 100).toFixed(1)}%`, tip: "Macro uplift factor from UAE Vision 2031 economic expansion plan: foreign investment inflows, Golden Visa scheme, and Expo City development pipeline." },
                  { sym: "\\delta_{risk}", label: "Risk discount", val: `−${(DELTA_RISK * 100).toFixed(1)}%`, tip: "Oversupply risk discount applied uniformly across all zones to account for pipeline units (new launches) that may compress price growth in high-supply corridors." },
                ].map(({ sym, label, val, tip }) => (
                  <div key={sym} className="flex items-center justify-between gap-2 py-1 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-300 font-mono text-[10px]">
                        <InlineMath math={sym} />
                      </span>
                      <span>{label}</span>
                      <InfoTooltip content={tip} side="right" width="w-64" />
                    </div>
                    <span className="text-white font-semibold">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Zone alpha table */}
            <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
              <div className="flex items-center gap-1.5 mb-3">
                <p className="text-xs font-semibold text-white">Zone Premium Map</p>
                <InfoTooltip
                  content="Zone Alpha (α) is per-zone outperformance premium above Dubai's base CAGR. Higher alpha = stronger zone momentum. Amber ≥1.0% = premium zone; Blue ≥0.7% = above average; Grey = standard."
                  side="right"
                  width="w-64"
                />
              </div>
              <div className="space-y-1.5">
                {Object.entries(ZONE_ALPHAS).map(([zone, alpha]) => (
                  <div
                    key={zone}
                    className={cn(
                      "flex justify-between items-center text-xs py-1 px-2 rounded-lg",
                      zone === prop.zone ? "bg-blue-500/15 border border-blue-500/30" : ""
                    )}
                  >
                    <span className={zone === prop.zone ? "text-white font-medium" : "text-slate-400"}>
                      {zone}
                    </span>
                    <span className={cn(
                      "font-semibold",
                      alpha >= 1.0 ? "text-amber-400" : alpha >= 0.7 ? "text-blue-400" : "text-slate-300"
                    )}>
                      +{alpha.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5-year summary — locked for free tier */}
            <div className="relative rounded-2xl border border-white/10 bg-white/3 p-4 space-y-3">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-white">Year 5 Summary</p>
                <InfoTooltip
                  content="Three projection bands at Year 5: Bear (pessimistic) uses base CAGR minus sigma adjustment; Base (most likely) uses the full model; Bull (optimistic) adds the sigma uplift. Sigma = ±1.5%, derived from 10-year price volatility in Dubai residential."
                  side="left"
                  width="w-64"
                />
              </div>
              {[
                { label: "Bear", value: bear5, color: "text-red-400" },
                { label: "Base", value: base5, color: "text-blue-400" },
                { label: "Bull", value: bull5, color: "text-emerald-400" },
              ].map(({ label, value, color }) => (
                <div key={label} className={cn("flex justify-between text-sm", isFree && "blur-sm select-none pointer-events-none")}>
                  <span className="text-slate-400">{label} case</span>
                  <div className="text-right">
                    <span className={cn("font-bold", color)}>{fmt(value)}</span>
                    <span className="text-[10px] text-slate-500 ml-2">
                      ({(((value - prop.currentValue) / prop.currentValue) * 100).toFixed(0)}%)
                    </span>
                  </div>
                </div>
              ))}
              {isFree && (
                <div className="absolute inset-0 rounded-2xl flex items-center justify-center bg-[#0a0e1a]/70 backdrop-blur-[2px]">
                  <div className="text-center p-3">
                    <Lock className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
                    <p className="text-xs font-bold text-white">Years 2–5 locked</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Upgrade to Pro · AED 149/mo</p>
                  </div>
                </div>
              )}
            </div>

            {/* Monetization gate — shows upgrade CTA for free, confirmation for paid */}
            <div className={cn(
              "rounded-2xl border p-4",
              isFree
                ? "border-amber-500/30 bg-amber-500/5"
                : "border-emerald-500/30 bg-emerald-500/5"
            )}>
              {isFree ? (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <p className="text-sm font-bold text-white">Premium Foresight Report</p>
                  </div>
                  <ul className="text-xs text-slate-400 space-y-1 mb-3">
                    <li>✓ Full 5-year projection PDF</li>
                    <li>✓ DLD comparable sales (90 days)</li>
                    <li>✓ Yield optimization playbook</li>
                    <li>✓ Golden Visa eligibility summary</li>
                    <li>✓ Portfolio rebalance recommendations</li>
                  </ul>
                  <Link
                    href="/dashboard/foresight/report"
                    className="flex items-center justify-center gap-2 w-full py-2 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Generate Report · AED 299
                  </Link>
                  <p className="text-[10px] text-slate-500 mt-2 text-center">
                    Or subscribe to Pro for unlimited reports · AED 149/mo
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                    <p className="text-sm font-bold text-white">Full Report Included</p>
                    <span className="text-[10px] text-emerald-400 font-semibold ml-auto">
                      {tier === "transaction" ? "TRANSACTION" : "PRO"} · {account.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">
                    All 5 sections unlocked — DLD comparables, yield playbook, portfolio rebalancing, and Golden Visa analysis.
                  </p>
                  <Link
                    href="/dashboard/foresight/report"
                    className="flex items-center justify-center gap-2 w-full py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    Open Full Report →
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
