"use client";
import { useParams } from "next/navigation";
import { PORTFOLIO_PROPERTIES } from "@/lib/data";
import { useDemoAccount } from "@/lib/demo";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Home,
  Calendar,
  Star,
  BarChart2,
  CheckCircle2,
  AlertTriangle,
  Info,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import FeatureBadge from "@/components/shared/FeatureBadge";
import InfoTooltip from "@/components/shared/InfoTooltip";

// AI-projected monthly STR data — Autumn 2, JVC (1BR, 664 sqft)
const MONTHLY_STR = [
  { month: "Apr", occupancy: 82, revenue: 7200, avgNight: 293, demand: "high" },
  { month: "May", occupancy: 75, revenue: 6600, avgNight: 285, demand: "medium" },
  { month: "Jun", occupancy: 68, revenue: 5900, avgNight: 279, demand: "medium" },
  { month: "Jul", occupancy: 62, revenue: 5400, avgNight: 277, demand: "low" },
  { month: "Aug", occupancy: 58, revenue: 5100, avgNight: 281, demand: "low" },
  { month: "Sep", occupancy: 71, revenue: 6100, avgNight: 275, demand: "medium" },
  { month: "Oct", occupancy: 88, revenue: 7800, avgNight: 299, demand: "high" },
  { month: "Nov", occupancy: 93, revenue: 8400, avgNight: 305, demand: "peak" },
  { month: "Dec", occupancy: 97, revenue: 9100, avgNight: 316, demand: "peak" },
  { month: "Jan", occupancy: 95, revenue: 8800, avgNight: 312, demand: "peak" },
  { month: "Feb", occupancy: 91, revenue: 8200, avgNight: 304, demand: "peak" },
  { month: "Mar", occupancy: 85, revenue: 7600, avgNight: 301, demand: "high" },
];

const COMPETITORS = [
  { name: "JVC Blvd Unit — Similar", sqft: 650, avgNight: 285, occupancy: 79, monthlyRev: 6800, isYou: false },
  { name: "Your Autumn 2", sqft: 664, avgNight: 301, occupancy: 83, monthlyRev: 7517, isYou: true },
  { name: "Premium JVC Studio Pro", sqft: 520, avgNight: 275, occupancy: 72, monthlyRev: 5980, isYou: false },
  { name: "JVC District 16 — 1BR", sqft: 710, avgNight: 295, occupancy: 81, monthlyRev: 7200, isYou: false },
];

const totalSTRRevenue = MONTHLY_STR.reduce((s, m) => s + m.revenue, 0);
const ltRevenue = 64800;
const uplift = totalSTRRevenue - ltRevenue;
const upliftPct = ((uplift / ltRevenue) * 100).toFixed(0);
const avgOccupancy = Math.round(MONTHLY_STR.reduce((s, m) => s + m.occupancy, 0) / 12);
const avgNight = Math.round(MONTHLY_STR.reduce((s, m) => s + m.avgNight, 0) / 12);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-[#1a2236] border border-blue-500/30 p-3 text-xs shadow-xl">
      <p className="font-bold text-white mb-1">{label}</p>
      <p className="text-emerald-400">Revenue: AED {payload[0]?.value?.toLocaleString()}</p>
    </div>
  );
}

const DEMAND_STYLE: Record<string, string> = {
  peak: "bg-emerald-500/20 text-emerald-400",
  high: "bg-blue-500/20 text-blue-400",
  medium: "bg-amber-500/20 text-amber-300",
  low: "bg-slate-500/20 text-slate-400",
};

export default function STRPlanPage() {
  const { id } = useParams<{ id: string }>();
  const prop = PORTFOLIO_PROPERTIES.find((p) => p.id === id);
  const { tier } = useDemoAccount();
  const isFree = tier === "free";

  if (!prop || prop.offPlan) {
    return (
      <div className="foresight-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white font-semibold">STR data is only available for ready properties.</p>
          <Link href="/dashboard/portfolio" className="text-blue-400 text-sm mt-2 block">
            ← Portfolio Hub
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="foresight-bg min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Back */}
        <Link
          href={`/dashboard/portfolio/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {prop.name}
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <FeatureBadge variant="ai" />
              <FeatureBadge variant="proposed" />
            </div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              STR Optimization Intelligence
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              {prop.name} · AI-powered short-term rental maximisation engine
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-5 py-3 shrink-0">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-xs text-slate-400">AI Projected Annual Uplift</p>
              <p className="text-xl font-bold text-emerald-400">+AED {uplift.toLocaleString()}</p>
              <p className="text-xs text-emerald-600">+{upliftPct}% vs long-term rental</p>
            </div>
          </div>
        </div>

        {/* AI Recommendation Banner */}
        <div className="rounded-2xl border border-blue-500/30 bg-linear-to-r from-blue-900/20 to-transparent p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/25 border border-blue-500/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <p className="text-sm font-bold text-white">SmartBricks AI Recommendation</p>
                <span className="text-[10px] bg-blue-600/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full font-semibold">
                  87% confidence
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Based on analysis of{" "}
                <span className="text-white font-semibold">14,200 JVC short-term rental transactions</span>{" "}
                over 18 months, Airbnb occupancy patterns, and your unit&apos;s location score, switching to{" "}
                <span className="text-white font-semibold">STR (Oct–Mar) and long-term lease (Apr–Sep)</span>{" "}
                maximises your annual yield to an estimated{" "}
                <span className="text-emerald-400 font-bold">10.2%</span>{" "}
                vs current {prop.yield}% long-term.
              </p>
              <div className="flex flex-wrap gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  DTCM holiday home licence (~AED 2,800/yr)
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Property management ~18% of STR revenue
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  Net uplift after all fees: +AED {Math.round(uplift * 0.72).toLocaleString()}/yr
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Projected Annual Revenue", value: `AED ${(totalSTRRevenue / 1000).toFixed(0)}K`, sub: "Full STR strategy", positive: true },
            { label: "Current LT Revenue", value: `AED ${(ltRevenue / 1000).toFixed(0)}K`, sub: "Long-term lease", positive: false },
            { label: "Avg Nightly Rate", value: `AED ${avgNight}`, sub: "JVC 1BR market avg", positive: true },
            { label: "Peak Occupancy", value: `${avgOccupancy}% avg`, sub: "97% peak (December)", positive: true },
          ].map(({ label, value, sub, positive }) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/3 p-4">
              <p className="text-xs text-slate-400 font-medium mb-1">{label}</p>
              <p className="text-xl font-bold text-white">{value}</p>
              <p className={cn("text-xs mt-0.5", positive ? "text-emerald-400" : "text-slate-500")}>{sub}</p>
            </div>
          ))}
        </div>

        {/* Revenue chart + competitor table */}
        <div className="relative">
          {isFree && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0a0e1a]/80 backdrop-blur-[2px] rounded-2xl">
              <div className="text-center p-6 max-w-xs">
                <Lock className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                <p className="text-base font-bold text-white mb-1">
                  You&apos;re leaving AED {uplift.toLocaleString()} on the table
                </p>
                <p className="text-sm text-slate-400 mb-4">
                  Unlock the full STR optimization engine — monthly forecast, competitor benchmarks, and seasonal pricing calendar.
                </p>
                <Link
                  href="/dashboard/foresight/report"
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-colors text-sm"
                >
                  Unlock with Pro · AED 149/mo
                </Link>
                <p className="text-[11px] text-slate-500 mt-2">
                  Pro pays for itself in &lt;1 month of STR uplift
                </p>
              </div>
            </div>
          )}
          <div className={cn(isFree ? "opacity-40 blur-sm pointer-events-none select-none grid grid-cols-1 lg:grid-cols-2 gap-5" : "grid grid-cols-1 lg:grid-cols-2 gap-5")}>

          {/* Monthly revenue chart */}
          <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-blue-400" />
                  AI Monthly Revenue Forecast
                  <InfoTooltip
                    content="AI projection of monthly STR revenue based on 18 months of JVC Airbnb occupancy data, DTCM holiday home licensing records, seasonal demand curves, and your unit's specific sqft and location score. Excludes DTCM license (~AED 2,800/yr) and management fees (~18% of revenue)."
                    side="right"
                    width="w-64"
                  />
                </h2>
                <p className="text-xs text-slate-400">12-month STR projection</p>
              </div>
              <FeatureBadge variant="ai" />
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={MONTHLY_STR} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                  width={36}
                />
                <Tooltip content={<BarTooltip />} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5 text-xs text-slate-400">
              <span>Peak season: Nov–Mar</span>
              <span className="text-emerald-400 font-semibold">Total: AED {(totalSTRRevenue / 1000).toFixed(0)}K/yr</span>
            </div>
          </div>

          {/* Competitor benchmark */}
          <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                JVC Market Benchmark
                <InfoTooltip
                  content="AI analysis of 142 active short-term rental listings in Jumeirah Village Circle with comparable specifications (1BR, 600–730 sqft). Revenue and occupancy figures represent 30-day trailing averages from available DTCM and Airbnb public data. 'YOU' highlights where your unit ranks."
                  side="right"
                  width="w-64"
                />
              </h2>
              <FeatureBadge variant="ai" />
            </div>
            <div className="space-y-2">
              {COMPETITORS.map((c) => (
                <div
                  key={c.name}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl text-xs border",
                    c.isYou
                      ? "bg-blue-500/10 border-blue-500/25"
                      : "bg-white/3 border-white/7"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <p className={cn("font-semibold truncate", c.isYou ? "text-white" : "text-slate-300")}>
                      {c.name}
                      {c.isYou && (
                        <span className="ml-2 text-[9px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full font-bold">
                          YOU
                        </span>
                      )}
                    </p>
                    <p className="text-slate-500">{c.sqft} sqft</p>
                  </div>
                  <div className="text-center shrink-0">
                    <p className={cn("font-bold", c.isYou ? "text-blue-300" : "text-slate-300")}>AED {c.avgNight}/night</p>
                    <p className="text-slate-500">{c.occupancy}% occ.</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={cn("font-bold", c.isYou ? "text-emerald-400" : "text-slate-400")}>
                      AED {c.monthlyRev.toLocaleString()}/mo
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 mt-3 text-center">
              AI analysis of 142 comparable JVC listings · March 2026
            </p>
          </div>
          </div>
        </div>

        {/* Monthly breakdown table */}
        <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            12-Month Booking Intelligence
            <InfoTooltip
              content="Month-by-month AI breakdown of projected occupancy, average nightly rate, and total revenue for this unit. Demand levels: Peak (Oct–Mar, Dubai tourist season) = 90%+ occupancy; High = 80–90%; Medium = 65–80%; Low = ≤65%. Rates fluctuate with demand."
              side="right"
              width="w-72"
            />
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-500 border-b border-white/5">
                  <th className="text-left pb-2 font-medium">Month</th>
                  <th className="text-right pb-2 font-medium">Occupancy</th>
                  <th className="text-right pb-2 font-medium">Avg/night</th>
                  <th className="text-right pb-2 font-medium">Revenue</th>
                  <th className="text-right pb-2 font-medium">Demand</th>
                </tr>
              </thead>
              <tbody>
                {MONTHLY_STR.map((m) => (
                  <tr key={m.month} className="border-b border-white/5 last:border-0">
                    <td className="py-2 text-white font-medium">{m.month}</td>
                    <td className="py-2 text-right text-slate-300">{m.occupancy}%</td>
                    <td className="py-2 text-right text-slate-300">AED {m.avgNight}</td>
                    <td className="py-2 text-right font-semibold text-white">AED {m.revenue.toLocaleString()}</td>
                    <td className="py-2 text-right">
                      <span className={cn("text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase", DEMAND_STYLE[m.demand])}>
                        {m.demand}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-white/10">
                  <td className="pt-3 font-bold text-white">Annual Total</td>
                  <td className="pt-3 text-right text-white font-semibold">{avgOccupancy}% avg</td>
                  <td className="pt-3 text-right text-white font-semibold">AED {avgNight}</td>
                  <td className="pt-3 text-right font-bold text-emerald-400">AED {totalSTRRevenue.toLocaleString()}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* CTAs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
            <Home className="w-5 h-5 text-emerald-400 mb-2" />
            <p className="text-sm font-bold text-white mb-1">Connect a Property Manager</p>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              SmartBricks partner managers handle DTCM licensing, guest management, and maintenance for ~18% of gross revenue.
            </p>
            <Link
              href="https://calendly.com/d/csz4-4hq-m39/smart-bricks-investment-consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-colors"
            >
              Book Strategy Call →
            </Link>
          </div>
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <Info className="w-5 h-5 text-blue-400 mb-2" />
            <p className="text-sm font-bold text-white mb-1">Run Full Foresight Report</p>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              See how a STR + long-term hybrid strategy affects your 5-year wealth trajectory in the full AI Foresight report.
            </p>
            <Link
              href="/dashboard/foresight/report"
              className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Open Foresight Report →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
