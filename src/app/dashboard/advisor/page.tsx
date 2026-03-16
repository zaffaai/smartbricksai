"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Phone, Sparkles, Lock } from "lucide-react";
import { cn } from "@/lib/cn";
import Link from "next/link";
import FeatureBadge from "@/components/shared/FeatureBadge";
import { useDemoAccount } from "@/lib/demo";

interface Message {
  role: "user" | "ai";
  content: string;
  ts: string;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderAIMarkdown(content: string): string {
  return content
    .replace(/\*\*(.*?)\*\*/g, (_m, g1: string) => `<strong>${escapeHtml(g1)}</strong>`)
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      (_m, text: string, href: string) => {
        const safeHref = href.startsWith("/") || href.startsWith("http") ? href : "#";
        return `<a href="${safeHref}" class="text-blue-400 underline hover:text-blue-300 transition-colors">${escapeHtml(text)}</a>`;
      }
    )
    .replace(/\n/g, "<br/>");
}

const SEED_RESPONSES: Record<string, string> = {
  "long-term investment": `**Key evaluation signals for UAE long-term investment:**

1. **SmartBricks Score** ≥ 85% — our AI ranks properties across 600+ data points
2. **Zone trajectory** — Downtown, Palm, Marina show highest 10-year CAGR (historically 6–9%)
3. **Rental yield** ≥ 6.5% (zone benchmark) signals healthy income coverage
4. **Off-plan risk-adjusted** — look for developers with DLD escrow-protected projects

For your existing portfolio: *Autumn 2 (JVC) scores 95% — positioned well for 5-7 year hold.*

→ [View Foresight 5-Year Projection](/dashboard/foresight)`,

  "short-term rental": `**ROI estimate: Short-Term Rental (STR) in Dubai**

For a 1-BR apartment in Dubai (avg 600–800 sqft):

| Strategy | Gross Yield | Net After Fees |
|---|---|---|
| Long-term lease | 6–8% | 5–7% |
| STR (Airbnb/Booking) | 9–12% | 7–10% |
| Mixed (6mo LT + 6mo STR) | 8–10% | 6–8% |

Your Autumn 2 unit (JVC) current yield: **7.9%**
Estimated STR yield: **10.2%**
Potential uplift: **+AED ~1,900/month**

*Note: Dubai requires DTCM holiday home license (approx AED 2,800/yr).*`,

  "DLD fee": `**Dubai Land Department (DLD) Buying Costs Breakdown:**

| Fee | Amount |
|---|---|
| DLD Transfer Fee | 4% of purchase price |
| Admin Fee | AED 4,200 (apartments) / AED 5,250 (villas) |
| Registration Trustee Fee | AED 2,000–4,000 |
| NOC Fee | AED 500–5,000 |
| Agent Commission | 2% (negotiable) |
| **Total (approx)** | **~6–7% of price** |

For your Autumn 2 purchase (AED 650,000):
Estimated total closing costs: **~AED 42,000**`,

  "rental yield": `**How to estimate rental yield:**

$$\\text{Gross Yield} = \\frac{\\text{Annual Rent}}{\\text{Purchase Price}} \\times 100$$

**Example — Your Autumn 2 unit:**
- Annual rent: AED 64,800 (AED 5,400/mo)
- Purchase price: AED 650,000
- **Gross yield: 9.97%** *(above zone avg of 7.9%)*

Use our [Foresight tool](/dashboard/foresight) for zone-adjusted projections including the net yield after service charges, vacancy allowance, and management fees.`,
};

function getAIResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("long-term") || q.includes("good investment")) return SEED_RESPONSES["long-term investment"];
  if (q.includes("short-term") || q.includes("roi") || q.includes("rental apartment")) return SEED_RESPONSES["short-term rental"];
  if (["dlf", "4%", "buying cost", "dld fee"].some((kw) => q.includes(kw))) return SEED_RESPONSES["DLD fee"];
  if (q.includes("yield") || q.includes("rental yield") || q.includes("estimate")) return SEED_RESPONSES["rental yield"];
  return `I found relevant insights for your question about **"${escapeHtml(query)}"**.

Based on your portfolio (2 properties, AED 2.69M total value), here's what matters:

- **Autumn 2 (JVC):** Currently yielding 7.9% — above the 6.5% zone benchmark ✅
- **Taormina Village:** Off-plan Q4 2027 delivery — monitor DLD escrow milestones

For AI-powered portfolio recommendations, try the **Foresight** tool or check your **Portfolio Intelligence Hub**.

[Open Portfolio →](/dashboard/portfolio) · [Foresight →](/dashboard/foresight)`;
}

const PROMPTS_BY_TYPE: Record<string, { label: string; prompts: string[] }> = {
  general: {
    label: "General investment questions about UAE property",
    prompts: [
      "How do I evaluate if a property is a good long-term investment?",
      "Estimate my ROI for a short-term rental apartment in Dubai",
      "How much is the 4% DLD fee and other buying costs?",
      "How do I estimate the rental yield for a property?",
    ],
  },
  new: {
    label: "Guidance on finding and buying a new property",
    prompts: [
      "Which Dubai zone offers the best off-plan ROI in 2026?",
      "What is the minimum investment for a Golden Visa eligible property?",
      "How does the RERA escrow system protect off-plan buyers?",
      "What are the best 1BR investment communities in JVC right now?",
    ],
  },
  existing: {
    label: "Optimise performance of your current portfolio",
    prompts: [
      "Should I switch Autumn 2 (JVC) to short-term rental this year?",
      "How close am I to Golden Visa eligibility with my current portfolio?",
      "What is the optimal exit window for my JVC property?",
      "How do I refinance in the UAE to release equity from Autumn 2?",
    ],
  },
};

export default function AdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatType, setChatType] = useState<"general" | "new" | "existing">("general");
  const bottomRef = useRef<HTMLDivElement>(null);
  const { tier, account } = useDemoAccount();

  // Free tier: 3 queries/month limit
  const FREE_LIMIT = 3;
  const isFree = tier === "free";
  const QUERY_KEY = `sb_advisor_queries_${account.id}`;
  const [persistedCount, setPersistedCount] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    return parseInt(localStorage.getItem(QUERY_KEY) ?? "0", 10);
  });
  const queryCount = persistedCount;
  const limitReached = isFree && queryCount >= FREE_LIMIT;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim() || limitReached) return;
    const userMsg: Message = { role: "user", content: text, ts: new Date().toLocaleTimeString() };
    setMessages((m) => [...m, userMsg]);
    if (isFree) {
      const next = persistedCount + 1;
      setPersistedCount(next);
      localStorage.setItem(QUERY_KEY, String(next));
    }
    setInput("");
    setLoading(true);
    setTimeout(() => {
      const aiMsg: Message = {
        role: "ai",
        content: getAIResponse(text),
        ts: new Date().toLocaleTimeString(),
      };
      setMessages((m) => [...m, aiMsg]);
      setLoading(false);
    }, 900);
  };

  return (
    <div className="foresight-bg min-h-screen flex flex-col">
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col flex-1">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              SmartBricks Advisor
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-sm text-slate-400">AI-powered investment intelligence · UAE market</p>
              <FeatureBadge variant="ai" />
            </div>
          </div>
          <Link
            href="https://calendly.com/d/csz4-4hq-m39/smart-bricks-investment-consultation"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-300 hover:bg-white/10 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-green-400" />
            Talk to SmartBricks
          </Link>
        </div>

        {/* Chat type selector */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {(Object.entries(PROMPTS_BY_TYPE) as [string, { label: string; prompts: string[] }][]).map(([id, { label }]) => (
            <button
              key={id}
              onClick={() => setChatType(id as typeof chatType)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-medium border transition-all",
                chatType === id
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white/5 text-slate-400 border-white/10 hover:border-white/20"
              )}
              title={label}
            >
              {id === "general" ? "General" : id === "new" ? "New Property" : "Existing Property"}
            </button>
          ))}
        </div>

        {/* Chat area */}
        <div className="flex-1 rounded-2xl border border-white/10 bg-white/2 flex flex-col min-h-120">

          {/* Messages or empty state */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-6 py-8">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-7 h-7 text-blue-400" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Hi, how can I help?</h2>
                  <p className="text-sm text-slate-400 mt-1">
                    {PROMPTS_BY_TYPE[chatType].label}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                  {PROMPTS_BY_TYPE[chatType].prompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      className="text-left p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-white/8 hover:border-white/20 transition-all leading-relaxed"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
                <Link
                  href="https://calendly.com/d/csz4-4hq-m39/smart-bricks-investment-consultation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sm:hidden flex items-center gap-2 px-4 py-2 bg-green-600/20 border border-green-500/30 rounded-xl text-sm text-green-300 font-medium"
                >
                  <Phone className="w-4 h-4" />
                  Talk to SmartBricks Team
                </Link>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "")}
                  >
                    <div
                      className={cn(
                        "w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold",
                        msg.role === "ai"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-600 text-white"
                      )}
                    >
                      {msg.role === "ai" ? "SB" : "U"}
                    </div>
                    <div className={cn("max-w-[80%] space-y-1", msg.role === "user" ? "items-end" : "")}>
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                          msg.role === "ai"
                            ? "bg-white/6 border border-white/10 text-slate-200"
                            : "bg-blue-600 text-white"
                        )}
                        dangerouslySetInnerHTML={
                          msg.role === "ai"
                            ? { __html: renderAIMarkdown(msg.content) }
                            : undefined
                        }
                      >
                        {msg.role === "user" ? msg.content : undefined}
                      </div>
                      <p className="text-[10px] text-slate-600 px-1">{msg.ts}</p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 text-xs font-bold text-white">
                      SB
                    </div>
                    <div className="bg-white/6 border border-white/10 rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((d) => (
                          <div
                            key={d}
                            className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
                            style={{ animationDelay: `${d * 150}ms` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </>
            )}
          </div>

          {/* Input bar */}
          <div className="p-4 border-t border-white/10 space-y-2">
            {/* Free tier limit banner */}
            {isFree && (
              <div className={cn(
                "flex items-center justify-between rounded-xl px-3 py-2 text-xs border",
                limitReached
                  ? "bg-red-500/10 border-red-500/30 text-red-300"
                  : "bg-white/4 border-white/10 text-slate-400"
              )}>
                <div className="flex items-center gap-1.5">
                  {limitReached
                    ? <Lock className="w-3 h-3" />
                    : <Sparkles className="w-3 h-3 text-blue-400" />}
                  {limitReached
                    ? <span>Free limit reached ({FREE_LIMIT}/{FREE_LIMIT} queries used) · Upgrade to Pro for unlimited access</span>
                    : <span>{account.name} · Free tier · {FREE_LIMIT - queryCount} of {FREE_LIMIT} queries remaining this month</span>
                  }
                </div>
                {limitReached && (
                  <Link
                    href="/dashboard/foresight/report"
                    className="text-[10px] font-bold text-amber-400 hover:text-amber-300 shrink-0 ml-2"
                  >
                    Upgrade →
                  </Link>
                )}
              </div>
            )}

            {/* Pro/Transaction tier label */}
            {!isFree && (
              <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                <Sparkles className="w-3 h-3 text-blue-500" />
                {account.name} · {tier === "transaction" ? "Transaction" : "Pro"} — unlimited queries
              </div>
            )}

            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={limitReached}
                placeholder={
                  limitReached
                    ? "Upgrade to Pro to continue the conversation..."
                    : "Ask about your portfolio, yields, visas, or any UAE market question..."
                }
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading || limitReached}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
