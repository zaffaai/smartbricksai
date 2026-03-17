"use client";
import Link from "next/link";
import { useState } from "react";
import {
  CheckCircle2, Circle, ArrowRight, Building2,
  FileText, Shield, Clock, Users, Star,
  ChevronRight, Sparkles, AlertTriangle, Lock,
  BadgeCheck, Home, Plus, Minus,
} from "lucide-react";
import { PORTFOLIO_PROPERTIES } from "@/lib/data";
import { useDemoAccount } from "@/lib/demo";
import { cn } from "@/lib/cn";
import MonetizationTooltip from "@/components/shared/MonetizationTooltip";

/* ─── Portfolio data ─── */
const totalValue = PORTFOLIO_PROPERTIES.reduce((s, p) => s + p.currentValue, 0);
const THRESHOLD = 2_000_000;
const eligible = totalValue >= THRESHOLD;
const gap = Math.max(THRESHOLD - totalValue, 0);
const buffer = Math.max(totalValue - THRESHOLD, 0);
const pct = Math.min((totalValue / THRESHOLD) * 100, 100);

const fmt = (v: number) =>
  v >= 1_000_000
    ? `AED ${(v / 1_000_000).toFixed(2)}M`
    : `AED ${(v / 1_000).toFixed(0)}K`;

/* ─── Idea 11: AI Application Wizard steps ─── */
const WIZARD_STEPS = [
  {
    id: 1,
    title: "Eligibility Verification",
    subtitle: "Confirm portfolio value meets DLD threshold",
    status: "completed" as const,
    detail: "Your portfolio value of AED 2.85M exceeds the AED 2M DLD minimum for the 10-year Golden Visa. Taormina Village (AED 2.04M) alone qualifies as a single-property holding.",
    aiNote: "AI verified: Taormina Village title deed matches DLD registry. Property is off-plan but an SPA above AED 2M issued by a registered developer qualifies under GDRFA 2024 guidelines.",
    docs: ["Title Deed / SPA", "Emirates ID"]
  },
  {
    id: 2,
    title: "Document Collection",
    subtitle: "Gather required supporting documents",
    status: "active" as const,
    detail: "Collect all required documents before submitting. Missing items can delay the application by 4–6 weeks.",
    aiNote: "AI tip: Passport must have at least 6 months validity at time of submission. UAE-issued documents must be attested by MOFA. Off-plan SPA needs RERA registration stamp.",
    docs: ["Valid passport (6+ months)", "UAE entry stamp / visa", "Passport-size photo (white bg)", "RERA-stamped SPA", "DLD registration form (Form X)", "NOC from developer (if off-plan)"]
  },
  {
    id: 3,
    title: "Property Verification",
    subtitle: "DLD validates property title and value",
    status: "pending" as const,
    detail: "Submit your SPA or Title Deed to DLD for official valuation stamp. For off-plan properties, the registered SPA value is used for eligibility assessment.",
    aiNote: "Processing time: 3–5 business days. DLD fee: AED 4,020 (standard). Your Taormina SPA was registered on 2024-07-22 — eligible for submission.",
    docs: ["SPA with RERA stamp", "DLD e-form submission"]
  },
  {
    id: 4,
    title: "GDRFA Application",
    subtitle: "Submit Golden Visa application to GDRFA",
    status: "pending" as const,
    detail: "Submit your completed application package to the General Directorate of Residency and Foreigners Affairs (GDRFA Dubai). Applications can be submitted online or in-person at Happiness Centres.",
    aiNote: "AI scheduling: Available GDRFA appointments in Dubai are typically 2–3 weeks out. Online channel via ICA Smart Services reduces wait time. SmartBricks can pre-fill your application form.",
    docs: ["Completed GDRFA form", "Medical fitness certificate", "Emirates health insurance"]
  },
  {
    id: 5,
    title: "Biometrics & Approval",
    subtitle: "Complete biometric registration",
    status: "pending" as const,
    detail: "Attend the GDRFA centre for biometric capture (fingerprints + photo). Approval is typically issued within 5–10 working days after successful biometrics.",
    aiNote: "Typical approval rate for property investors meeting the AED 2M threshold is >97% (GDRFA 2025 data). Common rejection causes: incomplete medical certificate, insurance lapse.",
    docs: []
  },
  {
    id: 6,
    title: "Visa Issued & Renewal",
    subtitle: "Receive 10-year residency visa",
    status: "pending" as const,
    detail: "Your 10-year Golden Visa is stamped in your passport. Renewal is required every 10 years, subject to continued qualifying investment. SmartBricks will send a renewal reminder 90 days before expiry.",
    aiNote: "Visa covers: Yourself + spouse + unmarried children under 25 + domestic workers. You can sponsor family members for the same 10-year period.",
    docs: []
  },
];

/* ─── Idea 12: Gap Funding Advisor properties ─── */
const GAP_PROPERTIES = [
  {
    id: "gp1",
    name: "Binghatti Orchid",
    zone: "JVC",
    ask: 889000,
    yield: 8.2,
    tag: "Would add AED 889K to portfolio value",
  },
  {
    id: "gp2",
    name: "Azurline Residences",
    zone: "JVC",
    ask: 975000,
    yield: 7.8,
    tag: "1 B/R · 639 sqft · ready",
  },
  {
    id: "gp3",
    name: "ELARIS Sky",
    zone: "JVC",
    ask: 1057521,
    yield: 7.6,
    tag: "DLD verified · closes gap in 1 purchase",
  },
];

/* ══════════════════════════════════════════
   PAGE COMPONENT
══════════════════════════════════════════ */
export default function VisaPage() {
  const { tier } = useDemoAccount();
  const [activeStep, setActiveStep] = useState(1);
  const [dependents, setDependents] = useState(1); // spouse
  const [children, setChildren] = useState(2);
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  const toggleDoc = (key: string) =>
    setCheckedDocs((prev) => ({ ...prev, [key]: !prev[key] }));

  const currentStep = WIZARD_STEPS.find((s) => s.id === activeStep)!;

  const totalSponsored = 1 + dependents + children; // self + spouse + kids
  const visaExpiry = new Date();
  visaExpiry.setFullYear(visaExpiry.getFullYear() + 10);

  return (
    <div className="foresight-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold">
                🇦🇪 GOLDEN VISA
              </span>
            </div>
            <h1 className="text-xl font-bold text-white">Visa & Compliance Hub</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              UAE Golden Visa pathway · AI-guided application process
            </p>
          </div>
          <Link
            href="https://calendly.com/d/csz4-4hq-m39/smart-bricks-investment-consultation"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-colors text-sm shrink-0"
          >
            <Shield className="w-4 h-4" />
            Book Free Consultation
          </Link>
        </div>

        {/* ══ Eligibility Hero ══ */}
        <div className={cn(
          "rounded-2xl border p-6",
          eligible
            ? "border-amber-500/30 bg-linear-to-br from-amber-500/10 via-amber-500/5 to-transparent"
            : "border-red-500/30 bg-linear-to-br from-red-500/10 via-red-500/5 to-transparent"
        )}>
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Left: status */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🇦🇪</span>
                <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-white">
                UAE 10-Year Golden Visa
              </h2>
              <MonetizationTooltip content="💰 Transaction Revenue + Pro Retention | 1.5% of deal value — Golden Visa eligibility unlocks a property transaction (AED 2M+), earning SmartBricks AED 30K+ per qualifying referral." side="bottom" width="w-80" />
              {eligible && (
                      <span className="text-xs bg-amber-500 text-black font-bold px-2 py-0.5 rounded-full">
                        ELIGIBLE ✓
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">Real Estate Investor Category · GDRFA Dubai</p>
                </div>
              </div>

              {eligible ? (
                <p className="text-sm text-amber-300 leading-relaxed">
                  Your portfolio value of <strong className="text-white">{fmt(totalValue)}</strong> exceeds the{" "}
                  <strong className="text-white">AED 2M DLD threshold</strong>. You qualify for a 10-year residency visa including
                  spouse and dependents sponsorship.
                </p>
              ) : (
                <p className="text-sm text-red-300 leading-relaxed">
                  Your portfolio value of <strong className="text-white">{fmt(totalValue)}</strong> is{" "}
                  <strong className="text-white">{fmt(gap)}</strong> short of the AED 2M threshold. See the Gap Funding Advisor below.
                </p>
              )}
            </div>

            {/* Right: progress circle */}
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  background: `conic-gradient(#f59e0b ${pct * 3.6}deg, rgba(255,255,255,0.06) 0deg)`,
                  padding: "4px",
                }}
              >
                <div className="w-full h-full rounded-full bg-[#0a0e1a] flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-amber-400 tabular-nums">{pct.toFixed(0)}%</span>
                  <span className="text-[9px] text-slate-500 mt-0.5">of threshold</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-white font-semibold tabular-nums">{fmt(totalValue)}</p>
                <p className="text-[10px] text-slate-500">of AED 2.00M required</p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${pct}%`,
                  background: eligible
                    ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                    : "linear-gradient(90deg, #ef4444, #f87171)",
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>AED 0</span>
              {eligible && buffer > 0 && (
                <span className="text-amber-400 font-semibold">
                  +{fmt(buffer)} buffer above threshold
                </span>
              )}
              <span>AED 2M</span>
            </div>
          </div>

          {eligible && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {[
                { label: "Visa Duration", value: "10 years" },
                { label: "Eligible From", value: "Jul 2024" },
                { label: "Qualifying Property", value: "Taormina Village" },
                { label: "Est. Expiry", value: visaExpiry.toLocaleDateString("en-AE", { month: "short", year: "numeric" }) },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl bg-amber-500/5 border border-amber-500/15 px-3 py-2">
                  <p className="text-[10px] text-amber-300/70">{stat.label}</p>
                  <p className="text-xs font-bold text-white mt-0.5">{stat.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ══ IDEA 11: AI Application Wizard ══ */}
        <div className="rounded-2xl border border-white/10 bg-white/3 overflow-hidden">
          <div className="px-5 pt-5 pb-3 flex items-center gap-2 border-b border-white/8">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-bold text-white">AI Application Wizard</h2>
            <MonetizationTooltip content="💰 Pro Feature + Consultation Funnel | AED 149/mo MRR + AED 500–2,000 consultation fee — the wizard guides users to book a paid consultation call for end-to-end visa submission." side="bottom" width="w-80" />
            <span className="text-[10px] text-blue-400 bg-blue-500/15 border border-blue-500/20 px-1.5 py-0.5 rounded-full ml-auto">
              Step {activeStep} of {WIZARD_STEPS.length}
            </span>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Step sidebar */}
            <div className="md:w-56 border-b md:border-b-0 md:border-r border-white/8 p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">
              {WIZARD_STEPS.map((step) => {
                const isActive = step.id === activeStep;
                const isDone = step.status === "completed" || (step.id < activeStep);
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all shrink-0 md:shrink",
                      isActive
                        ? "bg-blue-600/20 border border-blue-500/30"
                        : "hover:bg-white/5 border border-transparent"
                    )}
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold",
                      isDone
                        ? "bg-emerald-500 text-white"
                        : isActive
                        ? "bg-blue-600 text-white"
                        : "bg-white/10 text-slate-400"
                    )}>
                      {isDone ? <CheckCircle2 className="w-3 h-3" /> : step.id}
                    </div>
                    <span className={cn(
                      "text-xs font-medium whitespace-nowrap md:whitespace-normal",
                      isActive ? "text-white" : isDone ? "text-emerald-300" : "text-slate-400"
                    )}>
                      {step.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Step content */}
            <div className="flex-1 p-5 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-white">{currentStep.title}</h3>
                  {currentStep.status === "completed" && (
                    <span className="text-xs text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">Completed ✓</span>
                  )}
                  {currentStep.status === "active" && (
                    <span className="text-xs text-blue-400 bg-blue-500/15 border border-blue-500/30 px-1.5 py-0.5 rounded-full">In Progress</span>
                  )}
                </div>
                <p className="text-xs text-slate-400">{currentStep.subtitle}</p>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">{currentStep.detail}</p>

              {/* AI Note */}
              <div className="rounded-xl bg-blue-500/5 border border-blue-500/20 p-3 flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-300 leading-relaxed">{currentStep.aiNote}</p>
              </div>

              {/* Document checklist for this step */}
              {currentStep.docs.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-300 mb-2">Required documents for this step:</p>
                  <div className="space-y-1.5">
                    {currentStep.docs.map((doc) => {
                      const key = `${currentStep.id}-${doc}`;
                      const checked = !!checkedDocs[key];
                      return (
                        <button
                          key={doc}
                          onClick={() => toggleDoc(key)}
                          className="flex items-center gap-2 w-full text-left"
                        >
                          <div className={cn(
                            "w-4 h-4 rounded border flex items-center justify-center shrink-0",
                            checked
                              ? "bg-emerald-500 border-emerald-500"
                              : "border-white/20 bg-white/5"
                          )}>
                            {checked && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <span className={cn("text-xs", checked ? "text-slate-500 line-through" : "text-slate-300")}>
                            {doc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center gap-2 pt-2">
                {activeStep > 1 && (
                  <button
                    onClick={() => setActiveStep(activeStep - 1)}
                    className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-400 hover:bg-white/10 transition-colors"
                  >
                    ← Previous
                  </button>
                )}
                <div className="flex-1" />
                {activeStep < WIZARD_STEPS.length ? (
                  <button
                    onClick={() => setActiveStep(activeStep + 1)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors"
                  >
                    Next step <ArrowRight className="w-3 h-3" />
                  </button>
                ) : (
                  <Link
                    href="https://calendly.com/d/csz4-4hq-m39/smart-bricks-investment-consultation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-black rounded-xl text-xs font-bold hover:bg-amber-400 transition-colors"
                  >
                    Book consultation to submit <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ══ IDEA 13: Family Sponsorship Calculator ══ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/3 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-bold text-white">Family Sponsorship Calculator</h2>
              <MonetizationTooltip content="💰 Engagement Stickiness → Pro Retention | AED 149/mo MRR — family sponsorship involvement emotionally anchors users (they’re protecting their family’s UAE status), dramatically increasing Pro retention." side="bottom" width="w-80" />
            </div>
            <p className="text-xs text-slate-400">
              Your 10-year Golden Visa covers you, your spouse, and unmarried children under 25. Adjust below to see who qualifies.
            </p>

            {/* Controls */}
            <div className="space-y-3">
              {[
                {
                  label: "Spouse / Partner",
                  value: dependents,
                  max: 1,
                  onChange: setDependents,
                  note: "1 spouse permitted",
                },
                {
                  label: "Children under 25",
                  value: children,
                  max: 8,
                  onChange: setChildren,
                  note: "Unmarried children",
                },
              ].map((ctrl) => (
                <div key={ctrl.label} className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-xs text-white font-medium">{ctrl.label}</p>
                    <p className="text-[10px] text-slate-500">{ctrl.note}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => ctrl.onChange(Math.max(0, ctrl.value - 1))}
                      className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-bold text-white w-4 text-center tabular-nums">{ctrl.value}</span>
                    <button
                      onClick={() => ctrl.onChange(Math.min(ctrl.max, ctrl.value + 1))}
                      className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Result */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <BadgeCheck className="w-4 h-4 text-amber-400" />
                <p className="text-xs font-bold text-amber-300">Your visa covers:</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Yourself (primary holder)", dependents > 0 ? "Spouse / Partner" : null, ...Array.from({ length: children }, (_, i) => `Child ${i + 1}`)].filter(Boolean).map((person) => (
                  <span
                    key={person as string}
                    className="text-xs bg-amber-500/15 text-amber-300 border border-amber-500/25 px-2.5 py-1 rounded-full font-medium"
                  >
                    ✓ {person}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-3">
                <strong className="text-white">{totalSponsored} people</strong> covered under 1 Golden Visa for 10 years.{" "}
                No additional property required for family members.
              </p>
            </div>

            <div className="border-t border-white/10 pt-3">
              <p className="text-[10px] text-slate-500">
                Domestic workers may also be sponsored under a separate UAE work permit. For children over 18 and under 25, proof of enrollment in a UAE university may be required. Source: GDRFA Dubai 2025.
              </p>
            </div>
          </div>

          {/* ══ IDEA 12: Gap Funding Advisor ══ */}
          <div className="rounded-2xl border border-white/10 bg-white/3 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">
                {eligible ? "Protect Your Eligibility" : "Gap Funding Advisor"}
              </h2>
              <MonetizationTooltip content="💰 Transaction Revenue | 1.5% of deal value — the Gap Funding Advisor surfaces qualifying properties to close the AED 2M gap, each referral worth AED 13K–22K in transaction commission." side="bottom" width="w-80" />
            </div>

            {eligible ? (
              <>
                <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-3">
                  <p className="text-xs text-emerald-300 leading-relaxed">
                    You have a <strong className="text-white">{fmt(buffer)}</strong> buffer above the AED 2M threshold.
                    A market correction of greater than <strong className="text-white">{((buffer / totalValue) * 100).toFixed(1)}%</strong> could risk your eligibility.
                  </p>
                </div>
                <p className="text-xs text-slate-400">
                  Adding a qualifying property solidifies your eligibility against market volatility and opens family sponsorship for additional dependents.
                </p>

                <div className="space-y-2">
                  {GAP_PROPERTIES.map((prop) => (
                    <div key={prop.id} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/3 p-3">
                      <Home className="w-4 h-4 text-slate-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white">{prop.name}</p>
                        <p className="text-[10px] text-slate-500">{prop.zone} · {prop.tag}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-bold text-white tabular-nums">{fmt(prop.ask)}</p>
                        <p className="text-[10px] text-emerald-400">{prop.yield}% yield</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="rounded-xl bg-red-500/5 border border-red-500/20 p-3">
                  <p className="text-xs text-red-300 leading-relaxed">
                    You need <strong className="text-white">{fmt(gap)}</strong> more in portfolio value to reach the AED 2M threshold.
                    The properties below would close the gap in a single purchase.
                  </p>
                </div>

                <div className="space-y-2">
                  {GAP_PROPERTIES.filter((p) => p.ask >= gap).map((prop) => (
                    <div key={prop.id} className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                      <Home className="w-4 h-4 text-amber-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white">{prop.name}</p>
                        <p className="text-[10px] text-slate-500">{prop.zone} · Closes gap</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-bold text-amber-400 tabular-nums">{fmt(prop.ask)}</p>
                        <p className="text-[10px] text-slate-400">{prop.yield}% yield</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <Link
              href="/dashboard/property"
              className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-xs text-emerald-300 font-semibold hover:bg-emerald-600/30 transition-colors"
            >
              Browse qualifying properties
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* ── Document Requirements Reference ── */}
        <div className="rounded-2xl border border-white/10 bg-white/3 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-bold text-white">Full Document Checklist</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {[
              { doc: "Valid passport (6+ months validity)", required: true },
              { doc: "Emirates ID or UAE entry visa", required: true },
              { doc: "Passport-size photo (white background)", required: true },
              { doc: "Title Deed or RERA-stamped SPA", required: true },
              { doc: "DLD registration form (Form X)", required: true },
              { doc: "NOC from developer (off-plan only)", required: false },
              { doc: "Medical fitness certificate", required: true },
              { doc: "UAE-approved health insurance", required: true },
              { doc: "Completed GDRFA application form", required: true },
            ].map(({ doc, required }) => {
              const key = `full-${doc}`;
              const checked = !!checkedDocs[key];
              return (
                <button
                  key={doc}
                  onClick={() => toggleDoc(key)}
                  className="flex items-start gap-2 text-left p-2 rounded-xl hover:bg-white/3 transition-colors"
                >
                  <div className={cn(
                    "w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5",
                    checked ? "bg-emerald-500 border-emerald-500" : "border-white/20 bg-white/5"
                  )}>
                    {checked && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <div>
                    <span className={cn("text-xs", checked ? "text-slate-500 line-through" : "text-slate-300")}>{doc}</span>
                    {!required && <span className="ml-1 text-[10px] text-slate-500">(if applicable)</span>}
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-slate-500 pt-1">
            Document requirements as per GDRFA Dubai 2025 guidelines. Requirements may vary — consult a licensed immigration advisor to confirm your specific case.
            <Link href="https://calendly.com/d/csz4-4hq-m39/smart-bricks-investment-consultation" target="_blank" className="text-amber-400 ml-1 hover:text-amber-300">Book a free SmartBricks consultation →</Link>
          </p>
        </div>

      </div>
    </div>
  );
}
