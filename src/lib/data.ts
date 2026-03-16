// Shared seed data used across dashboard screens
// In a real build this would come from DLD API / internal DB

export const MARKET_SNAPSHOT = {
  totalTransactions: 56923,
  avgPricePsf: 1380,
  avgYield: 6.8,
  qoqGrowth: 3.2,
  yoyGrowth: 14.7,
  activeListings: 12847,
  offPlanShare: 62,
  date: "March 2026",
};

export const PORTFOLIO_PROPERTIES = [
  {
    id: "autumn-jvc",
    name: "Autumn 2",
    community: "Seasons Community, JVC",
    zone: "Jumeirah Village Circle",
    type: "Apartment",
    status: "Ready" as const,
    bedrooms: 1,
    sqft: 664,
    purchasePrice: 650000,
    purchaseDate: "2024-03-10",
    currentValue: 814438,
    monthlyRent: 5400,
    annualRent: 64800,
    yield: 7.9,
    roi: 25.7,
    smartbricksScore: 95,
    goldenVisaEligible: false,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
    alphaZone: 0.6,
    offPlan: false,
  },
  {
    id: "taormina-majan",
    name: "Taormina Village",
    community: "Majan, Dubai Land",
    zone: "Dubai Land",
    type: "Townhouse",
    status: "Off-Plan" as const,
    bedrooms: 4,
    sqft: 1993,
    purchasePrice: 2039990,
    purchaseDate: "2024-07-22",
    currentValue: 2039990,
    monthlyRent: 0,
    annualRent: 0,
    yield: 0,
    roi: 22.3,
    smartbricksScore: 93,
    goldenVisaEligible: true,
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80",
    alphaZone: 0.5,
    offPlan: true,
    deliveryDate: "Q4 2027",
    constructionProgress: 38,
    paymentPlan: [
      { milestone: "Booking", percent: 10, amount: 203999, paid: true, date: "Jul 2024" },
      { milestone: "30% Construction", percent: 20, amount: 407998, paid: true, date: "Jan 2025" },
      { milestone: "60% Construction", percent: 30, amount: 611997, paid: false, date: "Sep 2025" },
      { milestone: "Handover", percent: 40, amount: 815996, paid: false, date: "Q4 2027" },
    ],
  },
];

export const ZONE_ALPHAS: Record<string, number> = {
  "Downtown Dubai": 1.2,
  "Palm Jumeirah": 1.0,
  "Dubai Marina": 0.9,
  "Business Bay": 0.8,
  "Jumeirah Village Circle": 0.6,
  "Dubai Land": 0.5,
  "Dubai Investment Park": 0.4,
};

export const BASE_CAGR = 0.048; // 4.8% Dubai long-term residential CAGR
export const BETA_MACRO = 0.012; // UAE Vision 2031 / Expo legacy multiplier
export const DELTA_RISK = 0.008; // Risk discount (oversupply index)

/** Foresight formula: V_t = V_0 * (1 + r_base + alpha_zone + beta_macro - delta_risk)^t */
export function calcForesight(
  v0: number,
  alphaZone: number,
  t: number,
  scenario: "bear" | "base" | "bull"
) {
  const sigmaAdj = scenario === "bear" ? -0.015 : scenario === "bull" ? +0.015 : 0;
  const r = BASE_CAGR + alphaZone / 100 + BETA_MACRO - DELTA_RISK + sigmaAdj;
  return Math.round(v0 * Math.pow(1 + r, t));
}

export const ALERT_FEED = [
  {
    id: "a1",
    type: "opportunity" as const,
    title: "JVC off-plan launches up 34% this month",
    body: "Early-entry window for Q4 2026 handover projects. Your existing JVC unit comps suggest pipeline demand is strong.",
    time: "2h ago",
    actionLabel: "Explore listings",
    actionHref: "/dashboard/property",
  },
  {
    id: "a2",
    type: "positive" as const,
    title: "Your Autumn 2 unit outperformed zone avg",
    body: "Comparable sales in JVC District 15 averaged AED 1,410/sqft vs your purchase at AED 1,227/sqft — implied unrealized gain: AED 122,612.",
    time: "Yesterday",
    actionLabel: "View property",
    actionHref: "/dashboard/portfolio/autumn-jvc",
  },
  {
    id: "a3",
    type: "warning" as const,
    title: "Off-plan payment milestone approaching",
    body: "Taormina Village: 60% construction milestone payment of AED 611,997 due in ~42 days.",
    time: "3 days ago",
    daysLeft: 42,
    actionLabel: "View payment plan",
    actionHref: "/dashboard/portfolio/taormina-majan",
  },
  {
    id: "a4",
    type: "info" as const,
    title: "Golden Visa: You're 87% of the way there",
    body: "Total portfolio value: AED 2.85M. You already qualify — Taormina alone (AED 2.04M) exceeds the AED 2M DLD threshold.",
    time: "5 days ago",
    actionLabel: "Check eligibility",
    actionHref: "/dashboard/portfolio",
  },
];

export const INTELLIGENCE_CARDS = [
  {
    id: "ic1",
    trigger: "price_drop",
    headline: "Autumn 2 — asking price dropped AED 15K since your first view",
    sub: "You viewed this property 4× in the last 14 days. Current ask is now AED 635,000.",
    cta: "Review offer",
    ctaHref: "/dashboard/portfolio/autumn-jvc",
    badge: "Price Drop",
    badgeColor: "green",
  },
  {
    id: "ic2",
    trigger: "yield_lag",
    headline: "Autumn 2 yield is 2.1% below zone benchmark",
    sub: "JVC District 15 short-term Airbnb avg yield: 10.0%. Your current long-term yield: 7.9%.",
    cta: "Optimize yield",
    ctaHref: "/dashboard/portfolio/autumn-jvc",
    badge: "Yield Alert",
    badgeColor: "amber",
  },
  {
    id: "ic3",
    trigger: "golden_visa",
    headline: "You qualify for the UAE Golden Visa",
    sub: "Taormina Village purchase price (AED 2,039,990) exceeds the AED 2M DLD threshold.",
    cta: "Start application",
    ctaHref: "/dashboard/portfolio",
    badge: "Golden Visa",
    badgeColor: "blue",
  },
];

export const DLD_RECENT_SALES = [
  { date: "17 Feb 2026", project: "Azurline Residences", br: "1 B/R", sqft: 639, price: 975000 },
  { date: "17 Feb 2026", project: "ELEVATE by Prescott", br: "1 B/R", sqft: 742, price: 1050000 },
  { date: "15 Feb 2026", project: "Samana Imperial Garden", br: "1 B/R", sqft: 451, price: 970000 },
  { date: "14 Feb 2026", project: "VOXA RESIDENCES", br: "1 B/R", sqft: 652, price: 1159900 },
  { date: "13 Feb 2026", project: "ELARIS Sky", br: "1 B/R", sqft: 733, price: 1057521 },
];

// For Foresight chart: generate year-by-year data for both properties
export function generateForesightData(v0: number, alphaZone: number) {
  return Array.from({ length: 6 }, (_, t) => ({
    year: t === 0 ? "Now" : `Year ${t}`,
    t,
    bear: calcForesight(v0, alphaZone, t, "bear"),
    base: calcForesight(v0, alphaZone, t, "base"),
    bull: calcForesight(v0, alphaZone, t, "bull"),
  }));
}
