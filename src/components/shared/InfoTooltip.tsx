"use client";
import { Info } from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "@/lib/cn";

interface Props {
  content: string;
  className?: string;
  /** Where the tooltip appears relative to the icon. Default: "top" */
  side?: "top" | "bottom" | "left" | "right";
  /** Width class override. Default: "w-56" */
  width?: string;
}

/**
 * A small (i) icon that shows a contextual tooltip on hover/focus.
 * Designed for both dark (foresight-bg) and light (explore/property) backgrounds.
 */
export default function InfoTooltip({ content, className, side = "top", width = "w-56" }: Props) {
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
        className="text-slate-500 hover:text-blue-400 transition-colors focus:outline-none"
        aria-label="More information"
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      {show && (
        <span
          className={cn(
            "absolute z-50 rounded-xl bg-[#1a2236] border border-blue-500/20 text-xs text-slate-300 p-3 shadow-2xl leading-relaxed pointer-events-none whitespace-normal",
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
