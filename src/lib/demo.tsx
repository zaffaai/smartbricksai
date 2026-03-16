"use client";
/**
 * SmartBricks — Demo Tier System
 *
 * Three demo accounts, each locked to a different subscription tier.
 * The active account is stored in React context and persisted to
 * localStorage so refreshes keep the selected demo.
 *
 * Usage anywhere in the app:
 *   const { account, tier } = useDemoAccount();
 *   if (tier === 'pro') { ... }
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export type DemoTier = "free" | "pro" | "transaction";

export interface DemoAccount {
  id: string;
  tier: DemoTier;
  name: string;
  initials: string;
  title: string;
  portfolioLabel: string;
  color: string;          // Tailwind bg class for avatar
  description: string;   // One-liner for the tier switcher
  capabilities: string[];
  locked: string[];
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: "layla-free",
    tier: "free",
    name: "Layla Hassan",
    initials: "LH",
    title: "First-time Investor · Free Tier",
    portfolioLabel: "1 property · AED 814K",
    color: "bg-slate-600",
    description: "Exploring SmartBricks for the first time",
    capabilities: [
      "Portfolio overview (read-only)",
      "Foresight Year 1 preview only",
      "AI Advisor — 3 queries/month",
      "Market alerts (delayed 24h)",
      "Basic property search",
    ],
    locked: [
      "Foresight Years 2–5",
      "Full Foresight Report (Sections 3–5)",
      "Portfolio Rebalancing Engine",
      "Rent Optimization Engine",
      "Developer Risk Score",
      "Zone Radar signals",
      "Document Vault Scanner",
      "Smart AVM (full confidence interval)",
    ],
  },
  {
    id: "nada-pro",
    tier: "pro",
    name: "Nada Al-Rashidi",
    initials: "NA",
    title: "Active Investor · Pro Tier",
    portfolioLabel: "2 properties · AED 2.69M",
    color: "bg-blue-600",
    description: "Full platform access — AED 149/month",
    capabilities: [
      "Unlimited Foresight Reports (all 5 sections)",
      "Full 5-year projection (bear / base / bull)",
      "Portfolio Rebalancing Engine",
      "Rent Optimization — LT vs STR comparison",
      "Developer Risk Score (Taormina)",
      "AI Advisor — unlimited queries",
      "Zone Radar — top signal/week",
      "Document Vault Scanner — unlimited",
      "Smart AVM — full confidence interval",
      "Real-time market alerts",
      "Monthly AI Wealth Briefing",
    ],
    locked: [
      "Zone Radar — institutional data feed",
      "Transaction deal room",
      "Legal document review escalation",
      "STR nightly pricing calendar",
    ],
  },
  {
    id: "khalid-transaction",
    tier: "transaction",
    name: "Khalid Al-Mansoori",
    initials: "KM",
    title: "Institutional Investor · Transaction Tier",
    portfolioLabel: "5 properties · AED 12.4M",
    color: "bg-amber-600",
    description: "Full platform + deal room · 1.5% transaction fee",
    capabilities: [
      "Everything in Pro",
      "Zone Radar — full institutional pattern feed",
      "Smart AVM — used in deal room for mortgage/DLD",
      "In-app DLD registration + SPA document room",
      "Developer Risk — full escrow breakdown",
      "STR nightly pricing calendar",
      "Legal document review (SmartBricks Advisory)",
      "Priority AI Advisor (direct line to analyst)",
      "Transaction-fee deal closure (1.5%)",
      "Dedicated account manager",
    ],
    locked: [],
  },
];

interface DemoContextValue {
  account: DemoAccount;
  tier: DemoTier;
  setAccount: (id: string) => void;
  can: (feature: string) => boolean;
}

const DemoContext = createContext<DemoContextValue | null>(null);

const STORAGE_KEY = "sb_demo_account";

export function DemoProvider({ children }: { children: ReactNode }) {
  const [accountId, setAccountId] = useState<string>("nada-pro");

  // Restore from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && DEMO_ACCOUNTS.find((a) => a.id === saved)) {
      setAccountId(saved);
    }
  }, []);

  const setAccount = (id: string) => {
    setAccountId(id);
    localStorage.setItem(STORAGE_KEY, id);
  };

  const account = DEMO_ACCOUNTS.find((a) => a.id === accountId)!;

  /**
   * Feature gate helper.
   * Pass a keyword that should appear in the `locked` array or
   * check the tier directly for coarser gates.
   *
   * Examples:
   *   can('foresight-full')  → false for free tier
   *   can('rebalancing')     → true for pro/transaction
   */
  const can = (feature: string): boolean => {
    if (account.tier === "transaction") return true;
    const keyword = feature.toLowerCase();
    const isLocked = account.locked.some((l) => l.toLowerCase().includes(keyword));
    return !isLocked;
  };

  return (
    <DemoContext.Provider value={{ account, tier: account.tier, setAccount, can }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemoAccount(): DemoContextValue {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemoAccount must be used inside DemoProvider");
  return ctx;
}
