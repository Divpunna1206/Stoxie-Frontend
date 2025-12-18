// src/components/Dashboard.tsx
import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Search, Star, User, ChevronDown } from "lucide-react";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import FuturisticBackground from "./FuturisticBackground";
import { fetchDashboardStocks, StockQuote } from "../api/stocks";

interface StockData {
  id: string;
  rank: number;
  name: string;
  ticker: string;
  price: number;
  change: number;
  sector: string;
  news: string;
  newsTime: string;
  sentiment: "positive" | "negative" | "neutral";
  sentimentScore: number;
  trending: "up" | "down";
  isFavorite: boolean;
  volume: number;
  chartData: number[];
  isNew?: boolean;
}

const FAVORITES_KEY = "stoxie:favorites";

function readFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    const arr = raw ? (JSON.parse(raw) as string[]) : [];
    return new Set(arr.map((s) => (s || "").toUpperCase()));
  } catch {
    return new Set();
  }
}

function writeFavorites(set: Set<string>) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(set)));
  window.dispatchEvent(new Event("stoxie:favorites-updated"));
}

// ✅ Your full 20-sector list from companies.json (do NOT show "Unknown" in dropdown)
const SECTORS: string[] = [
  "All Sectors",
  "Automobile and Auto Components",
  "Capital Goods",
  "Chemicals",
  "Construction",
  "Construction Materials",
  "Consumer Durables",
  "Consumer Services",
  "Diversified",
  "Fast Moving Consumer Goods",
  "Financial Services",
  "Healthcare",
  "Information Technology",
  "Metals & Mining",
  "Oil Gas & Consumable Fuels",
  "Power",
  "Realty",
  "Services",
  "Telecommunication",
  "Textiles",
];

const norm = (v?: string) => (v ?? "").trim().toLowerCase();

const isUnknownSector = (v?: string) => {
  const s = norm(v);
  return (
    !s ||
    s === "unknown" ||
    s === "n/a" ||
    s === "na" ||
    s === "none" ||
    s === "null" ||
    s === "undefined"
  );
};

const sectorLabel = (v?: string) => {
  if (isUnknownSector(v)) return "Unknown";
  return (v ?? "").trim();
};

// ✅ RULE: Unknown appears ONLY when "All Sectors" is selected
const sectorMatches = (stockSector: string, selectedSector: string) => {
  if (selectedSector === "All Sectors") return true;
  if (isUnknownSector(stockSector)) return false;
  return norm(stockSector) === norm(selectedSector);
};

const generateChartData = (trending: "up" | "down") => {
  const data: number[] = [];
  let value = 50;
  for (let i = 0; i < 20; i++) {
    const change = trending === "up" ? Math.random() * 8 - 2 : Math.random() * 8 - 6;
    value = Math.max(10, Math.min(100, value + change));
    data.push(value);
  }
  return data;
};

const mapQuoteToStockData = (quote: StockQuote, index: number, favorites: Set<string>): StockData => {
  const trending: "up" | "down" = (quote.change ?? 0) >= 0 ? "up" : "down";

  const baseScore =
    typeof quote.sentiment_score === "number" ? quote.sentiment_score : 5 + (quote.change ?? 0);

  const sentimentScore = Math.max(1, Math.min(10, baseScore));

  let sentiment: "positive" | "negative" | "neutral";
  if (sentimentScore >= 6.5) sentiment = "positive";
  else if (sentimentScore <= 4) sentiment = "negative";
  else sentiment = "neutral";

  const news = quote.last_news_headline || "No recent news available";
  const newsTime = quote.last_updated ? new Date(quote.last_updated).toLocaleTimeString() : "Just now";

  const symbolUpper = (quote.symbol || "").toUpperCase();

  return {
    id: quote.symbol,
    rank: index + 1,
    name: quote.name,
    ticker: quote.symbol,
    price: Number(quote.price ?? 0),
    change: Number(quote.change ?? 0),
    sector: sectorLabel(quote.sector),
    news,
    newsTime,
    sentiment,
    sentimentScore,
    trending,
    isFavorite: favorites.has(symbolUpper),
    volume: Number(quote.volume ?? 0),
    chartData: generateChartData(trending),
    isNew: false,
  };
};

export default function Dashboard() {
  const [activeFilter, setActiveFilter] = useState<"All" | "Favorites">("All");
  const [selectedSector, setSelectedSector] = useState("All Sectors");
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [showSectorDropdown, setShowSectorDropdown] = useState(false);

  const favorites = useMemo(() => readFavorites(), []);
  const [favoriteSymbols, setFavoriteSymbols] = useState<Set<string>>(favorites);

  // ✅ Sorted sectors for nicer UI (All Sectors stays at top)
  const SECTORS_SORTED = useMemo(() => {
    const rest = SECTORS.slice(1).sort((a, b) => a.localeCompare(b));
    return ["All Sectors", ...rest];
  }, []);

  // ✅ refs for outside click close
  const sectorBtnRef = useRef<HTMLButtonElement | null>(null);
  const sectorDropRef = useRef<HTMLDivElement | null>(null);

  const loadStocks = async () => {
    try {
      const apiStocks = await fetchDashboardStocks();
      const fav = readFavorites();
      setFavoriteSymbols(fav);
      const mapped = apiStocks.map((q, i) => mapQuoteToStockData(q, i, fav));
      setStocks(mapped);
    } catch (err: any) {
      console.error("Failed to load dashboard stocks", err);
      setStocks([]);
    }
  };

  useEffect(() => {
    loadStocks();

    const onWatchlistUpdated = () => loadStocks();
    const onFavoritesUpdated = () => {
      const fav = readFavorites();
      setFavoriteSymbols(fav);
      setStocks((prev) =>
        prev.map((s) => ({
          ...s,
          isFavorite: fav.has((s.ticker || "").toUpperCase()),
        }))
      );
    };

    window.addEventListener("stoxie:watchlist-updated", onWatchlistUpdated as any);
    window.addEventListener("stoxie:favorites-updated", onFavoritesUpdated as any);

    return () => {
      window.removeEventListener("stoxie:watchlist-updated", onWatchlistUpdated as any);
      window.removeEventListener("stoxie:favorites-updated", onFavoritesUpdated as any);
    };
  }, []);

  // ✅ close dropdown on outside click + ESC
  useEffect(() => {
    if (!showSectorDropdown) return;

    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      const btn = sectorBtnRef.current;
      const drop = sectorDropRef.current;

      if (btn?.contains(t)) return;
      if (drop?.contains(t)) return;

      setShowSectorDropdown(false);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowSectorDropdown(false);
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [showSectorDropdown]);

  const filteredStocks = useMemo(() => {
    return stocks.filter((stock) => {
      if (activeFilter === "Favorites" && !stock.isFavorite) return false;
      if (!sectorMatches(stock.sector, selectedSector)) return false;
      return true;
    });
  }, [stocks, activeFilter, selectedSector]);

  const unreadFavoritesCount = stocks.filter((stock) => stock.isFavorite && stock.isNew).length;

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "#00FF88";
      case "negative":
        return "#FF4D4D";
      default:
        return "#FFD700";
    }
  };

  const toggleFavorite = (ticker: string) => {
    const sym = (ticker || "").toUpperCase();
    const next = new Set(readFavorites());

    if (next.has(sym)) next.delete(sym);
    else next.add(sym);

    writeFavorites(next);
    setFavoriteSymbols(next);

    setStocks((prev) =>
      prev.map((stock) =>
        stock.ticker.toUpperCase() === sym ? { ...stock, isFavorite: !stock.isFavorite } : stock
      )
    );
  };

  const formatVolume = (volume: number) => {
    if (volume >= 10000000) return `${(volume / 10000000).toFixed(2)}Cr`;
    if (volume >= 100000) return `${(volume / 100000).toFixed(2)}L`;
    return volume.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <FuturisticBackground />

      <nav className="fixed top-0 w-full z-50 bg-[#0D1424]/80 backdrop-blur-xl border-b border-white/10">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3">
              <div className="size-10 flex items-center justify-center">
                <img src="/stoxie-logo.png" alt="Stoxie Logo" className="size-8" />
              </div>
              <span className="text-xl tracking-tight font-bold">Stoxie</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm text-white/60 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/dashboard" className="text-sm text-white">
                Dashboard
              </Link>
              <Link to="/news" className="text-sm text-white/60 hover:text-white transition-colors">
                Market News
              </Link>
              <Link to="/watchlist" className="text-sm text-white/60 hover:text-white transition-colors">
                Watchlist
              </Link>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#B3B3B3]" />
              <Input
                placeholder="Search stocks..."
                className="pl-11 bg-[#1A1A1A] border-white/5 rounded-2xl h-10 focus:border-[#00FFFF]/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/profile">
              <Avatar className="size-9 cursor-pointer hover:ring-2 hover:ring-[#00FFFF]/50 transition-all">
                <AvatarFallback className="bg-gradient-to-br from-[#00FFFF] to-[#FF00FF] text-xs text-black">
                  <User className="size-5" />
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 pt-20">
        <main className="p-8">
          <div className="mb-6">
            <h1 className="text-2xl">Dashboard</h1>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveFilter("All")}
                className={`px-6 py-2.5 rounded-2xl text-sm transition-all cursor-pointer ${
                  activeFilter === "All"
                    ? "bg-gradient-to-r from-[#1E3A5F] to-[#2A4A6F] text-white border border-[#00FFFF]/30"
                    : "bg-[#1A1A1A] text-[#B3B3B3] hover:bg-[#222222]"
                }`}
              >
                All Stocks
              </button>

              <button
                onClick={() => setActiveFilter("Favorites")}
                className={`px-6 py-2.5 rounded-2xl text-sm transition-all flex items-center gap-2 cursor-pointer relative ${
                  activeFilter === "Favorites"
                    ? "bg-gradient-to-r from-[#1E3A5F] to-[#2A4A6F] text-white border border-[#00FFFF]/30"
                    : "bg-[#1A1A1A] text-[#B3B3B3] hover:bg-[#222222]"
                }`}
              >
                <Star className={`size-4 ${activeFilter === "Favorites" ? "fill-[#FFD700] text-[#FFD700]" : ""}`} />
                Favorites
                {unreadFavoritesCount > 0 && (
                  <span className="ml-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#00FFFF] to-[#00D4FF] text-black text-xs">
                    {unreadFavoritesCount}
                  </span>
                )}
              </button>

              <div className="relative">
                <button
                  ref={sectorBtnRef}
                  onClick={() => setShowSectorDropdown((v) => !v)}
                  className="px-6 py-2.5 rounded-2xl text-sm transition-all bg-[#1A1A1A] text-[#B3B3B3] hover:bg-[#222222] flex items-center gap-2 cursor-pointer"
                >
                  {selectedSector}
                  <ChevronDown className="size-4" />
                </button>

                {/* {showSectorDropdown && (
                 <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="
                  sector-scroll
                  absolute top-full mt-2 left-0
                  w-[380px]
                  bg-[#0F0F0F]/95 backdrop-blur-xl
                  border border-white/10
                  rounded-2xl shadow-2xl
                  z-50
                  max-h-[50px] overflow-y-auto
                  overscroll-contain
                  py-1
                "
              >
                    {SECTORS_SORTED.map((sector) => (
                      <button
                        key={sector}
                        onClick={() => {
                          setSelectedSector(sector);
                          setShowSectorDropdown(false);
                        }}
                        className={`w-full px-4 py-2.5 text-sm text-left hover:bg-white/5 transition-colors cursor-pointer ${
                          selectedSector === sector ? "text-[#00FFFF] bg-white/5" : "text-[#B3B3B3]"
                        }`}
                      >
                        {sector}
                      </button>
                    ))}
                  </motion.div>
                )} */}
                {showSectorDropdown && (
  <motion.div
    ref={sectorDropRef}
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="
      absolute top-full mt-2 left-0 z-50
      w-[320px] sm:w-[380px]
    "
  >
    {/* Outer shell (rounded + blur) */}
    <div
      className="
        bg-[#0F0F0F]/95 backdrop-blur-xl
        border border-white/10
        rounded-2xl shadow-2xl
        overflow-hidden
      "
    >
      {/* Inner scroll area (THIS is what scrolls) */}
      <div
        className="
         sector-scroll
    !max-h-[240px]
    !overflow-y-scroll
    overflow-x-hidden
    overscroll-contain
    py-1
  "
  style={{
    maxHeight: "240px",
    overflowY: "scroll",
  }}
      >
        {SECTORS_SORTED.map((sector) => (
          <button
            key={sector}
            onClick={() => {
              setSelectedSector(sector);
              setShowSectorDropdown(false);
            }}
            className={`
              w-full px-4 py-2.5 text-sm text-left
              hover:bg-white/5 transition-colors cursor-pointer
              whitespace-nowrap truncate
              ${selectedSector === sector ? "text-[#00FFFF] bg-white/5" : "text-[#B3B3B3]"}
            `}
            title={sector}
          >
            {sector}
          </button>
        ))}
      </div>
    </div>
  </motion.div>
)}

              </div>
            </div>

            <div className="text-sm text-[#B3B3B3]">Showing {filteredStocks.length} stocks</div>
          </div>

          <div className="bg-gradient-to-br from-[#111111] to-[#0D0D0D] rounded-3xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5 bg-[#0D0D0D]">
                    <th className="px-6 py-4 text-left text-xs text-[#B3B3B3]">Company</th>
                    <th className="px-6 py-4 text-left text-xs text-[#B3B3B3]">Sector</th>
                    <th className="px-6 py-4 text-right text-xs text-[#B3B3B3]">Price</th>
                    <th className="px-6 py-4 text-center text-xs text-[#B3B3B3]">Change</th>
                    <th className="px-6 py-4 text-right text-xs text-[#B3B3B3]">Volume</th>
                    <th className="px-6 py-4 text-left text-xs text-[#B3B3B3]">Latest News</th>
                    <th className="px-6 py-4 text-center text-xs text-[#B3B3B3]">Sentiment Score</th>
                  </tr>
                </thead>

                <tbody>
                  <AnimatePresence mode="popLayout">
                    {filteredStocks.map((stock) => {
                      const sentimentColor = getSentimentColor(stock.sentiment);

                      return (
                        <motion.tr
                          key={stock.id}
                          layout
                          initial={stock.isNew ? { opacity: 0, y: -20, scale: 0.95 } : false}
                          animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            backgroundColor: stock.isNew ? "rgba(0, 255, 255, 0.1)" : "transparent",
                          }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ duration: 0.5 }}
                          className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <button onClick={() => toggleFavorite(stock.ticker)} className="hover:scale-110 transition-transform">
                                <Star
                                  className={`size-4 ${
                                    stock.isFavorite ? "text-[#FFD700] fill-[#FFD700]" : "text-[#4A4A4A]"
                                  }`}
                                />
                              </button>
                              <Avatar className="size-10">
                                <AvatarFallback className="bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] text-xs">
                                  {stock.ticker.substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-sm">{stock.name}</div>
                                <div className="text-xs text-[#B3B3B3]">{stock.ticker}</div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <span className="inline-block px-3 py-1 rounded-full bg-[#1A1A1A] text-xs text-[#B3B3B3] border border-white/5">
                              {stock.sector}
                            </span>
                          </td>

                          <td className="px-6 py-5 text-right">
                            <span className="text-sm">₹{stock.price.toFixed(2)}</span>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex justify-center">
                              <div
                                className={`px-4 py-2 rounded-full ${
                                  stock.change >= 0 ? "bg-[#00FF88]/20 text-[#00FF88]" : "bg-red-400/20 text-red-400"
                                }`}
                              >
                                <span className="text-sm">
                                  {stock.change >= 0 ? "+" : ""}
                                  {stock.change.toFixed(2)}%
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5 text-right">
                            <span className="text-xs text-[#B3B3B3]">{formatVolume(stock.volume)}</span>
                          </td>

                          <td className="px-6 py-5">
                            <div className="max-w-md">
                              <p className="text-xs text-[#B3B3B3] line-clamp-2 mb-3">{stock.news}</p>
                              <div className="flex items-center justify-between">
                                <Link
                                  to={`/summary/${stock.rank}`}
                                  state={{
                                    newsTitle: stock.news,
                                    newsTime: stock.newsTime,
                                    company: stock.name,
                                    ticker: stock.ticker,
                                    sentiment: stock.sentiment,
                                    sentimentScore: stock.sentimentScore,
                                  }}
                                  className="text-xs text-[#00FFFF] hover:text-[#00D4FF] transition-colors"
                                >
                                  Read more →
                                </Link>
                                <span className="text-xs text-[#B3B3B3]">{stock.newsTime}</span>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex flex-col items-center group">
                              <div className="relative size-16 mb-2">
                                <svg className="size-full -rotate-90">
                                  <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
                                  <motion.circle
                                    cx="32"
                                    cy="32"
                                    r="28"
                                    stroke={sentimentColor}
                                    strokeWidth="4"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeDasharray={`${2 * Math.PI * 28}`}
                                    initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                                    animate={{
                                      strokeDashoffset: 2 * Math.PI * 28 * (1 - stock.sentimentScore / 10),
                                    }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    style={{ filter: `drop-shadow(0 0 4px ${sentimentColor})` } as any}
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-xs" style={{ color: sentimentColor }}>
                                    {stock.sentimentScore.toFixed(1)}
                                  </span>
                                </div>
                              </div>

                              <span
                                className="text-xs capitalize px-2 py-0.5 rounded-full"
                                style={{ color: sentimentColor, backgroundColor: `${sentimentColor}20` }}
                              >
                                {stock.sentiment}
                              </span>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
