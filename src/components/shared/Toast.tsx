"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { CheckCircle2, Info, AlertTriangle, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/cn";

interface ToastItem {
  id: number;
  title: string;
  description?: string;
  type: "info" | "success" | "warning" | "ai";
}

interface ToastContextValue {
  toast: (
    title: string,
    opts?: { description?: string; type?: ToastItem["type"] }
  ) => void;
}

const ToastCtx = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastCtx);
}

const ICON = { info: Info, success: CheckCircle2, warning: AlertTriangle, ai: Sparkles };
const BORDER = {
  info: "border-blue-500/30",
  success: "border-emerald-500/30",
  warning: "border-amber-500/30",
  ai: "border-blue-500/40",
};
const ICON_COLOR = {
  info: "text-blue-400",
  success: "text-emerald-400",
  warning: "text-amber-400",
  ai: "text-blue-300",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback(
    (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id)),
    []
  );

  const toast = useCallback(
    (title: string, opts?: { description?: string; type?: ToastItem["type"] }) => {
      const id = Date.now();
      setToasts((prev) => [
        ...prev,
        { id, title, description: opts?.description, type: opts?.type ?? "info" },
      ]);
      setTimeout(() => dismiss(id), 4500);
    },
    [dismiss]
  );

  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2.5 pointer-events-none w-[320px] max-w-[calc(100vw-2.5rem)]">
        {toasts.map((t) => {
          const Icon = ICON[t.type];
          return (
            <div
              key={t.id}
              className={cn(
                "toast-in rounded-2xl border bg-[#0d1525] px-4 py-3.5 shadow-2xl flex items-start gap-3 pointer-events-auto",
                BORDER[t.type]
              )}
            >
              <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", ICON_COLOR[t.type])} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white leading-snug">{t.title}</p>
                {t.description && (
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{t.description}</p>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="text-slate-500 hover:text-white transition-colors mt-0.5 shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastCtx.Provider>
  );
}
