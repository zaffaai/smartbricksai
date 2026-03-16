"use client";
/**
 * DemoBanner — floating demo account switcher
 *
 * Renders as a pill bar pinned to the bottom of the viewport.
 * Clicking it expands to the full account selector panel.
 * Designed so a presenter can switch tiers live during a demo.
 */

import { useState } from "react";
import { useDemoAccount, DEMO_ACCOUNTS, type DemoAccount } from "@/lib/demo";
import { cn } from "@/lib/cn";
import { ChevronUp, ChevronDown, CheckCircle2, Lock, Sparkles, X } from "lucide-react";

const TIER_COLORS: Record<string, string> = {
  free: "text-slate-400 bg-slate-500/15 border-slate-500/30",
  pro: "text-blue-300 bg-blue-500/15 border-blue-500/30",
  transaction: "text-amber-300 bg-amber-500/15 border-amber-500/30",
};

const TIER_LABELS: Record<string, string> = {
  free: "FREE",
  pro: "PRO",
  transaction: "TRANSACTION",
};

function AccountCard({
  account,
  active,
  onSelect,
}: {
  account: DemoAccount;
  active: boolean;
  onSelect: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      className={cn(
        "rounded-2xl border transition-all",
        active
          ? "border-blue-500/60 bg-blue-500/10 ring-1 ring-blue-500/20"
          : "border-white/10 bg-white/3 hover:border-white/20"
      )}
    >
      {/* Header row */}
      <div className="flex items-center gap-3 p-4">
        {/* Avatar */}
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0",
            account.color
          )}
        >
          {account.initials}
        </div>

        {/* Name + title */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-white truncate">{account.name}</p>
            <span
              className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded-full border shrink-0",
                TIER_COLORS[account.tier]
              )}
            >
              {TIER_LABELS[account.tier]}
            </span>
          </div>
          <p className="text-xs text-slate-400 truncate">{account.portfolioLabel}</p>
          <p className="text-xs text-slate-500 truncate">{account.description}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-[10px] text-slate-400 hover:text-slate-200 transition-colors underline"
          >
            {showDetails ? "hide" : "details"}
          </button>
          <button
            onClick={onSelect}
            className={cn(
              "text-xs px-3 py-1.5 rounded-lg font-semibold transition-all",
              active
                ? "bg-blue-600 text-white cursor-default"
                : "bg-white/8 text-slate-300 hover:bg-white/15 border border-white/10"
            )}
          >
            {active ? "Active" : "Switch"}
          </button>
        </div>
      </div>

      {/* Expanded capabilities */}
      {showDetails && (
        <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/8 pt-3">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-2">
              Unlocked
            </p>
            <ul className="space-y-1">
              {account.capabilities.map((c) => (
                <li key={c} className="flex items-start gap-1.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
          {account.locked.length > 0 && (
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-2">
                Locked
              </p>
              <ul className="space-y-1">
                {account.locked.map((l) => (
                  <li key={l} className="flex items-start gap-1.5 text-xs text-slate-500">
                    <Lock className="w-3 h-3 text-slate-600 mt-0.5 shrink-0" />
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DemoBanner() {
  const { account, setAccount } = useDemoAccount();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Expanded panel */}
      {open && (
        <div className="fixed inset-0 z-200 flex items-end pointer-events-none">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-full pointer-events-auto max-h-[80vh] overflow-y-auto">
            <div className="max-w-3xl mx-auto px-4 pb-20">
              <div className="rounded-2xl border border-white/10 bg-[#0d1424] shadow-2xl p-5 space-y-4">
                {/* Panel header */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-400" />
                      <p className="text-sm font-bold text-white">Demo Account Switcher</p>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Switch tiers to preview the full subscription experience
                    </p>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-slate-500 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Account cards */}
                <div className="space-y-3">
                  {DEMO_ACCOUNTS.map((a) => (
                    <AccountCard
                      key={a.id}
                      account={a}
                      active={a.id === account.id}
                      onSelect={() => {
                        setAccount(a.id);
                        setOpen(false);
                      }}
                    />
                  ))}
                </div>

                {/* Footer note */}
                <p className="text-[11px] text-slate-600 text-center">
                  Demo mode — all data is seeded. No real accounts or payments.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky pill bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-150 pointer-events-auto">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#0d1424] border border-white/15 shadow-2xl hover:border-white/25 transition-all group"
        >
          {/* Avatar */}
          <div
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0",
              account.color
            )}
          >
            {account.initials}
          </div>

          {/* Name + tier */}
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-white leading-none">{account.name}</span>
              <span
                className={cn(
                  "text-[9px] font-bold px-1.5 py-0.5 rounded-full border",
                  TIER_COLORS[account.tier]
                )}
              >
                {TIER_LABELS[account.tier]}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 leading-none">
              {account.portfolioLabel}
            </span>
          </div>

          {/* Chevron */}
          <div className="text-slate-500 group-hover:text-slate-300 transition-colors">
            {open ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </button>
      </div>
    </>
  );
}
