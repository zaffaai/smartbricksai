"use client";
import { useState, useRef } from "react";
import { cn } from "@/lib/cn";

interface Props {
  content: string;
  className?: string;
  /** Where the tooltip appears relative to the trigger. Default: "top" */
  side?: "top" | "bottom" | "left" | "right";
  /** Width class override. Default: "w-64" */
  width?: string;
}

/**
 * A 💰 badge that reveals a monetization breakdown on hover.
 * Shows how each feature contributes to revenue (MRR, one-time, transaction %).
 */
export default function MonetizationTooltip({ content, className, side = "top", width = "w-64" }: Props) {
  const [show, setShow] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShow(true);
  };
  const close = () => {
    timerRef.current = setTimeout(() => setShow(false), 80);
  };

  return (
    <span className={cn("relative inline-flex items-center shrink-0", className)}>
      <button
        type="button"
        onMouseEnter={open}
        onMouseLeave={close}
        onFocus={open}
        onBlur={close}
        className="text-[11px] leading-none hover:opacity-80 transition-opacity focus:outline-none select-none"
        aria-label="Monetization model"
      >
        💰
      </button>

      {show && (
        <span
          className={cn(
            "absolute z-50 rounded-xl bg-[#1a1200] border border-amber-500/30 text-xs text-amber-100 p-3 shadow-2xl leading-relaxed pointer-events-none whitespace-normal",
            width,
            side === "top" && "bottom-full left-1/2 -translate-x-1/2 mb-2",
            side === "bottom" && "top-full left-1/2 -translate-x-1/2 mt-2",
            side === "left" && "right-full top-1/2 -translate-y-1/2 mr-2",
            side === "right" && "left-full top-1/2 -translate-y-1/2 ml-2",
          )}
          role="tooltip"
        >
          {content}
        </span>
      )}
    </span>
  );
}
