# SmartBricks — AI-First OS for Wealth

> The AI-powered property investment platform for the UAE market.  
> Predict. Optimise. Grow. — powered by DLD data and proprietary Foresight AI.

---

## Product Overview

SmartBricks is a wealth intelligence platform built for UAE property investors. It surfaces AI-driven insights on portfolio performance, 5-year property value forecasts, yield optimisation, and Golden Visa tracking — all from a single dashboard.

**Current market:** UAE (Dubai). **Coming soon:** UK, US.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, React 19) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 (`@tailwindcss/postcss`) |
| Charts | Recharts 3 |
| Math rendering | KaTeX + react-katex |
| Icons | Lucide React |
| Animations | Framer Motion (installed, available for future use) |
| Utility | `clsx` + `tailwind-merge` via `cn()` helper |

---

## Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# → http://localhost:3000

# Build for production
npm run build

# Lint
npm run lint
```

The app auto-redirects `/` → `/dashboard/portfolio`.

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                      # Root layout with Navbar
│   ├── page.tsx                        # Redirects → /dashboard/portfolio
│   ├── not-found.tsx                   # Custom 404 page
│   └── dashboard/
│       ├── loading.tsx                 # Route transition loader
│       ├── page.tsx                    # Redirects → /dashboard/property
│       ├── portfolio/
│       │   ├── page.tsx                # Portfolio Intelligence Hub
│       │   └── [id]/page.tsx           # Individual property asset page
│       ├── property/page.tsx           # Property explore / marketplace
│       ├── foresight/
│       │   ├── page.tsx                # Foresight 5-year prediction engine
│       │   └── report/page.tsx         # Premium Foresight Intelligence Report
│       └── advisor/page.tsx            # AI Advisor chat interface
├── components/
│   ├── layout/Navbar.tsx               # Sticky top nav (mobile-responsive)
│   ├── shared/MetricTile.tsx           # Reusable KPI card
│   ├── foresight/ForesightChart.tsx    # Bear/Base/Bull area chart (Recharts)
│   └── portfolio/
│       ├── WealthScore.tsx             # SVG circular gauge (0–1000)
│       ├── AlertFeed.tsx               # Market intelligence alerts list
│       ├── GoldenVisaTracker.tsx       # AED 2M threshold progress bar
│       └── IntelligenceCards.tsx       # AI-detected insight cards
├── lib/
│   ├── cn.ts                           # clsx + tailwind-merge helper
│   └── data.ts                         # Seed data, Foresight model, constants
└── types/
    └── react-katex.d.ts                # Type declaration for react-katex
```

---

## Pages & Features

### `/dashboard/portfolio` — Portfolio Intelligence Hub
The main wealth dashboard. Displays:
- **Portfolio KPIs**: total value, average ROI, rental yield, property count
- **Property cards**: linked to individual asset pages with gain/loss display
- **Foresight preview**: 5-year outlook for the top property (Pro paywall gate)
- **Wealth Score** (0–1000): composite score across yield efficiency, capital growth, diversification, liquidity
- **Golden Visa Tracker**: progress bar toward the AED 2M DLD threshold
- **Market Intelligence Feed**: real-time alerts (opportunities, warnings, payment milestones)
- **Invisible Intelligence**: AI-detected signals (price drops, yield lag, visa eligibility)
- **Premium Report CTA**: upsell to AED 299 single report or AED 149/mo Pro

---

### `/dashboard/portfolio/[id]` — Property Asset Page
Deep-dive on a single property. Shows:
- Property header with image, status badge, Golden Visa flag, SmartBricks score
- **Metric grid**: ROI, yield, bedrooms/sqft, current AI valuation
- **5-Year Foresight Chart**: bear/base/bull scenario overlay
- **Rental Yield Optimizer** *(Ready properties)*: compares LT vs STR yield with gap analysis
- **Payment Plan Tracker** *(Off-plan)*: construction progress bar + milestone timeline
- **DLD Comparable Sales**: last-90-days transaction table
- **Document Vault**: SPA, Title Deed, NOC, DLD Receipt with pending/available status

Supported IDs: `autumn-jvc`, `taormina-majan`

---

### `/dashboard/property` — Explore / Marketplace
Property discovery page. Features:
- **Live search** filtering by project name, community, or zone
- **Sort** by Recommended / Price / ROI / Yield (all wired and functional)
- **Property cards** with undervalued badge, status, SmartBricks score, Golden Visa flag
- Listing grid of 6 seed properties (2 in portfolio, 4 new listings)
- Save / wishlist heart toggle per listing

---

### `/dashboard/foresight` — Foresight Engine *(PRO)*
5-year AI property value prediction engine:
- **Property selector** — switch between portfolio properties
- **Foresight Growth Model** formula rendered with KaTeX:
  `V_t = V_0 * (1 + r_base + alpha_zone + beta_macro - delta_risk)^t`
- Year-by-year area chart with interactive year range slider (Y1–Y5)
- **Zone Premium Map**: all Dubai zones ranked by alpha coefficient
- **Year 5 summary**: bear/base/bull values with % gain vs today
- **Premium Report upsell**: AED 299 single / AED 149/mo Pro

---

### `/dashboard/foresight/report` — Premium Intelligence Report
Full Foresight PDF report with paywall:
- **Section 1** (free): 5-year forecast + Foresight chart
- **Section 2** (free): Golden Visa eligibility summary
- **Sections 3–5** (paywalled): DLD comparable sales, yield optimisation playbook, portfolio rebalancing
- **Pricing plans table**: Single Report, Pro Investor, Transaction Fee (1.5%)
- Unlock state tracked locally via `useState`

---

### `/dashboard/advisor` — AI Advisor
Conversational AI investment advisor:
- **Chat type selector**: General / New Property / Existing Property
- **Seeded prompt chips** for first-time users
- **AI responses** rendered with markdown: bold, internal links
- **Human consultation CTA**: Calendly link to SmartBricks team
- Pre-programmed knowledge base covering: long-term investment signals, STR ROI estimates, DLD fee breakdown, rental yield calculation
- Input sanitised against XSS before response interpolation

---

## Data Model (`src/lib/data.ts`)

### Portfolio Properties
```ts
interface Property {
  id: string;
  name: string;
  community: string;
  zone: string;
  type: "Apartment" | "Townhouse" | "Villa";
  status: "Ready" | "Off-Plan";
  bedrooms: number;
  sqft: number;
  purchasePrice: number;
  currentValue: number;
  yield: number;          // annual gross yield %
  roi: number;            // unrealised capital gain %
  alphaZone: number;      // zone premium coefficient (e.g. 0.6 = 0.6% pa)
  goldenVisaEligible: boolean;
  offPlan: boolean;
  // Off-plan only:
  deliveryDate?: string;
  constructionProgress?: number;
  paymentPlan?: PaymentMilestone[];
}
```

### Foresight Model Constants
| Constant | Value | Description |
|---|---|---|
| `BASE_CAGR` | 4.8% | Dubai long-term residential CAGR |
| `BETA_MACRO` | 1.2% | UAE Vision 2031 / Expo legacy multiplier |
| `DELTA_RISK` | 0.8% | Risk discount (oversupply index) |
| Scenario σ | ±1.5% | Bull/bear adjustment on base rate |

Zone alpha premiums range from Downtown Dubai (+1.2%) to Dubai Investment Park (+0.4%).

### Seed Portfolio
| Property | Type | Purchase | Current | Yield | ROI |
|---|---|---|---|---|---|
| Autumn 2, JVC | 1BR Apt — Ready | AED 650K | AED 814K | 7.9% | 25.7% |
| Taormina Village, Dubai Land | 4BR Townhouse — Off-Plan | AED 2.04M | AED 2.04M | — | 22.3% |

---

## Monetisation Strategy

| Tier | Price | Includes |
|---|---|---|
| Free | AED 0 | Portfolio overview, property exploration, AI alerts |
| Single Report | AED 299 one-time | 1 full Foresight report (all 5 sections) |
| Pro Investor | AED 149/month | Unlimited reports, priority AI Advisor, real-time alerts |
| Transaction | 1.5% of deal | Agent-assisted acquisition, DLD registration, legal review |

---

## Design System

The app uses a dual-theme approach:
- **Dark (foresight-bg)**: dashboard, portfolio, advisor, foresight pages — deep navy `#0a0e1a` with blue/amber accents
- **Light**: property explore page — white/gray-50 with standard card surfaces

Design tokens (CSS custom properties):
```css
--sb-navy: #0a0e1a      /* primary dark background */
--sb-card: #1a2236      /* card surface */
--sb-blue: #2563eb      /* primary accent */
--sb-gold: #f59e0b      /* Pro / Golden Visa accent */
--sb-green: #10b981     /* positive / yield */
--sb-red: #ef4444       /* bear / warning */
```

---

## Known Stubs (MVP)

The following UI elements are intentionally stubbed in the current prototype:

| Element | Status |
|---|---|
| Sign In / Create Account buttons | Link to `#` — auth not yet implemented |
| "Filters" button on Explore page | UI only — filter panel not built |
| "Area: All" button on Explore page | UI only — area filter not wired |
| "View STR Optimization Plan" button | UI only — STR detail page not built |
| "Start Application" (Golden Visa) | UI only — external GDRFA flow |
| Document Vault "View" buttons | UI only — document storage not wired |
| "Download Full PDF Report" | UI only — PDF generation not yet built |
| Property listings 3–6 on Explore page | No portfolio detail pages; titles non-linked |

---

## Environment & Deployment

No environment variables are required for the prototype (all data is seeded in `src/lib/data.ts`).

For production, replace `PORTFOLIO_PROPERTIES`, `ALERT_FEED`, `DLD_RECENT_SALES`, etc. with API calls to:
- **DLD Open Data API** — real transaction data
- **Internal property DB** — user portfolio
- **AI inference endpoint** — live Foresight model

External image domains whitelisted in `next.config.ts`:
- `images.unsplash.com` — property photos
- `app.smart-bricks.com` — flag assets
- `cdn.smart-bricks.com` — CDN assets

---

## Security Notes

- AI Advisor chat: user input is HTML-escaped before being interpolated into AI response strings; responses are rendered via a trusted `renderAIMarkdown()` pipeline
- All `dangerouslySetInnerHTML` usage is gated through the `renderAIMarkdown` helper whose inputs are either hardcoded seed strings or escaped user content
- No external API calls; no auth tokens or secrets in the codebase

---

*SmartBricks — Predict. Optimise. Grow.*

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
