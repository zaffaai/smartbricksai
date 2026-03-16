"use client";
import { Search, SlidersHorizontal, MapPin, TrendingUp, Star, Heart, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/components/shared/Toast";
import FeatureBadge from "@/components/shared/FeatureBadge";
import InfoTooltip from "@/components/shared/InfoTooltip";

// Sample listings derived from live site data
const LISTINGS = [
  {
    id: "autumn-2-jvc",
    name: "Autumn 2",
    community: "Seasons Community, JVC",
    zone: "Jumeirah Village Circle",
    type: "Apartment",
    status: "Ready",
    beds: 1,
    sqft: 664,
    price: 650000,
    pricePsf: 1227,
    belowMarket: 25.3,
    score: 95,
    roi: 26,
    yield: 7.9,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
    goldenVisa: false,
    portfolioId: "autumn-jvc",
  },
  {
    id: "taormina-majan",
    name: "Taormina Village",
    community: "Majan, Dubai Land",
    zone: "Dubai Land",
    type: "Townhouse",
    status: "Off-Plan",
    beds: 4,
    sqft: 1993,
    price: 1992368,
    pricePsf: 999,
    belowMarket: 25.2,
    score: 93,
    roi: 22.3,
    yield: 0,
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80",
    goldenVisa: true,
    delivery: "Q4 2027",
    portfolioId: "taormina-majan",
  },
  {
    id: "reportage-hills",
    name: "Reportage Hills",
    community: "Dubai Land",
    zone: "Dubai Land",
    type: "Villa",
    status: "Off-Plan",
    beds: 5,
    sqft: 2403,
    price: 2375100,
    pricePsf: 988,
    belowMarket: 31.5,
    score: 94,
    roi: 18.5,
    yield: 0,
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80",
    goldenVisa: true,
    delivery: "Q4 2028",
    aiRecommended: true,
  },
  {
    id: "verdana-2",
    name: "Verdana 2",
    community: "Verdana, Dubai Investment Park",
    zone: "Dubai Investment Park",
    type: "Apartment",
    status: "Off-Plan",
    beds: 1,
    sqft: 610,
    price: 498000,
    pricePsf: 816,
    belowMarket: 28.7,
    score: 92,
    roi: 15.3,
    yield: 0,
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80",
    goldenVisa: false,
    delivery: "Q4 2026",
    aiRecommended: true,
  },
  {
    id: "binghatti-apex",
    name: "Binghatti Apex",
    community: "District 10, JVC",
    zone: "Jumeirah Village Circle",
    type: "Apartment",
    status: "Off-Plan",
    beds: 1,
    sqft: 832,
    price: 959995,
    pricePsf: 1154,
    belowMarket: 31.8,
    score: 90,
    roi: 23.6,
    yield: 0,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
    goldenVisa: false,
    delivery: "Q2 2026",
  },
  {
    id: "pulse-smart",
    name: "Pulse Smart Residence",
    community: "District 11, JVC",
    zone: "Jumeirah Village Circle",
    type: "Apartment",
    status: "Ready",
    beds: 1,
    sqft: 861,
    price: 900000,
    pricePsf: 1045,
    belowMarket: 25.5,
    score: 91,
    roi: 23.8,
    yield: 6.8,
    image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&q=80",
    goldenVisa: false,
  },
];

const SORT_OPTIONS = ["Recommended", "Price: Low–High", "Price: High–Low", "Highest ROI", "Best Yield"];

export default function ExplorePage() {
  const { toast } = useToast();
  const [sortBy, setSortBy] = useState("Recommended");
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterBeds, setFilterBeds] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterGV, setFilterGV] = useState(false);
  const [filterZone, setFilterZone] = useState("");

  const activeFilters =
    (filterBeds !== null ? 1 : 0) +
    (filterStatus !== null ? 1 : 0) +
    (filterGV ? 1 : 0) +
    (filterZone ? 1 : 0);

  const toggleSave = (id: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = [...LISTINGS]
    .filter((l) => {
      if (
        searchQuery &&
        !l.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !l.community.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !l.zone.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      if (filterBeds !== null && l.beds !== filterBeds) return false;
      if (filterStatus !== null && l.status !== filterStatus) return false;
      if (filterGV && !l.goldenVisa) return false;
      if (filterZone && l.zone !== filterZone) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "Price: Low–High") return a.price - b.price;
      if (sortBy === "Price: High–Low") return b.price - a.price;
      if (sortBy === "Highest ROI") return b.roi - a.roi;
      if (sortBy === "Best Yield") return b.yield - a.yield;
      return 0; // Recommended: keep original order
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* Market status banner */}
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-white border border-gray-200 rounded-xl px-4 py-2.5">
          <span className="flex items-center gap-1">
            <Image src="https://app.smart-bricks.com/assets/AE.png" alt="UAE" width={16} height={12} className="rounded-sm" unoptimized />
            UAE Live
          </span>
          <span className="text-gray-300">·</span>
          <span className="text-gray-400">UK & US launching soon</span>
          <Link
            href="/dashboard/portfolio"
            className="ml-auto text-blue-600 font-medium flex items-center gap-1 hover:text-blue-800"
          >
            Finalize onboarding → personalized listings
          </Link>
        </div>

        {/* Search + Filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-60 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by project, area, or zone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-gray-300 transition-colors">
            <MapPin className="w-4 h-4 text-gray-400" />
            <select
              value={filterZone}
              onChange={(e) => setFilterZone(e.target.value)}
              className="bg-transparent text-sm text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="">Area: All</option>
              <option value="Jumeirah Village Circle">JVC</option>
              <option value="Dubai Land">Dubai Land</option>
              <option value="Dubai Investment Park">Dubai Inv. Park</option>
              <option value="Downtown Dubai">Downtown Dubai</option>
              <option value="Palm Jumeirah">Palm Jumeirah</option>
              <option value="Business Bay">Business Bay</option>
            </select>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm transition-colors",
              showFilters || activeFilters > 0
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilters > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-blue-600 text-[10px] font-bold flex items-center justify-center">
                {activeFilters}
              </span>
            )}
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-wrap gap-5 items-start">
            {/* Bedrooms */}
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wider">Bedrooms</p>
              <div className="flex gap-1.5 flex-wrap">
                {[1, 2, 3, 4, 5].map((b) => (
                  <button
                    key={b}
                    onClick={() => setFilterBeds(filterBeds === b ? null : b)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                      filterBeds === b
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                    )}
                  >
                    {b} BR
                  </button>
                ))}
              </div>
            </div>
            {/* Status */}
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wider">Status</p>
              <div className="flex gap-1.5">
                {["Ready", "Off-Plan"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(filterStatus === s ? null : s)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                      filterStatus === s
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            {/* Golden Visa */}
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wider">Golden Visa</p>
              <button
                onClick={() => setFilterGV(!filterGV)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5",
                  filterGV
                    ? "bg-amber-500 text-black border-amber-500"
                    : "bg-white text-gray-600 border-gray-200 hover:border-amber-300"
                )}
              >
                🇦🇪 Eligible only
              </button>
            </div>
            {/* Clear */}
            {activeFilters > 0 && (
              <button
                onClick={() => {
                  setFilterBeds(null);
                  setFilterStatus(null);
                  setFilterGV(false);
                  setFilterZone("");
                }}
                className="ml-auto flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">
            All properties
            <span className="ml-2 text-sm font-normal text-gray-400">
              56,923 properties in Dubai
            </span>
          </h1>
        </div>

        {/* Listing grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((listing) => (
            <div
              key={listing.id}
              className={cn(
                "bg-white border rounded-2xl overflow-hidden hover:shadow-md transition-all group",
                listing.portfolioId
                  ? "border-blue-200 hover:border-blue-400"
                  : listing.aiRecommended
                  ? "border-emerald-200 hover:border-emerald-400"
                  : "border-gray-200 hover:border-blue-300"
              )}
            >
              {/* Image */}
              <div className="relative h-48">
                <Image
                  src={listing.image}
                  alt={listing.name}
                  fill
                  className="object-cover"
                />
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                  {listing.portfolioId ? (
                    <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">
                      In Portfolio
                    </span>
                  ) : listing.aiRecommended ? (
                    <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> AI Match
                    </span>
                  ) : (
                    <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                      Undervalued
                    </span>
                  )}
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold",
                    listing.status === "Ready"
                      ? "bg-blue-600 text-white"
                      : "bg-amber-500 text-black"
                  )}>
                    {listing.status === "Off-Plan" && listing.delivery
                      ? `Off-plan · ${listing.delivery}`
                      : listing.status}
                  </span>
                </div>
                {/* Save button */}
                <button
                  onClick={() => {
                    const wasAlreadySaved = saved.has(listing.id);
                    toggleSave(listing.id);
                    toast(
                      wasAlreadySaved ? "Removed from watchlist" : `${listing.name} saved!`,
                      { description: wasAlreadySaved ? "Property removed from your saved list." : "Find your saved properties in Portfolio → Watchlist.", type: wasAlreadySaved ? "info" : "success" }
                    );
                  }}
                  className="absolute top-3 right-3 p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors"
                >
                  <Heart
                    className={cn("w-4 h-4", saved.has(listing.id) ? "text-red-500 fill-red-500" : "text-gray-400")}
                  />
                </button>
                {/* ROI badge */}
                {listing.roi > 0 && (
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/70 text-white text-[10px] px-2 py-1 rounded-lg">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    {listing.roi}% Annual ROI
                    <InfoTooltip
                      content="Projected annual return on investment vs. purchase price. Includes capital appreciation (Foresight model) + gross rental yield. Does not deduct DLD fees or service charges."
                      side="right"
                      width="w-60"
                    />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    {listing.portfolioId ? (
                      <Link
                        href={`/dashboard/portfolio/${listing.portfolioId}`}
                        className="text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {listing.name}
                      </Link>
                    ) : (
                      <button
                        onClick={() =>
                          toast(`Add ${listing.name} to your portfolio`, {
                            description:
                              "Save this property to unlock AI analytics, Foresight projections, and DLD comparables.",
                            type: "ai",
                          })
                        }
                        className="text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors text-left"
                      >
                        {listing.name}
                      </button>
                    )}
                    <div className="flex items-center gap-1 shrink-0">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-bold text-gray-700">{listing.score}%</span>
                      <InfoTooltip
                        content="SmartBricks Investment Score: AI composite of 600+ data points including zone trajectory, yield efficiency, developer track record, and liquidity ratio. ≥90% = strong buy signal."
                        side="left"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{listing.community}</p>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{listing.type}</span>
                  <span>·</span>
                  <span>{listing.beds} BR</span>
                  <span>·</span>
                  <span>{listing.sqft.toLocaleString()} sqft</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-bold text-gray-900">
                      AED {listing.price.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      AED {listing.pricePsf.toLocaleString()}/sqft
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1 justify-end">
                      {listing.belowMarket}% Below SmartBricks valuation
                      <InfoTooltip
                        content="SmartBricks AVM (Automated Valuation Model) estimated this property's fair value using DLD comparable transactions and zone-level alpha. A positive gap means the listing price is below our model's estimated market value — a potential upside opportunity."
                        side="left"
                        width="w-64"
                      />
                    </p>
                    {listing.yield > 0 && (
                      <p className="text-[10px] text-gray-400">Yield: {listing.yield}%</p>
                    )}
                    {listing.goldenVisa && (
                      <p className="text-[10px] text-amber-600 font-semibold flex items-center gap-1">
                        🇦🇪 Golden Visa
                        <InfoTooltip
                          content="UAE Golden Visa eligibility requires a minimum AED 2M property investment. This property qualifies. Golden Visa grants 10-year UAE residency."
                          side="left"
                          width="w-56"
                        />
                      </p>
                    )}
                  </div>
                </div>

                {listing.portfolioId ? (
                  <Link
                    href={`/dashboard/portfolio/${listing.portfolioId}`}
                    className="block w-full text-center text-xs bg-blue-600 text-white font-semibold py-2 rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    View Intelligence Report
                  </Link>
                ) : (
                  <button
                    onClick={() =>
                      toast(`Add ${listing.name} to Portfolio`, {
                        description: listing.aiRecommended
                          ? "AI recommends this as a strong complement to your current holdings."
                          : "Save to portfolio to unlock AI analytics, DLD comparables, and Foresight.",
                        type: listing.aiRecommended ? "ai" : "info",
                      })
                    }
                    className={cn(
                      "w-full text-center text-xs font-semibold py-2 rounded-xl transition-colors",
                      listing.aiRecommended
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    {listing.aiRecommended ? "✦ Add AI-Recommended Property" : "Save to Portfolio"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-1 py-4">
          {["←", "1", "2", "3", "4", "...", "1898", "→"].map((p, i) => (
            <button
              key={i}
              className={cn(
                "w-8 h-8 rounded-lg text-sm transition-colors",
                p === "1"
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-gray-500 hover:bg-gray-100"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
