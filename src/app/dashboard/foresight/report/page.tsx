"use client";
import { PORTFOLIO_PROPERTIES, calcForesight } from "@/lib/data";
import ForesightChart from "@/components/foresight/ForesightChart";
import GoldenVisaTracker from "@/components/portfolio/GoldenVisaTracker";
import { BlockMath } from "react-katex";
import {
  Download,
  Lock,
  CheckCircle2,
  FileText,
  TrendingUp,
  Star,
  ArrowLeft,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/components/shared/Toast";

const totalValue = PORTFOLIO_PROPERTIES.reduce((s, p) => s + p.currentValue, 0);
const prop = PORTFOLIO_PROPERTIES[0];
const fmt = (v: number) =>
  v >= 1000000 ? `AED ${(v / 1000000).toFixed(2)}M` : `AED ${(v / 1000).toFixed(0)}K`;

export default function PremiumReportPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const { toast } = useToast();
  const base5 = calcForesight(prop.currentValue, prop.alphaZone, 5, "base");
  const bull5 = calcForesight(prop.currentValue, prop.alphaZone, 5, "bull");

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      toast("Report Downloaded!", {
        description: "SmartBricks AI Foresight Report — UAE Portfolio · March 2026 saved to Downloads.",
        type: "success",
      });
    }, 2000);
  };

  return (
    <div className="foresight-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Back */}
        <Link
          href="/dashboard/foresight"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Foresight Dashboard
        </Link>

        {/* Report header */}
        <div className="rounded-2xl bg-linear-to-br from-blue-900/40 via-blue-900/10 to-transparent border border-blue-500/20 p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-5 h-5 text-blue-400" />
                <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider">
                  Foresight Intelligence Report
                </span>
              </div>
              <h1 className="text-xl font-bold text-white">UAE Portfolio Report</h1>
              <p className="text-sm text-slate-400">
                Generated March 15, 2026 · 2 Properties · Dubai, UAE
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-emerald-400">DLD Verified Data</span>
            </div>
          </div>
        </div>

        {/* What's inside */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            "5-Year Projections",
            "DLD Comparables",
            "Yield Optimization",
            "Golden Visa Status",
            "Portfolio Rebalancing",
          ].map((item) => (
            <div
              key={item}
              className="rounded-xl bg-white/4 border border-white/10 p-3 text-center"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto mb-1.5" />
              <p className="text-xs text-slate-300 font-medium">{item}</p>
            </div>
          ))}
        </div>

        {/* Report sections — blurred behind paywall */}
        <div className="space-y-5">

          {/* Section 1: Always visible */}
          <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              Section 1 — 5-Year Value Forecast
            </h2>
            <div className="mb-4 text-xs text-slate-400 space-y-1">
              <p>
                Based on the Foresight model:&nbsp;
                <span className="text-blue-300">
                  <BlockMath math="V_t = V_0 \cdot (1 + r_{base} + \alpha_{zone} + \beta_{macro} - \delta_{risk})^t" />
                </span>
              </p>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-3">
                  <p className="text-xs text-slate-400">Year 5 Base Case</p>
                  <p className="text-lg font-bold text-white">{fmt(base5)}</p>
                  <p className="text-xs text-emerald-400">
                    +{(((base5 - prop.currentValue) / prop.currentValue) * 100).toFixed(0)}% vs today
                  </p>
                </div>
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3">
                  <p className="text-xs text-slate-400">Year 5 Bull Case</p>
                  <p className="text-lg font-bold text-white">{fmt(bull5)}</p>
                  <p className="text-xs text-emerald-400">
                    +{(((bull5 - prop.currentValue) / prop.currentValue) * 100).toFixed(0)}% vs today
                  </p>
                </div>
              </div>
            </div>
            <ForesightChart
              propertyName={prop.name}
              v0={prop.currentValue}
              alphaZone={prop.alphaZone}
              compact={false}
            />
          </div>

          {/* Section 2: Golden Visa — always visible */}
          <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
            <h2 className="text-sm font-bold text-white mb-4">Section 2 — Golden Visa Status</h2>
            <GoldenVisaTracker portfolioValue={totalValue} />
          </div>

          {/* Section 3 and 4: Locked behind paywall */}
          <div className="relative">
            <div className="rounded-2xl border border-white/10 bg-white/3 p-5 space-y-4">
              <h2 className="text-sm font-bold text-white">Section 3 — DLD Comparable Sales Analysis</h2>
              <div className="space-y-2 opacity-30 blur-sm pointer-events-none select-none">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-10 rounded-xl bg-white/10" />
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/3 p-5 mt-4 space-y-4">
              <h2 className="text-sm font-bold text-white">Section 4 — Yield Optimization Playbook</h2>
              <div className="space-y-2 opacity-30 blur-sm pointer-events-none select-none">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-8 rounded-xl bg-white/10" />
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/3 p-5 mt-4 space-y-2">
              <h2 className="text-sm font-bold text-white">Section 5 — Portfolio Rebalancing</h2>
              <div className="space-y-2 opacity-30 blur-sm pointer-events-none select-none">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-8 rounded-xl bg-white/10" />
                ))}
              </div>
            </div>

            {/* Paywall overlay */}
            {!unlocked && (
              <div className="absolute inset-0 rounded-2xl bg-[#0a0e1a]/85 backdrop-blur-sm flex flex-col items-center justify-center gap-4 p-6">
                <Lock className="w-8 h-8 text-amber-400" />
                <div className="text-center">
                  <p className="text-base font-bold text-white">
                    Unlock Sections 3 – 5
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    DLD comparables, yield playbook, and portfolio rebalancing
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                  <button
                    onClick={() => setUnlocked(true)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-colors text-sm"
                  >
                    <Star className="w-4 h-4" />
                    Buy Report · AED 299
                  </button>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-500">
                    Or get unlimited reports with{" "}
                    <span className="text-amber-400 font-semibold">Pro — AED 149/month</span>
                  </p>
                  <button
                    onClick={() => setUnlocked(true)}
                    className="mt-2 text-xs text-blue-400 underline hover:text-blue-300"
                  >
                    Start Pro Trial →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Download button */}
          {unlocked && (
            <button
              onClick={downloaded ? undefined : handleDownload}
              disabled={downloading}
              className={`w-full flex items-center justify-center gap-2 py-3 text-white font-bold rounded-xl transition-colors ${
                downloaded
                  ? "bg-emerald-600 cursor-default"
                  : downloading
                  ? "bg-blue-600/50 cursor-wait"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {downloaded ? (
                <><CheckCircle2 className="w-4 h-4" /> Report Downloaded!</>
              ) : downloading ? (
                <><div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> Generating PDF…</>
              ) : (
                <><Download className="w-4 h-4" /> Download Full PDF Report</>
              )}
            </button>
          )}
        </div>

        {/* Pricing plans */}
        <div className="rounded-2xl border border-white/10 bg-white/3 p-6">
          <h2 className="text-base font-bold text-white mb-5 text-center">
            Choose Your Access Plan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                name: "Single Report",
                price: "AED 299",
                sub: "one-time",
                features: ["1 Foresight Report", "5-year projection", "DLD comparables", "Yield analysis"],
                cta: "Buy Report",
                highlight: false,
              },
              {
                name: "Pro Investor",
                price: "AED 149",
                sub: "/month",
                features: [
                  "Unlimited Foresight Reports",
                  "Real-time AI alerts",
                  "Portfolio Intelligence Hub",
                  "Golden Visa tracking",
                  "Priority AI Advisor",
                ],
                cta: "Start Pro — Best Value",
                highlight: true,
              },
              {
                name: "Transaction Fee",
                price: "1.5%",
                sub: "of transaction",
                features: [
                  "Agent-assisted acquisition",
                  "DLD registration managed",
                  "Legal review included",
                  "Post-purchase setup",
                ],
                cta: "Talk to Agent",
                highlight: false,
              },
            ].map(({ name, price, sub, features, cta, highlight }) => (
              <div
                key={name}
                className={`rounded-2xl border p-5 flex flex-col gap-4 ${
                  highlight
                    ? "border-blue-500/50 bg-blue-500/10 ring-1 ring-blue-500/30"
                    : "border-white/10 bg-white/3"
                }`}
              >
                {highlight && (
                  <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold self-start">
                    MOST POPULAR
                  </span>
                )}
                <div>
                  <p className="text-xs text-slate-400 font-medium">{name}</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {price}
                    <span className="text-sm font-normal text-slate-400 ml-1">{sub}</span>
                  </p>
                </div>
                <ul className="space-y-1.5 flex-1">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setUnlocked(true)}
                  className={`w-full py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    highlight
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
