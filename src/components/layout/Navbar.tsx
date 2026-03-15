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
  User,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard/property", label: "Explore", icon: Search },
  { href: "/dashboard/portfolio", label: "Portfolio", icon: LayoutDashboard },
  { href: "/dashboard/foresight", label: "Foresight", icon: TrendingUp, isPro: true, isAI: true },
  { href: "/dashboard/advisor", label: "AI Advisor", icon: BrainCircuit, isAI: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [demoSignedIn, setDemoSignedIn] = useState(false);

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

        {/* Market banner */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          UAE Live &nbsp;·&nbsp; UK & US launching soon
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon, isPro, isAI }) => {
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
                {isPro && (
                  <span className="text-[10px] bg-amber-100 text-amber-700 px-1 rounded font-semibold">
                    PRO
                  </span>
                )}
                {isAI && (
                  <span className="text-[9px] bg-blue-100 text-blue-600 px-1 rounded font-bold flex items-center gap-0.5">
                    <Sparkles className="w-2 h-2" />AI
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-2">
          {demoSignedIn ? (
            <button
              onClick={() => setShowAuth(true)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                N
              </div>
              <span className="font-medium">Nada</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => setShowAuth(true)}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign in
              </button>
              <button
                onClick={() => setShowAuth(true)}
                className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Create account
              </button>
            </>
          )}
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
          {navItems.map(({ href, label, icon: Icon, isPro, isAI }) => {
            const active = pathname === href;
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
                <span className="ml-auto flex items-center gap-1">
                  {isPro && (
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-1 rounded font-semibold">
                      PRO
                    </span>
                  )}
                  {isAI && (
                    <span className="text-[9px] bg-blue-100 text-blue-600 px-1 rounded font-bold flex items-center gap-0.5">
                      <Sparkles className="w-2 h-2" />AI
                    </span>
                  )}
                </span>
              </Link>
            );
          })}
          <div className="border-t border-gray-100 mt-2 pt-2 flex gap-2">
            <button onClick={() => { setShowAuth(true); setMobileOpen(false); }} className="flex-1 text-center text-sm py-2 text-gray-600">
              Sign in
            </button>
            <button onClick={() => { setShowAuth(true); setMobileOpen(false); }} className="flex-1 text-center text-sm py-2 bg-blue-600 text-white rounded-lg">
              Create account
            </button>
          </div>
        </div>
      )}
      </header>

      {/* Demo Auth Modal */}
      {showAuth && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4"
          onClick={() => setShowAuth(false)}
        >
          <div
            className="bg-[#111827] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <p className="text-base font-bold text-white">Welcome to SmartBricks</p>
              <button onClick={() => setShowAuth(false)} className="text-slate-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Demo banner */}
            <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-3 mb-4">
              <p className="text-xs text-blue-300 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Demo Mode Active
              </p>
              <p className="text-xs text-slate-400 mt-0.5">You&apos;re viewing as a UAE investor with 2 active properties.</p>
            </div>
            {/* Demo user */}
            <div className="flex items-center gap-3 mb-5 p-3 bg-white/3 border border-white/7 rounded-xl">
              <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                N
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Nada Al-Rashidi</p>
                <p className="text-xs text-slate-400">UAE Investor · Portfolio AED 2.69M</p>
              </div>
              <div className="ml-auto text-right shrink-0">
                <p className="text-xs font-bold text-emerald-400">+25.7% ROI</p>
                <p className="text-[10px] text-slate-500">2 properties</p>
              </div>
            </div>
            <button
              onClick={() => { setDemoSignedIn(true); setShowAuth(false); }}
              className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors text-sm mb-3"
            >
              Continue as Demo User →
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-slate-500">or sign in with</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {["Google", "Apple"].map((p) => (
                <button
                  key={p}
                  onClick={() => { setDemoSignedIn(true); setShowAuth(false); }}
                  className="flex items-center justify-center gap-2 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-300 font-medium hover:bg-white/10 transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  {p}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-600 text-center mt-3">
              Production auth coming soon · All data is demo-only
            </p>
          </div>
        </div>
      )}
    </>
  );
}
