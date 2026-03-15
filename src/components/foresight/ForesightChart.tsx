"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { generateForesightData, calcForesight } from "@/lib/data";
import { useState } from "react";
import { cn } from "@/lib/cn";

interface ForesightChartProps {
  propertyName: string;
  v0: number;
  alphaZone: number;
  compact?: boolean;
}

const fmt = (v: number) =>
  v >= 1000000
    ? `AED ${(v / 1000000).toFixed(2)}M`
    : `AED ${(v / 1000).toFixed(0)}K`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-[#1a2236] border border-blue-500/30 p-3 shadow-xl text-xs">
      <p className="font-bold text-white mb-2">{label}</p>
      <div className="space-y-1">
        <div className="flex justify-between gap-6">
          <span className="text-emerald-400">🟢 Bull</span>
          <span className="font-semibold text-white">{fmt(payload[2]?.value)}</span>
        </div>
        <div className="flex justify-between gap-6">
          <span className="text-blue-400">⚪ Base</span>
          <span className="font-semibold text-white">{fmt(payload[1]?.value)}</span>
        </div>
        <div className="flex justify-between gap-6">
          <span className="text-red-400">🔴 Bear</span>
          <span className="font-semibold text-white">{fmt(payload[0]?.value)}</span>
        </div>
      </div>
    </div>
  );
}

export default function ForesightChart({
  propertyName,
  v0,
  alphaZone,
  compact = false,
}: ForesightChartProps) {
  const [focusYear, setFocusYear] = useState(5);
  const data = generateForesightData(v0, alphaZone);

  const bear5 = calcForesight(v0, alphaZone, focusYear, "bear");
  const base5 = calcForesight(v0, alphaZone, focusYear, "base");
  const bull5 = calcForesight(v0, alphaZone, focusYear, "bull");

  const upside = (((base5 - v0) / v0) * 100).toFixed(1);

  return (
    <div className="flex flex-col gap-4">
      {/* Year selector */}
      {!compact && (
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400 shrink-0">Forecast Year:</span>
          <input
            type="range"
            min={1}
            max={5}
            value={focusYear}
            onChange={(e) => setFocusYear(+e.target.value)}
            className="flex-1 max-w-xs"
          />
          <span className="text-sm font-bold text-white bg-blue-600 px-2.5 py-0.5 rounded-lg min-w-10 text-center">
            Y{focusYear}
          </span>
        </div>
      )}

      {/* Chart */}
      <ResponsiveContainer width="100%" height={compact ? 140 : 240}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="bearGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="bullGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="year"
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
            width={42}
          />
          <Tooltip content={<CustomTooltip />} />
          {!compact && (
            <ReferenceLine
              x={focusYear === 0 ? "Now" : `Year ${focusYear}`}
              stroke="rgba(255,255,255,0.3)"
              strokeDasharray="4 4"
              label={{
                value: `Y${focusYear}`,
                fill: "white",
                fontSize: 10,
                position: "top",
              }}
            />
          )}
          <Area type="monotone" dataKey="bear" stroke="#ef4444" strokeWidth={1.5} fill="url(#bearGrad)" dot={false} />
          <Area type="monotone" dataKey="base" stroke="#3b82f6" strokeWidth={2.5} fill="url(#baseGrad)" dot={false} />
          <Area type="monotone" dataKey="bull" stroke="#10b981" strokeWidth={1.5} fill="url(#bullGrad)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>

      {/* Value at selected year */}
      {!compact && (
        <>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Bear Case", value: bear5, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
              { label: "Base Case", value: base5, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
              { label: "Bull Case", value: bull5, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className={cn("rounded-xl border p-3 text-center", bg)}>
                <p className={cn("text-xs font-semibold", color)}>{label}</p>
                <p className="text-sm font-bold text-white mt-1">{fmt(value)}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {(((value - v0) / v0) * 100).toFixed(1)}% vs today
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-xl bg-blue-600/10 border border-blue-500/20 p-3">
            <div>
              <p className="text-xs text-slate-400">{propertyName} · Year {focusYear} Base Case Upside</p>
              <p className="text-sm font-bold text-blue-400">+{upside}% expected capital gain</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Projected equity gain</p>
              <p className="text-sm font-bold text-white">
                +{fmt(base5 - v0)}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 text-[11px] text-slate-400">
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-emerald-400 inline-block" /> Bull (+1σ)</span>
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-400 inline-block" /> Base Case</span>
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-red-400 inline-block" /> Bear (−1σ)</span>
      </div>
    </div>
  );
}
