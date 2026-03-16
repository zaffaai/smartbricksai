"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import {
  LayoutDashboard,
  Search,
  BrainCircuit,
  TrendingUp,
  Menu,
  X,
  Sparkles,
  Zap,
  Flag,
} from "lucide-react";
import { useState } from "react";
import { useDemoAccount } from "@/lib/demo";
import { DemoTourButton } from "@/components/shared/DemoTour";

const TIER_LABEL: Record<string, string> = {
  free: "FREE",
  pro: "PRO",
  transaction: "DEAL",
};

const navItems = [
  { href: "/dashboard/property", label: "Explore", icon: Search },
  { href: "/dashboard/portfolio", label: "Portfolio", icon: LayoutDashboard },
  { href: "/dashboard/intelligence", label: "Intelligence", icon: Zap },
  { href: "/dashboard/foresight", label: "Foresight", icon: TrendingUp },
  { href: "/dashboard/advisor", label: "Advisor", icon: BrainCircuit },
  { href: "/dashboard/visa", label: "Visa 🇦🇪", icon: Flag },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { account } = useDemoAccount();

  return (
    <>
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard/portfolio" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-sm tracking-tight">
            Smart<span className="text-blue-600">Bricks</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                  active
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Auth + Demo Tour */}
        <div className="hidden md:flex items-center gap-2">
          <DemoTourButton />
          <button
            onClick={() => setShowAuth(true)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold",
                account.color
              )}
            >
              {account.initials}
            </div>
            <span className="font-medium">{account.name.split(" ")[0]}</span>
            <span
              className={cn(
                "text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                account.tier === "free"
                  ? "bg-slate-100 text-slate-500"
                  : account.tier === "pro"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-amber-100 text-amber-700"
              )}
            >
              {TIER_LABEL[account.tier]}
            </span>
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium",
                  active ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
          <div className="border-t border-gray-100 mt-2 pt-2 flex gap-2">
            <button onClick={() => { setShowAuth(true); setMobileOpen(false); }} className="flex-1 text-center text-sm py-2 text-gray-600">
              Account
            </button>
          </div>
        </div>
      )}
      </header>

      {/* Demo Account Modal */}
      {showAuth && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-300 flex items-center justify-center p-4"
          onClick={() => setShowAuth(false)}
        >
          <div
            className="bg-[#111827] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <p className="text-base font-bold text-white">Demo Account</p>
              <button onClick={() => setShowAuth(false)} className="text-slate-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Demo mode notice */}
            <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-3 mb-4">
              <p className="text-xs text-blue-300 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Demo Mode Active
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Switch tiers using the account bar at the bottom of the screen.
              </p>
            </div>

            {/* Active account */}
            <div className="flex items-center gap-3 mb-4 p-3 bg-white/3 border border-white/7 rounded-xl">
              <div
                className={cn(
                  "w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0",
                  account.color
                )}
              >
                {account.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{account.name}</p>
                <p className="text-xs text-slate-400">{account.title}</p>
                <p className="text-xs text-slate-500">{account.portfolioLabel}</p>
              </div>
              <div className="shrink-0">
                <span
                  className={cn(
                    "text-[10px] font-bold px-2 py-1 rounded-full",
                    account.tier === "free"
                      ? "bg-slate-500/20 text-slate-300"
                      : account.tier === "pro"
                      ? "bg-blue-500/20 text-blue-300"
                      : "bg-amber-500/20 text-amber-300"
                  )}
                >
                  {TIER_LABEL[account.tier]}
                </span>
              </div>
            </div>

            {/* Capability summary */}
            <div className="bg-white/3 border border-white/7 rounded-xl p-3 mb-4">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-2">
                Active Tier Access
              </p>
              <ul className="space-y-1">
                {account.capabilities.slice(0, 4).map((c) => (
                  <li key={c} className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    {c}
                  </li>
                ))}
                {account.capabilities.length > 4 && (
                  <li className="text-xs text-slate-600">
                    +{account.capabilities.length - 4} more features
                  </li>
                )}
              </ul>
            </div>

            <button
              onClick={() => setShowAuth(false)}
              className="w-full py-2.5 bg-white/8 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/12 transition-colors text-sm"
            >
              Close
            </button>
            <p className="text-[10px] text-slate-600 text-center mt-3">
              Production auth coming soon · All data is demo-only
            </p>
          </div>
        </div>
      )}
    </>
  );
}
