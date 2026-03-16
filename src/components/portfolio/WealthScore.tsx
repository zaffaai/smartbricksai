"use client";

interface WealthScoreProps {
  score: number; // 0–1000
  delta?: number;
  breakdown?: { label: string; value: number; max: number; color: string }[];
}

export default function WealthScore({ score, delta, breakdown }: WealthScoreProps) {
  const pct = score / 1000;
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - pct * 0.75);

  const getLabel = (s: number) => {
    if (s >= 800) return "Elite";
    if (s >= 650) return "Advanced";
    if (s >= 450) return "Growing";
    return "Starter";
  };
  const getColor = (s: number) => {
    if (s >= 800) return "#f59e0b";
    if (s >= 650) return "#10b981";
    if (s >= 450) return "#3b82f6";
    return "#94a3b8";
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Circular gauge */}
      <div className="relative w-36 h-36 score-glow">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          {/* Background arc */}
          <circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
            strokeDashoffset={0}
          />
          {/* Score arc */}
          <circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke={getColor(score)}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 1s ease-out, stroke 0.5s ease" }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white leading-none">{score}</span>
          <span className="text-xs font-medium mt-0.5" style={{ color: getColor(score) }}>
            {getLabel(score)}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5">/1000</span>
          {delta !== undefined && delta !== 0 && (
            <span className={`text-[10px] font-bold mt-0.5 ${delta > 0 ? "text-emerald-400" : "text-red-400"}`}>
              {delta > 0 ? `↑ +${delta}` : `↓ ${delta}`} this month
            </span>
          )}
        </div>
      </div>

      {/* Breakdown bars */}
      {breakdown && (
        <div className="w-full space-y-2">
          {breakdown.map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>{item.label}</span>
                <span className="font-medium text-white">{item.value}/{item.max}</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(item.value / item.max) * 100}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-slate-500 text-center leading-relaxed">
        Score updates monthly based on yield efficiency, capital growth, diversification, and liquidity.
      </p>
    </div>
  );
}
