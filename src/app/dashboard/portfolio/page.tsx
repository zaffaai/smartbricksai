"use client";
import WealthScore from "@/components/portfolio/WealthScore";
import AlertFeed from "@/components/portfolio/AlertFeed";
import IntelligenceCards from "@/components/portfolio/IntelligenceCards";
import GoldenVisaTracker from "@/components/portfolio/GoldenVisaTracker";
import MetricTile from "@/components/shared/MetricTile";
import ForesightChart from "@/components/foresight/ForesightChart";
import FeatureBadge from "@/components/shared/FeatureBadge";
import InfoTooltip from "@/components/shared/InfoTooltip";
import { PORTFOLIO_PROPERTIES, ALERT_FEED } from "@/lib/data";
import {
  DollarSign,
  TrendingUp,
  Building2,
  ArrowRight,
  Plus,
  Bell,
  ExternalLink,
  Lock,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Derived portfolio stats
const totalValue = PORTFOLIO_PROPERTIES.reduce((s, p) => s + p.currentValue, 0);
const totalPurchase = PORTFOLIO_PROPERTIES.reduce((s, p) => s + p.purchasePrice, 0);
const avgRoi =
  PORTFOLIO_PROPERTIES.reduce((s, p) => s + p.roi * p.currentValue, 0) / totalValue;
const readyProps = PORTFOLIO_PROPERTIES.filter((p) => !p.offPlan);
const avgYield =
  readyProps.length > 0
    ? readyProps.reduce((s, p) => s + p.yield, 0) / readyProps.length
    : 0;
const totalGain = totalValue - totalPurchase;

const WEALTH_SCORE = 724;
const SCORE_BREAKDOWN = [
  { label: "Yield Efficiency", value: 195, max: 250, color: "#10b981" },
  { label: "Capital Growth", value: 188, max: 250, color: "#3b82f6" },
  { label: "Diversification", value: 171, max: 250, color: "#f59e0b" },
  { label: "Liquidity Ratio", value: 170, max: 250, color: "#8b5cf6" },
];

export default function PortfolioDashboard() {
  return (
    <div className="foresight-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Portfolio Intelligence Hub</h1>
            <p className="text-sm text-slate-400 mt-0.5">Your AI-powered wealth dashboard · UAE Portfolio</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                document
                  .getElementById("alert-feed")
                  ?.scrollIntoView({ behavior: "smooth", block: "center" })
              }
              className="relative flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 hover:bg-white/10 transition-colors"
            >
              <Bell className="w-4 h-4" />
              Alerts
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {ALERT_FEED.length}
              </span>
            </button>
            <Link
              href="/dashboard/property"
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 rounded-xl text-sm text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Property
            </Link>
          </div>
        </div>

        {/* Top Metric Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricTile
            label="Portfolio Value"
            value={`AED ${(totalValue / 1000000).toFixed(2)}M`}
            sub={`+AED ${(totalGain / 1000).toFixed(0)}K unrealized gain`}
            subPositive={true}
            accent="blue"
            icon={<DollarSign className="w-4 h-4" />}
            tooltip="Total market value of all properties as estimated by the SmartBricks AVM today, based on DLD comparable transactions and live zone-alpha coefficients."
          />
          <MetricTile
            label="Average ROI"
            value={`${avgRoi.toFixed(1)}%`}
            sub="+2.3% vs last quarter"
            subPositive={true}
            accent="green"
            icon={<TrendingUp className="w-4 h-4" />}
            tooltip="Value-weighted average return on investment across all portfolio properties, calculated as sum(ROI × Value) / Total Portfolio Value. Excludes rental income."
          />
          <MetricTile
            label="Rental Yield"
            value={`${avgYield.toFixed(1)}%`}
            sub="Benchmark: 6.5% · Zone avg"
            subPositive={true}
            accent="amber"
            icon={<TrendingUp className="w-4 h-4" />}
            tooltip="Annual gross rental income as a % of current property value for ready (non-off-plan) properties. Dubai zone benchmark is 6.5%. Above 8% is considered strong."
          />
          <MetricTile
            label="Properties"
            value={`${PORTFOLIO_PROPERTIES.length}`}
            sub={`${PORTFOLIO_PROPERTIES.filter(p=>!p.offPlan).length} Ready · ${PORTFOLIO_PROPERTIES.filter(p=>p.offPlan).length} Off-Plan`}
            accent="slate"
            icon={<Building2 className="w-4 h-4" />}
            tooltip="Total number of properties tracked in your portfolio. 'Ready' properties generate rental income now. 'Off-Plan' properties are under construction and generate capital growth only until delivery."
          />
        </div>

        {/* Main 3-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* LEFT COLUMN: Properties + Foresight preview */}
          <div className="lg:col-span-2 space-y-5">

            {/* Property cards */}
            <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-white">My Properties</h2>
                <Link href="/dashboard/property" className="text-xs text-blue-400 flex items-center gap-1 hover:text-blue-300">
                  Add more <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-3">
                {PORTFOLIO_PROPERTIES.map((prop) => {
                  const gain = prop.currentValue - prop.purchasePrice;
                  return (
                    <Link
                      key={prop.id}
                      href={`/dashboard/portfolio/${prop.id}`}
                      className="flex gap-3 p-3 rounded-xl bg-white/4 border border-white/7 hover:border-blue-500/40 hover:bg-white/7 transition-all"
                    >
                      <Image
                        src={prop.image}
                        alt={prop.name}
                        width={72}
                        height={72}
                        className="rounded-lg object-cover w-16 h-16 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-white leading-tight">{prop.name}</p>
                            <p className="text-xs text-slate-400">{prop.community}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-bold text-white">
                              AED {(prop.currentValue / 1000000).toFixed(2)}M
                            </p>
                            <p className={`text-xs font-medium ${gain > 0 ? "text-emerald-400" : "text-red-400"}`}>
                              {gain > 0 ? "+" : ""}AED {(gain / 1000).toFixed(0)}K
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            prop.status === "Ready"
                              ? "bg-emerald-500/15 text-emerald-400"
                              : "bg-blue-500/15 text-blue-400"
                          }`}>
                            {prop.status}
                          </span>
                          {prop.yield > 0 && (
                            <span className="text-[10px] text-slate-400">
                              Yield: <span className="text-emerald-400 font-semibold">{prop.yield}%</span>
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400">
                            ROI: <span className="text-blue-400 font-semibold">{prop.roi}%</span>
                          </span>
                          <span className="text-[10px] bg-blue-600/20 text-blue-300 px-1.5 py-0.5 rounded font-bold ml-auto">
                            Score {prop.smartbricksScore}%
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Foresight preview card — monetization hook */}
            <div className="rounded-2xl border border-blue-500/30 bg-linear-to-br from-blue-900/20 to-transparent p-5">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <h2 className="text-sm font-bold text-white">Foresight Preview</h2>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-semibold">
                    PRO
                  </span>
                  <InfoTooltip
                    content="SmartBricks Foresight is a 5-year property value prediction engine powered by a parameterised CAGR model: Vₜ = V₀ × (1 + r_base + α_zone + β_macro − δ_risk)^t. It generates Bear, Base, and Bull projections based on live DLD zone-alpha data and UAE macro indicators."
                    side="bottom"
                    width="w-72"
                  />
                </div>
                <Link
                  href="/dashboard/foresight"
                  className="text-xs text-blue-400 flex items-center gap-1 hover:text-blue-300"
                >
                  Full analysis <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
              <p className="text-xs text-slate-400 mb-4">Autumn 2 · 5-year value projection</p>
              <ForesightChart
                propertyName="Autumn 2"
                v0={PORTFOLIO_PROPERTIES[0].currentValue}
                alphaZone={PORTFOLIO_PROPERTIES[0].alphaZone}
                compact
              />
              {/* Upgrade gate */}
              <div className="mt-4 relative rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-[#0a0e1a]/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 gap-2">
                  <Lock className="w-5 h-5 text-amber-400" />
                  <p className="text-xs font-semibold text-white">Full Foresight unlocked in Pro</p>
                  <Link
                    href="/dashboard/foresight"
                    className="text-xs bg-amber-500 text-black font-bold px-3 py-1.5 rounded-lg hover:bg-amber-400 transition-colors"
                  >
                    Upgrade to Pro — AED 149/mo
                  </Link>
                </div>
                <div className="h-12" />
              </div>
            </div>

            {/* Alert Feed */}
            <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-white">Market Intelligence Feed</h2>
                  <FeatureBadge variant="ai" />
                </div>
                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-medium">
                  4 new alerts
                </span>
              </div>
              <div id="alert-feed">
                <AlertFeed />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Wealth Score + Visa + Intelligence Cards */}
          <div className="space-y-5">

            {/* Wealth Score */}
            <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm font-bold text-white">Wealth Score</h2>
                  <InfoTooltip
                    content="AI-computed investment health score (0–1000) across 4 dimensions: Yield Efficiency (how well your rental income performs vs. zone benchmark), Capital Growth (5-year Foresight trajectory), Diversification (zone spread across portfolio), and Liquidity Ratio (% of ready vs. off-plan assets). Updated monthly."
                    side="right"
                    width="w-72"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <FeatureBadge variant="ai" />
                  <span className="text-xs text-slate-400">March 2026</span>
                </div>
              </div>
              <WealthScore score={WEALTH_SCORE} delta={12} breakdown={SCORE_BREAKDOWN} />
            </div>

            {/* Golden Visa Tracker */}
            <GoldenVisaTracker portfolioValue={totalValue} />

            {/* AI Intelligence Cards */}
            <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-sm font-bold text-white">Invisible Intelligence</h2>
                <FeatureBadge variant="ai" />
                <InfoTooltip
                  content="AI-generated signal cards that surface actionable insights you didn't know to look for — yield gaps, zone price movements, payment due reminders, and Golden Visa eligibility triggers. Ranked by urgency and financial impact."
                  side="bottom"
                  width="w-64"
                />
              </div>
              <IntelligenceCards />
            </div>

            {/* Premium Report CTA */}
            <div className="rounded-2xl bg-linear-to-br from-blue-600 to-blue-800 p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <p className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-1">
                  Premium Report
                </p>
                <p className="text-base font-bold text-white mb-2">
                  Full AI Foresight Report
                </p>
                <p className="text-xs text-blue-200 mb-4 leading-relaxed">
                  5-year projections · DLD comparables · Yield optimization · Golden Visa summary
                </p>
                <div className="flex items-center gap-3">
                  <Link
                    href="/dashboard/foresight/report"
                    className="flex-1 text-center text-sm bg-white text-blue-700 font-bold py-2 rounded-xl hover:bg-blue-50 transition-colors"
                  >
                    Get Report · AED 299
                  </Link>
                </div>
                <p className="text-[10px] text-blue-300 mt-2 text-center">
                  Or unlock all reports with Pro · AED 149/mo
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
