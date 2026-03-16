"use client";
import { useParams } from "next/navigation";
import { PORTFOLIO_PROPERTIES, DLD_RECENT_SALES } from "@/lib/data";
import ForesightChart from "@/components/foresight/ForesightChart";
import { useToast } from "@/components/shared/Toast";
import FeatureBadge from "@/components/shared/FeatureBadge";
import {
  ArrowLeft,
  TrendingUp,
  FileText,
  CheckCircle2,
  Clock,
  Lock,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/cn";
import InfoTooltip from "@/components/shared/InfoTooltip";

export default function PropertyAssetPage() {
  const { id } = useParams<{ id: string }>();
  const prop = PORTFOLIO_PROPERTIES.find((p) => p.id === id);
  const { toast } = useToast();

  if (!prop) {
    return (
      <div className="foresight-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg font-semibold">Property not found</p>
          <Link href="/dashboard/portfolio" className="text-blue-400 text-sm mt-2 block">
            ← Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  const gain = prop.currentValue - prop.purchasePrice;
  const gainPct = ((gain / prop.purchasePrice) * 100).toFixed(1);
  const benchmarkYield = 6.5;
  const yieldGap = benchmarkYield - prop.yield;

  return (
    <div className="foresight-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* Back nav */}
        <Link
          href="/dashboard/portfolio"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Portfolio Intelligence Hub
        </Link>

        {/* Property header */}
        <div className="flex gap-4 items-start">
          <Image
            src={prop.image}
            alt={prop.name}
            width={96}
            height={96}
            className="rounded-2xl object-cover w-20 h-20 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h1 className="text-lg font-bold text-white">{prop.name}</h1>
                <p className="text-sm text-slate-400">{prop.community}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full font-medium",
                    prop.status === "Ready"
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-blue-500/15 text-blue-400"
                  )}>
                    {prop.status}
                  </span>
                  {prop.goldenVisaEligible && (
                    <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold">
                      🇦🇪 Golden Visa Eligible
                    </span>
                  )}
                  <span className="text-xs bg-blue-600/20 text-blue-300 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                    Score {prop.smartbricksScore}%
                    <InfoTooltip
                      content="SmartBricks Investment Score (0–100): AI composite across yield efficiency, capital growth trajectory, zone liquidity score, and developer track record. ≥90% = strong buy / hold signal."
                      side="bottom"
                      width="w-56"
                    />
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">
                  AED {(prop.currentValue / 1000000).toFixed(2)}M
                </p>
                <p className={`text-sm font-medium ${gain >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {gain >= 0 ? "+" : ""}{gainPct}% · {gain >= 0 ? "+" : ""}AED {(gain / 1000).toFixed(0)}K
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Purchased AED {(prop.purchasePrice / 1000000).toFixed(2)}M · {prop.purchaseDate}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Annual ROI", value: `${prop.roi}%`, sub: "vs 8% market avg", positive: true, tip: "Return on investment calculated as (Current AVM Value − Purchase Price) / Purchase Price. Measures capital appreciation only; excludes rental income." },
            { label: "Rental Yield", value: prop.yield > 0 ? `${prop.yield}%` : "Off-Plan", sub: prop.yield > 0 ? `Zone avg: 6.5%` : "Delivery 2027", positive: prop.yield > benchmarkYield, tip: prop.yield > 0 ? "Annual gross rental income ÷ current property value. Dubai zone average is 6.5%. Above 8% is considered high-yield. Gross yield does not deduct service charges or vacancy." : "Off-plan properties do not generate rental income until handover. Capital appreciation applies during construction." },
            { label: "Bedrooms", value: `${prop.bedrooms} BR`, sub: `${prop.sqft.toLocaleString()} sq ft`, tip: undefined },
            { label: "SmartBricks Val.", value: `AED ${(prop.currentValue / 1000000).toFixed(2)}M`, sub: `+${gainPct}% above purchase`, positive: true, tip: "SmartBricks Automated Valuation Model (AVM): estimated fair market value based on DLD comparable transactions in the same zone, bedroom count, and sqft range within the past 90 days, adjusted by the live zone-alpha coefficient." },
          ].map(({ label, value, sub, positive, tip }) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/3 p-4">
              <p className="text-xs text-slate-400 mb-1 font-medium flex items-center gap-1">
                {label}
                {tip && <InfoTooltip content={tip} side="bottom" width="w-56" />}
              </p>
              <p className="text-lg font-bold text-white">{value}</p>
              <p className={cn("text-xs mt-0.5", positive ? "text-emerald-400" : "text-slate-400")}>
                {sub}
              </p>
            </div>
          ))}
        </div>

        {/* Two-column content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Foresight chart */}
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  5-Year Foresight
                </h2>
                <FeatureBadge variant="ai" />
              </div>
              <Link
                href="/dashboard/foresight"
                className="text-xs text-blue-400 flex items-center gap-1 hover:text-blue-300 shrink-0"
              >
                Full Foresight <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            <ForesightChart
              propertyName={prop.name}
              v0={prop.currentValue}
              alphaZone={prop.alphaZone}
              compact={false}
            />
          </div>

          {/* Right column: Yield Optimization + Off-plan OR DLD Sales */}
          <div className="space-y-4">

            {/* Yield Optimization Module */}
            {!prop.offPlan && (
              <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
                <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-1.5">
                  Rental Yield Optimizer
                  <InfoTooltip
                    content="Compares your current long-term rental yield against the zone benchmark and estimated short-term rental (STR / Airbnb) yield. STR yield is estimated from DTCM occupancy data and comparable JVC Airbnb listings. Includes net yield after DTCM licensing fees."
                    side="right"
                    width="w-64"
                  />
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Your current yield</span>
                    <span className="text-white font-bold">{prop.yield}%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Zone benchmark</span>
                    <span className="text-blue-400 font-bold">{benchmarkYield}%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Short-term (STR) avg</span>
                    <span className="text-emerald-400 font-bold">10.2%</span>
                  </div>

                  {/* Yield gap indicator */}
                  {yieldGap < 0 ? (
                    <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3">
                      <p className="text-xs text-emerald-400 font-medium">
                        ✅ Outperforming zone benchmark by {Math.abs(yieldGap).toFixed(1)}%
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3">
                      <p className="text-xs text-amber-300 font-medium mb-1">
                        ⚠️ Yield Gap: {yieldGap.toFixed(1)}% below zone average
                      </p>
                      <p className="text-xs text-slate-400">
                        Switch to short-term rental (STR) to capture potential{" "}
                        <span className="text-emerald-400 font-semibold">
                          +AED {Math.round((prop.currentValue * 0.023) / 12).toLocaleString()}/mo
                        </span>{" "}
                        yield uplift.
                      </p>
                    </div>
                  )}
                  <Link
                    href={`/dashboard/portfolio/${prop.id}/str-plan`}
                    className="w-full flex items-center justify-center gap-1.5 text-xs bg-blue-600/20 border border-blue-500/30 text-blue-300 font-semibold py-2 rounded-xl hover:bg-blue-600/30 transition-colors"
                  >
                    View STR Optimization Plan →
                  </Link>
                </div>
              </div>
            )}

            {/* Off-plan payment tracker */}
            {prop.offPlan && prop.paymentPlan && (
              <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-white">Payment Plan Tracker</h2>
                  <span className="text-xs text-blue-400 font-medium">
                    Delivery: {prop.deliveryDate}
                  </span>
                </div>

                {/* Construction progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                    <span>Construction Progress</span>
                    <span className="text-white font-semibold">{prop.constructionProgress}%</span>
                  </div>
                  <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-blue-600 to-blue-400 transition-all"
                      style={{ width: `${prop.constructionProgress}%` }}
                    />
                  </div>
                </div>

                {/* Payment milestones */}
                <div className="space-y-2">
                  {prop.paymentPlan.map((step) => (
                    <div
                      key={step.milestone}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border text-xs",
                        step.paid
                          ? "bg-emerald-500/10 border-emerald-500/20"
                          : "bg-white/3 border-white/10"
                      )}
                    >
                      {step.paid ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={cn("font-semibold", step.paid ? "text-emerald-300" : "text-white")}>
                          {step.milestone}
                        </p>
                        <p className="text-slate-400">{step.date}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-white">
                          AED {step.amount.toLocaleString()}
                        </p>
                        <p className="text-slate-500">{step.percent}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DLD Recent Sales */}
            <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                  DLD Comparable Sales
                  <InfoTooltip
                    content="Actual Dubai Land Department (DLD) registered sale transactions in the same zone and bedroom category from the past 90 days. These are official public registry transactions, not listing prices. Used to cross-validate the SmartBricks AVM."
                    side="right"
                    width="w-64"
                  />
                </h2>
                <span className="text-xs text-slate-500">Last 90 days</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-500 border-b border-white/5">
                      <th className="text-left pb-2 font-medium">Project</th>
                      <th className="text-right pb-2 font-medium">Sqft</th>
                      <th className="text-right pb-2 font-medium">Price (AED)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DLD_RECENT_SALES.map((sale, i) => (
                      <tr key={i} className="border-b border-white/5 last:border-0">
                        <td className="py-2 text-slate-300">
                          <p className="font-medium">{sale.project}</p>
                          <p className="text-slate-500">{sale.date} · {sale.br}</p>
                        </td>
                        <td className="py-2 text-right text-slate-400">{sale.sqft}</td>
                        <td className="py-2 text-right font-semibold text-white">
                          {sale.price.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Document Vault */}
            <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
              <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-1.5">
                Document Vault
                <InfoTooltip
                  content="Secure storage for all legal property documents: SPA (Sales Purchase Agreement), Title Deed, NOC (No Objection Certificate), and DLD Receipts. In production, documents are stored in user-scoped encrypted buckets with zero cross-user access. AI Vault Scanner (Pro) will extract key clauses and flag non-standard terms."
                  side="right"
                  width="w-72"
                />
              </h2>
              <div className="space-y-2">
                {[
                  { name: "Sales Purchase Agreement (SPA)", status: "available" },
                  { name: "Title Deed / Registration", status: prop.offPlan ? "pending" : "available" },
                  { name: "No Objection Certificate (NOC)", status: prop.offPlan ? "pending" : "available" },
                  { name: "DLD Receipt", status: "available" },
                ].map(({ name, status }) => (
                  <div key={name} className="flex items-center justify-between p-2.5 rounded-xl bg-white/3 border border-white/7">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-xs text-slate-300">{name}</span>
                    </div>
                    {status === "available" ? (
                      <button
                        onClick={() =>
                          toast(`Opening ${name}`, {
                            description: "Full document viewer available in the production release.",
                            type: "info",
                          })
                        }
                        className="text-[10px] text-blue-400 font-semibold hover:text-blue-300"
                      >
                        View
                      </button>
                    ) : (
                      <span className="text-[10px] text-amber-400 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Pending
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
