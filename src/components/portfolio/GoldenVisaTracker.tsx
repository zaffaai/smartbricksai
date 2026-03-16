"use client";
import Link from "next/link";

interface GoldenVisaTrackerProps {
  portfolioValue: number;
  threshold?: number;
}

export default function GoldenVisaTracker({
  portfolioValue,
  threshold = 2000000,
}: GoldenVisaTrackerProps) {
  const pct = Math.min((portfolioValue / threshold) * 100, 100);
  const eligible = portfolioValue >= threshold;
  const gap = Math.max(threshold - portfolioValue, 0);

  return (
    <div className="rounded-2xl border border-amber-500/20 bg-linear-to-br from-amber-500/10 to-transparent p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🇦🇪</span>
        <div>
          <p className="text-sm font-bold text-white">Golden Visa Pathway</p>
          <p className="text-xs text-amber-300/70">UAE DLD eligibility tracker</p>
        </div>
        {eligible && (
          <span className="ml-auto text-xs bg-amber-500 text-black font-bold px-2 py-0.5 rounded-full">
            ELIGIBLE ✓
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-slate-400 mb-1.5">
          <span>Portfolio Value</span>
          <span className="text-white font-semibold">
            AED {(portfolioValue / 1000000).toFixed(2)}M
          </span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${pct}%`,
              background: eligible
                ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                : "linear-gradient(90deg, #f59e0b88, #f59e0b)",
            }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
          <span>AED 0</span>
          <span>AED 2M threshold</span>
        </div>
      </div>

      {/* Status */}
      {eligible ? (
        <div className="rounded-lg bg-amber-500/15 border border-amber-500/30 p-3">
          <p className="text-xs text-amber-300 font-medium">
            ✅ Your portfolio (AED {(portfolioValue / 1000000).toFixed(2)}M) exceeds the AED 2M DLD threshold. You are eligible for the 10-year UAE Golden Visa.
          </p>
          <div className="flex flex-col gap-2 mt-2">
            <Link
              href="https://calendly.com/d/csz4-4hq-m39/smart-bricks-investment-consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block text-center text-xs bg-amber-500 text-black font-bold py-1.5 rounded-lg hover:bg-amber-400 transition-colors"
            >
              Start Application →
            </Link>
            <Link
              href="https://calendly.com/d/csz4-4hq-m39/smart-bricks-investment-consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center text-[10px] text-amber-400 hover:text-amber-300 transition-colors"
            >
              Or book a free consultation →
            </Link>
          </div>
        </div>
      ) : (
        <p className="text-xs text-slate-400">
          You need{" "}
          <span className="text-amber-300 font-semibold">
            AED {gap.toLocaleString()}
          </span>{" "}
          more to qualify. Explore qualifying properties below.
        </p>
      )}
    </div>
  );
}
