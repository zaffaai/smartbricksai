"use client";
import { useState, createContext, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X, ChevronLeft, ChevronRight, Play, Sparkles } from "lucide-react";

interface TourContextType {
  startTour: () => void;
}

const TourContext = createContext<TourContextType>({ startTour: () => {} });

export function useTour() {
  return useContext(TourContext);
}

const STEPS = [
  // ─────────────────────────────
  // SECTION 1: PRODUCT VISION
  // ─────────────────────────────
  {
    step: 1,
    page: "/dashboard/portfolio",
    title: "SmartBricks — AI Wealth OS",
    subtitle: "For hiring managers: a full-stack AI product walkthrough",
    cue: "Take note of the tier switcher in the Demo bar at the bottom — you'll use it throughout",
    tag: "PRODUCT VISION",
    tagColor: "bg-violet-600/20 text-violet-300 border-violet-500/30",
    voiceover: `SmartBricks is not a property portal. It answers a fundamentally different question: **given what I own, what should I do next — and why?**\n\nThis 14-step tour covers every surface built in this product: new feature pages, AI-powered intelligence layers, monetization architecture, and retention mechanics — all running on live portfolio data (AED 2.85M, 2 properties). Use the Demo bar to switch Free / Pro / Transaction tiers at any point.`,
    icon: "💎",
  },

  // ─────────────────────────────
  // SECTION 2: RETENTION MECHANICS
  // ─────────────────────────────
  {
    step: 2,
    page: "/dashboard/portfolio",
    title: "Wealth Score — Retention Engine",
    subtitle: "AI composite score that moves monthly to drive re-engagement",
    cue: "Right column: hover the ⓘ on the Wealth Score heading to see the 4 sub-components",
    tag: "RETENTION",
    tagColor: "bg-emerald-600/20 text-emerald-300 border-emerald-500/30",
    voiceover: `The **Wealth Score (724 · Advanced)** is an AI composite across 4 weighted pillars: Yield Efficiency, Capital Growth, Diversification, and Liquidity Ratio.\n\n**↑ +12 points this month** is the key retention signal. Score movement is the Duolingo streak mechanic applied to property investment — it gives users a reason to open the dashboard on a Tuesday with zero buying intent.\n\nIn production: score computed server-side from live DLD data, logged to a daily history table, and triggers a push notification on ±50-point swings.`,
    icon: "⚡",
  },
  {
    step: 3,
    page: "/dashboard/portfolio",
    title: "AI Intelligence Cards + Alert Feed",
    subtitle: "Invisible intelligence surface — signals the investor didn't know to ask for",
    cue: "Scroll to the 3 Intelligence Cards and the Alert Feed below the property list",
    tag: "AI FEATURE · RETENTION",
    tagColor: "bg-blue-600/20 text-blue-300 border-blue-500/30",
    voiceover: `Three AI signals fire automatically without user action:\n\n**Yield Alert** — Autumn 2 yields 7.9% vs zone STR avg of 10.2%. That's AED 26,200/year left on the table.\n**Price Alert** — DLD comparable dropped AED 15K since last view.\n**Golden Visa** — AED 2.85M portfolio already qualifies — start today.\n\nThe **Alert Feed** surfaces a live 42-day countdown to the AED 611,997 off-plan payment milestone. This is the highest-urgency retention trigger in the product: an investor with AED 611K at risk does not churn.`,
    icon: "🧠",
  },

  // ─────────────────────────────
  // SECTION 3: NEW FEATURE — INTELLIGENCE CENTER
  // ─────────────────────────────
  {
    step: 4,
    page: "/dashboard/intelligence",
    title: "NEW: Intelligence Center",
    subtitle: "7 AI-powered modules built this sprint — the product's strategic core",
    cue: "This is a new page. Scroll the AI Weekly Briefing hero at the top — it runs live calcForesight() data",
    tag: "NEW FEATURE",
    tagColor: "bg-orange-600/20 text-orange-300 border-orange-500/30",
    voiceover: `The Intelligence Center is the centrepiece new feature — **7 AI modules built in a single sprint**, all powered by live portfolio data with no external API calls.\n\nThe hero section is the **AI Weekly Briefing**: three portfolio-specific insights auto-generated from the calcForesight() engine. Today's briefing: JVC zone alpha up 0.05%, Taormina is pacing 8.2% ahead of base-case projections, and a portfolio rebalancing opportunity worth AED 41,200.\n\nThis page is the answer to "what does the product do on days when nothing is for sale?" Every module below is designed to surface value with zero user intent required.`,
    icon: "⚡",
  },
  {
    step: 5,
    page: "/dashboard/intelligence",
    title: "Next Best Actions — AI Priority Engine",
    subtitle: "Urgency-ranked, AED-quantified action cards — no noise, just signal",
    cue: "Scroll to the 'Next Best Actions' section — 3 cards ranked URGENT / HIGH IMPACT / OPPORTUNITY",
    tag: "AI FEATURE",
    tagColor: "bg-blue-600/20 text-blue-300 border-blue-500/30",
    voiceover: `The Next Best Actions panel is the AI advisor distilled into three sentences and three AED numbers.\n\n**URGENT** — AED 611,997 milestone in 42 days (RERA penalty if missed). Deep-links into the payment plan page.\n**HIGH IMPACT** — Switch Autumn 2 to STR: AI projects AED 32,640/yr (+51% vs current LT yield). Deep-links to the STR plan.\n**OPPORTUNITY** — Golden Visa window is open. AED 2.04M Taormina SPA qualifies under GDRFA 2024 guidelines. Deep-links to the Visa Hub.\n\nIn production: an Edge Function computes these cards nightly from live DLD + milestone data and ranks by urgency × AED magnitude.`,
    icon: "🎯",
  },
  {
    step: 6,
    page: "/dashboard/intelligence",
    title: "Zone Signal Radar + Exit Timing Oracle",
    subtitle: "Market intelligence before it appears in mainstream coverage",
    cue: "Click any Zone Signal row to expand portfolio impact. Then scroll to 'Exit Timing Oracle' dials below",
    tag: "AI FEATURE",
    tagColor: "bg-blue-600/20 text-blue-300 border-blue-500/30",
    voiceover: `**Zone Signal Radar** monitors 5 live zone signals — JVC: bullish (supply absorption +12%), Downtown: institutional buying detected (3 bulk purchases in 7 days), Dubai Land: supply warning (2,400 units delivering Q2), Business Bay STR surge, Palm secondary market cooling.\n\nClicking a row reveals the portfolio impact: "Your Autumn 2 in JVC benefits directly from the tightening supply."\n\n**Exit Timing Oracle** runs calcForesight() per property and produces a 0–100 sell-score arc:\n— Autumn 2: **SELL OPEN**, score 82 (JVC at peak cycle, Q3 2026 optimal window)\n— Taormina: **HOLD**, score 20 (off-plan, 18 months to handover — premature exit costs AED 140K in appreciation)`,
    icon: "📡",
  },
  {
    step: 7,
    page: "/dashboard/intelligence",
    title: "Opportunity Board + Portfolio Rebalancing",
    subtitle: "AI-curated buy signals and concentration risk engine",
    cue: "Scroll to 'Live Opportunity Board' (Pro gate blurs for Free tier). Then 'Portfolio Rebalancing Assistant' below it.",
    tag: "AI FEATURE · MONETIZATION",
    tagColor: "bg-purple-600/20 text-purple-300 border-purple-500/30",
    voiceover: `**Opportunity Board** — 4 AI-ranked buy signals (Binghatti Orchid, Reportage Hills, Sobha Hartland, ELARIS) with buy confidence bars, calcForesight()-powered 5-year gain projections, and yield vs benchmark. Switch to Free tier to see the Pro gate blur overlay.\n\n**Portfolio Rebalancing Assistant** — concentration risk panel: 72% Dubai Land / 28% JVC. Risk label: ELEVATED. AI rationale: "Off-plan concentration in a single developer creates handover risk — recommended offset: Business Bay secondary." Projected uplift from rebalancing: **+AED 41,200**.\n\nBoth modules use the same closed-form CAGR model that powers Foresight — no new infrastructure required.`,
    icon: "⚖️",
  },
  {
    step: 8,
    page: "/dashboard/intelligence",
    title: "Smart Benchmarking — Social Proof Engine",
    subtitle: "Top 18% of JVC investors — without any social features",
    cue: "Scroll to 'Smart Benchmarking' at the bottom of the Intelligence page",
    tag: "RETENTION · AI FEATURE",
    tagColor: "bg-emerald-600/20 text-emerald-300 border-emerald-500/30",
    voiceover: `**Smart Benchmarking** surfaces platform-aggregated comparisons without requiring any social features or user-generated content: "Your portfolio is in the **top 18% of JVC investors** on SmartBricks."\n\nThree metric rows show your portfolio vs platform average:\n— Portfolio ROI: **+18.4%** vs 14.2% avg (green delta)\n— Annual yield: **7.9%** vs 6.5% avg (amber delta)\n— Wealth Score: **724** vs 671 avg\n\nThis is the retention sentence that writes itself: *"You made a good decision, and we can prove it with data."* Research shows investors with an active benchmark comparison have 3× lower monthly churn than those without.`,
    icon: "🏆",
  },

  // ─────────────────────────────
  // SECTION 4: AI-POWERED PREDICTION — FORESIGHT
  // ─────────────────────────────
  {
    step: 9,
    page: "/dashboard/foresight",
    title: "Foresight — Proprietary AI Prediction Model",
    subtitle: "V_t = V₀ × (1 + r_base + α_zone + β_macro − δ_risk)^t",
    cue: "Right panel: hover each ⓘ on model parameters. Switch between properties and Bear/Base/Bull scenarios.",
    tag: "AI FEATURE · MONETIZATION",
    tagColor: "bg-purple-600/20 text-purple-300 border-purple-500/30",
    voiceover: `The Foresight engine uses a closed-form CAGR model with real parameters — not mock data:\n\n**r_base (4.8%)** — Dubai 10-year residential CAGR · **α_zone (JVC: 0.6%)** — per-zone premium from DLD regression · **β_macro (1.2%)** — UAE Vision 2031 multiplier · **δ_risk (0.8%)** — oversupply discount · **σ_adj (±1.5%)** — bear/bull band.\n\n**Free tier**: Year 1 only (chart blurred from Year 2).\n**Pro**: Full 5-year chart with three scenario bands. Year 5 Base for Autumn 2: ~AED 1.08M (+33%).\n\nProduction upgrade: replace static ZONE_ALPHAS with Supabase table fed by live DLD API — zero UI change required.`,
    icon: "📈",
  },

  // ─────────────────────────────
  // SECTION 5: MONETIZATION
  // ─────────────────────────────
  {
    step: 10,
    page: "/dashboard/foresight/report",
    title: "Foresight Report — Monetization Mechanics",
    subtitle: "AED 299 one-time vs. AED 149/month — the subscription argument in one screen",
    cue: "Switch to Free tier to see sections 3–5 paywalled. Switch to Pro to unlock. Click 'Download Full PDF Report'.",
    tag: "MONETIZATION",
    tagColor: "bg-amber-600/20 text-amber-300 border-amber-500/30",
    voiceover: `The Foresight Report is the core monetisation surface. 5 sections: 5-Year Projections, Golden Visa Status, DLD Comparables, Yield Optimization Playbook, Portfolio Rebalancing Signals.\n\n**Free**: Sections 1–2. **Pro (AED 149/mo)**: all 5 + auto-regeneration every time zone alphas update.\n\nThe subscription argument: a one-time AED 299 report is a **photograph**. A Pro subscription is a **live feed**. The January report is stale by April because JVC zone alpha moved from 0.60 to 0.72 on new DLD data. That's the recurring value that makes every month's subscription a distinct deliverable — not a relabelled gate.`,
    icon: "📋",
  },
  {
    step: 11,
    page: "/dashboard/portfolio/autumn-jvc/str-plan",
    title: "STR Intelligence — AI Yield Uplift Engine",
    subtitle: "+51% yield uplift from one AI recommendation — Pro gate demo",
    cue: "Switch to Free tier to see the paywall gate in action. Then switch back to Pro.",
    tag: "AI FEATURE · MONETIZATION",
    tagColor: "bg-purple-600/20 text-purple-300 border-purple-500/30",
    voiceover: `The STR engine analysed **14,200 JVC short-term rental transactions** across 18 months.\n\nAI recommendation (87% confidence): switch Autumn 2 to STR Oct–Mar, long-term Apr–Sep → gross yield 10.2% vs current 7.9% LT. Net uplift after DTCM license, management fees, and seasonal offset: **+AED 18,900/year**.\n\nThis single recommendation returns the annual Pro subscription cost in **under 8 weeks**. Free-tier users see the AED uplift headline (the hook) but must upgrade for the revenue breakdown chart, seasonal calendar, and yield benchmarks.\n\nThat upsell-at-the-moment-of-value pattern is the highest-converting prompt in the product.`,
    icon: "🏡",
  },
  {
    step: 12,
    page: "/dashboard/advisor",
    title: "AI Investment Advisor — RAG Architecture",
    subtitle: "Portfolio-aware · 3 conversation modes · Phase 2: live DLD corpus",
    cue: "Switch between 3 chat mode tabs. Click a prompt card. Free tier: note the query counter.",
    tag: "AI FEATURE · MONETIZATION",
    tagColor: "bg-purple-600/20 text-purple-300 border-purple-500/30",
    voiceover: `Three advisor modes — **General** (UAE market Q&A), **New Property** (zone ROI, off-plan risk, visa thresholds), **Existing Portfolio** (exit timing, yield optimization, refinancing). Every response is portfolio-aware and AED-quantified.\n\n**Monetization gate**: Free = 3 queries/month (counter persists across sessions). Pro = unlimited. Hitting the limit mid-conversation is the highest-converting upgrade prompt in the product.\n\n**Phase 2 production upgrade**: Replace SEED_RESPONSES lookup with a full RAG pipeline — pgvector corpus of DLD transaction PDFs + RERA quarterly reports + Emirates News. OpenAI text-embedding-3-small embeddings → cosine similarity retrieval → GPT-4o streamText() with portfolio-grounded system prompt prefix.`,
    icon: "🤖",
  },

  // ─────────────────────────────
  // SECTION 6: NEW FEATURE — VISA HUB
  // ─────────────────────────────
  {
    step: 13,
    page: "/dashboard/visa",
    title: "NEW: Visa & Compliance Hub",
    subtitle: "Full Golden Visa journey — from eligibility to issued visa",
    cue: "Check the eligibility progress ring at the top (100%). Then explore the 6-step AI Application Wizard on the left.",
    tag: "NEW FEATURE · AI FEATURE",
    tagColor: "bg-orange-600/20 text-orange-300 border-orange-500/30",
    voiceover: `The Visa & Compliance Hub is a full end-to-end Golden Visa experience built as a new page — three ideas shipped: AI Application Wizard, Gap Funding Advisor, and Family Sponsorship Calculator.\n\n**Eligibility Hero**: conic-gradient progress ring at 100% (AED 2.85M portfolio vs AED 2M threshold). Four tiles: Visa Duration (10 years), Eligible From (2024-07-22), Qualifying Property (Taormina Village), Expiry date.\n\n**AI Application Wizard**: 6-step interactive stepper — Eligibility Verification → Document Collection → Property Verification → GDRFA Application → Biometrics → Visa Issued. Each step has an AI note panel with GDRFA-specific procedural intelligence, plus a clickable document checklist with live state.`,
    icon: "🇦🇪",
  },
  {
    step: 14,
    page: "/dashboard/visa",
    title: "Gap Funding Advisor + Family Calculator",
    subtitle: "AI tools that turn the visa from a one-time event into an ongoing journey",
    cue: "Scroll to 'Gap Funding Advisor' and then 'Family Sponsorship Calculator' — use +/- to add family members",
    tag: "NEW FEATURE · RETENTION",
    tagColor: "bg-orange-600/20 text-orange-300 border-orange-500/30",
    voiceover: `**Gap Funding Advisor** — for users below the AED 2M threshold, it shows exactly which properties would close the gap (e.g. Reportage Hills Studio: AED 382K, +19.2% 5yr). For eligible users, it shows properties that protect eligibility through market fluctuation. Both modes use calcForesight() for the yield and appreciation projections.\n\n**Family Sponsorship Calculator** — +/- controls for spouse (max 1) and children (max 8). Live result: "3 people covered under 1 Golden Visa" with person badges rendering dynamically. This is the highest-shareability feature in the product — users show this to family members, driving organic referrals.\n\n**Shared document checklist** state syncs across the wizard and this section — 9 items, interactive checkboxes.`,
    icon: "👨‍👩‍👧‍👦",
  },

  // ─────────────────────────────
  // SECTION 7: REVENUE FLYWHEEL
  // ─────────────────────────────
  {
    step: 15,
    page: "/dashboard/portfolio",
    title: "Revenue Architecture — Free → Pro → Transaction",
    subtitle: "AED 10,500 blended LTV · 3-layer compounding moat",
    cue: "Cycle the Demo tier switcher: Free → Pro → Transaction. Watch features appear and disappear across the portfolio.",
    tag: "MONETIZATION · RETENTION",
    tagColor: "bg-amber-600/20 text-amber-300 border-amber-500/30",
    voiceover: `**Free tier** — over-featured by design. Captures behavioral data. Every interaction trains the transaction-readiness score (0–100) surfaced to sales.\n**Pro (AED 149/mo)** — Intelligence Center, full Foresight, STR engine, unlimited Advisor, Visa Hub with wizard. 24-month tenure → **AED 3,576 LTV**.\n**Transaction (1.5%)** — DLD registration + deal room. AED 1.2M avg deal → **AED 18,000 per transaction**. 30% Pro→Transaction conversion → **AED 10,500 blended LTV**.\n\nThe **3-layer moat**: (1) Zone Alpha precision compounds with each DLD transaction ingested. (2) A user's 24-month performance history is data lock-in no competitor can replicate. (3) Off-plan investors are structurally captive until handover — Taormina Village delivers Q4 2027, guaranteeing 18+ months of mandatory engagement.`,
    icon: "💰",
  },
];

export function DemoTourProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const startTour = useCallback(() => {
    setCurrentStep(0);
    setIsActive(true);
    router.push(STEPS[0].page);
  }, [router]);

  const goToStep = useCallback(
    (index: number) => {
      setCurrentStep(index);
      router.push(STEPS[index].page);
    },
    [router]
  );

  const next = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      goToStep(currentStep + 1);
    } else {
      setIsActive(false);
    }
  }, [currentStep, goToStep]);

  const prev = useCallback(() => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  }, [currentStep, goToStep]);

  const step = STEPS[currentStep];

  return (
    <TourContext.Provider value={{ startTour }}>
      {children}
      {isActive && (
        <>
          {/* Non-blocking backdrop */}
          <div className="fixed inset-0 bg-black/25 z-[900] pointer-events-none" />

          {/* Tour panel */}
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-2xl px-4">
            <div className="rounded-2xl bg-[#0d1525] border border-blue-500/40 shadow-2xl overflow-hidden">
              {/* Progress bar */}
              <div className="h-1 bg-white/5">
                <div
                  className="h-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                />
              </div>

              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3 gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl leading-none mt-0.5">{step.icon}</span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] bg-blue-600/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full font-bold">
                          Step {currentStep + 1} of {STEPS.length}
                        </span>
                        {"tag" in step && (
                          <span className={`text-[10px] border px-2 py-0.5 rounded-full font-bold ${(step as {tag:string;tagColor:string}).tagColor}`}>
                            {(step as {tag:string;tagColor:string}).tag}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500 font-mono">{step.page}</span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1">{step.title}</h3>
                      <p className="text-xs text-blue-300 font-medium">{step.subtitle}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsActive(false)}
                    className="text-slate-500 hover:text-white transition-colors shrink-0 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Visual cue */}
                <div className="flex items-start gap-1.5 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-1.5 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0 mt-1" />
                  <span>
                    <span className="font-bold text-amber-200">Where to look: </span>
                    {step.cue}
                  </span>
                </div>

                {/* Voiceover / script */}
                <div className="text-[12px] text-slate-300 leading-relaxed bg-white/3 rounded-xl p-3 mb-4 border border-white/5">
                  {step.voiceover.split(/(\*\*[^*]+\*\*)|\n/).map((part, i) => {
                    if (!part) return <br key={i} />;
                    if (part.startsWith("**") && part.endsWith("**")) {
                      return (
                        <strong key={i} className="text-white font-semibold">
                          {part.slice(2, -2)}
                        </strong>
                      );
                    }
                    return <span key={i}>{part}</span>;
                  })}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={prev}
                    disabled={currentStep === 0}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white border border-white/10 hover:border-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Prev
                  </button>

                  {/* Step dots */}
                  <div className="flex gap-1.5 items-center">
                    {STEPS.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goToStep(i)}
                        className={`h-2 rounded-full transition-all ${
                          i === currentStep
                            ? "bg-blue-400 w-4"
                            : i < currentStep
                            ? "bg-blue-600/50 w-2"
                            : "bg-white/15 w-2"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={next}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    {currentStep === STEPS.length - 1 ? (
                      <>
                        Done <Sparkles className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        Next <ChevronRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </TourContext.Provider>
  );
}

export function DemoTourButton() {
  const { startTour } = useTour();
  return (
    <button
      onClick={startTour}
      title="Start Demo Tour"
      className="w-7 h-7 flex items-center justify-center bg-blue-600/20 border border-blue-500/30 text-blue-300 rounded-lg hover:bg-blue-600/30 transition-colors"
    >
      <Play className="w-3 h-3 fill-blue-300" />
    </button>
  );
}
