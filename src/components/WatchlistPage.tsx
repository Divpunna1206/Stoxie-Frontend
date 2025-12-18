
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Plus,
  Send,
  Star,
  Trash2,
  User,
  X,
  Briefcase,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import FuturisticBackground from "./FuturisticBackground";

import {
  addToWatchlist,
  fetchCompanies,
  fetchWatchlist,
  removeFromWatchlist,
  searchCompanies,
  toggleWatchlistWhatsapp,
  type CompanySearchResult,
} from "../api/watchlist";

interface Company {
  id: string; // watchlist item id as string for UI
  ticker: string; // symbol, e.g. "RIL.BSE"
  name: string;
  price: number;
  change: number;
  changePercent: number;
  whatsappEnabled: boolean;
  sector: string;
}
const FAVORITES_KEY = "stoxie:favorites";

function readFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    const arr = raw ? (JSON.parse(raw) as string[]) : [];
    return new Set(arr.map(s => (s || "").toUpperCase()));
  } catch {
    return new Set();
  }
}

function writeFavorites(set: Set<string>) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(set)));
  window.dispatchEvent(new Event("stoxie:favorites-updated"));
}

function safeNumber(v: any, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function tickerBadge(ticker: string) {
  // keep your avatar letters clean even with ".BSE"
  const cleaned = (ticker || "").replace(/[^A-Z0-9]/gi, "").toUpperCase();
  return cleaned.substring(0, 2) || "ST";
}

// small concurrency limiter for “Add Sector”
async function runWithConcurrency<T>(
  tasks: Array<() => Promise<T>>,
  concurrency = 5
): Promise<PromiseSettledResult<T>[]> {
  const results: PromiseSettledResult<T>[] = [];
  let idx = 0;

  const workers = new Array(concurrency).fill(0).map(async () => {
    while (idx < tasks.length) {
      const current = idx++;
      try {
        const value = await tasks[current]();
        results[current] = { status: "fulfilled", value } as PromiseSettledResult<T>;
      } catch (reason) {
        results[current] = { status: "rejected", reason } as PromiseSettledResult<T>;
      }
    }
  });

  await Promise.all(workers);
  return results;
}

export default function WatchlistPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingCompany, setIsAddingCompany] = useState(false);
  const [isAddingSector, setIsAddingSector] = useState(false);
  const [newTicker, setNewTicker] = useState("");

  // catalog cache (for price/sector + Add Sector modal)
  const [catalog, setCatalog] = useState<CompanySearchResult[]>([]);
  const [catalogLoaded, setCatalogLoaded] = useState(false);

  // Add Company suggestions
  const [suggestions, setSuggestions] = useState<CompanySearchResult[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<CompanySearchResult | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const catalogBySymbol = useMemo(() => {
    const map = new Map<string, CompanySearchResult>();
    for (const c of catalog) map.set(c.symbol.toUpperCase(), c);
    return map;
  }, [catalog]);

  async function ensureCatalog(limit = 500) {
    if (catalogLoaded) return;
    const list = await fetchCompanies({ limit });
    setCatalog(list);
    setCatalogLoaded(true);
  }

  async function loadWatchlist() {
    const wl = await fetchWatchlist();
    window.dispatchEvent(new Event("stoxie:watchlist-updated"));

    // catalog is optional (used only to fill price from JSON catalog if present)
    // We try to load it once, but even if it fails watchlist still works.
    try {
      await ensureCatalog(500);
    } catch {
      // ignore
    }

    const ui: Company[] = wl.map((item) => {
      const symbolUpper = item.symbol.toUpperCase();
      const cat = catalogBySymbol.get(symbolUpper);

      // price comes from your JSON catalog (/companies response has price)
      // change/volume/news/sentiment are not available yet -> keep placeholders
      const price = safeNumber(cat?.price, 0);
      const change = 0;
      const changePercent = 0;

      return {
        id: String(item.id),
        ticker: item.symbol,
        name: item.name,
        price,
        change,
        changePercent,
        whatsappEnabled: !!item.notify_whatsapp,
        sector: item.sector ?? cat?.sector ?? "Unknown",
      };
    });

    setCompanies(ui);
  }

  useEffect(() => {
    loadWatchlist().catch((e) => {
      console.error("Failed to load watchlist:", e);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // when Add Sector opens, load catalog (top 500)
  useEffect(() => {
    if (isAddingSector) {
      ensureCatalog(500).catch((e) => console.error("Catalog load failed:", e));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAddingSector]);

  // suggestions for Add Company modal
  useEffect(() => {
    if (!isAddingCompany) return;

    const q = newTicker.trim();
    setSelectedSuggestion(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (q.length < 1) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      searchCompanies({ q, limit: 20 })
        .then(setSuggestions)
        .catch((e) => {
          console.error("Company search failed:", e);
          setSuggestions([]);
        });
    }, 250);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [newTicker, isAddingCompany]);

  const toggleWhatsApp = async (id: string) => {
    const current = companies.find((c) => c.id === id);
    if (!current) return;

    // optimistic UI
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, whatsappEnabled: !c.whatsappEnabled } : c))
    );

    try {
      await toggleWatchlistWhatsapp(Number(id), !current.whatsappEnabled);
    } catch (e) {
      console.error("toggle whatsapp failed:", e);
      // revert + reload from server
      await loadWatchlist();
    }
  };

  const handleRemoveCompany = async (id: string) => {
    // optimistic remove
    const prev = companies;
    setCompanies((c) => c.filter((x) => x.id !== id));
    try {
      await removeFromWatchlist(Number(id));
    } catch (e) {
      console.error("remove failed:", e);
      setCompanies(prev);
    }
  };

  const handleAddCompany = async () => {
    const typed = newTicker.trim();
    const sym = selectedSuggestion?.symbol ?? typed.toUpperCase();
    if (!sym) return;

    try {
      await addToWatchlist({
        symbol: sym,
        exchange: selectedSuggestion?.exchange ?? null,
      });

      setNewTicker("");
      setSelectedSuggestion(null);
      setSuggestions([]);
      setIsAddingCompany(false);

      await loadWatchlist();
    } catch (e: any) {
      // 409 = Already in watchlist
      const status = e?.response?.status;
      if (status === 409) {
        alert("Already in watchlist");
        setIsAddingCompany(false);
        await loadWatchlist();
        return;
      }
      console.error("add failed:", e);
      alert("Failed to add company");
    }
  };

  const sectors = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of catalog) {
      const s = (c.sector || "Unknown").trim() || "Unknown";
      map.set(s, (map.get(s) ?? 0) + 1);
    }
    // keep deterministic order
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([sector, count]) => ({ sector, count }));
  }, [catalog]);

  const handleAddSector = async (sectorName: string) => {
    const sectorCompanies = catalog.filter(
      (c) => (c.sector || "Unknown") === sectorName
    );

    if (sectorCompanies.length === 0) {
      setIsAddingSector(false);
      return;
    }

    // create tasks for adding all symbols of that sector
    const tasks = sectorCompanies.map((c) => async () => {
      // ignore duplicates (backend returns 409)
      try {
        return await addToWatchlist({ symbol: c.symbol, exchange: c.exchange });
      } catch (e: any) {
        if (e?.response?.status === 409) return null as any;
        throw e;
      }
    });

    try {
      await runWithConcurrency(tasks, 5);
      setIsAddingSector(false);
      await loadWatchlist();
    } catch (e) {
      console.error("Add sector failed:", e);
      alert("Failed to add sector companies");
    }
  };

  const whatsappEnabledCount = companies.filter((c) => c.whatsappEnabled).length;

  const handleSendToWhatsApp = () => {
    const enabledCompanies = companies.filter((c) => c.whatsappEnabled);
    if (enabledCompanies.length === 0) {
      alert("Please enable WhatsApp for at least one company");
      return;
    }
    alert(`Sending summaries for ${enabledCompanies.length} companies to WhatsApp`);
  };

  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.ticker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <FuturisticBackground />

      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0D0D0D]/80 backdrop-blur-xl border-b border-white/5">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-3">
              <div className="size-8 rounded-lg flex items-center justify-center">
                <img
                  src="/stoxie-logo.png"
                  alt="Stoxie Logo"
                  className="relative size-6 drop-shadow-[0_0_10px_rgba(34,211,238,0.9)]"
                />
              </div>
              <span className="tracking-tight">Stoxie</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm text-[#B3B3B3] hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/dashboard" className="text-sm text-[#B3B3B3] hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link to="/news" className="text-sm text-[#B3B3B3] hover:text-white transition-colors">
                Market News
              </Link>
              <Link to="/watchlist" className="text-sm text-white">
                Watchlist
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/profile">
              <Avatar className="size-8 cursor-pointer hover:ring-2 hover:ring-[#00FFFF]/50 transition-all">
                <AvatarFallback className="bg-gradient-to-br from-[#00FFFF] to-[#FF00FF] text-xs text-black">
                  <User className="size-4" />
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-20 px-8 pb-8 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl mb-2">Watchlist</h1>
          <p className="text-[#B3B3B3] mb-6">Manage your tracked companies and WhatsApp summaries</p>

          {/* Search and Actions */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 max-w-xl relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#B3B3B3]" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search companies..."
                className="pl-12 bg-[#111111] border-white/5 rounded-2xl h-14 focus:border-[#00FFFF]/50"
              />
            </div>
            <Button
              onClick={handleSendToWhatsApp}
              disabled={whatsappEnabledCount === 0}
              className="bg-[#25D366] hover:bg-[#25D366]/90 rounded-2xl h-14 px-6 disabled:opacity-50"
            >
              <Send className="mr-2 size-5" />
              Send to WhatsApp ({whatsappEnabledCount})
            </Button>
            <Button
              onClick={() => setIsAddingCompany(true)}
              className="bg-gradient-to-r from-[#00FFFF] to-[#00D4FF] hover:from-[#00D4FF] hover:to-[#00FFFF] text-black rounded-2xl h-14 px-6"
            >
              <Plus className="mr-2 size-5" />
              Add Company
            </Button>
            <Button
              onClick={() => setIsAddingSector(true)}
              className="bg-gradient-to-r from-[#A855F7] to-[#FF00FF] hover:from-[#FF00FF] hover:to-[#A855F7] text-white rounded-2xl h-14 px-6"
            >
              <Briefcase className="mr-2 size-5" />
              Add Sector
            </Button>
          </div>
        </motion.div>

        {/* Companies List */}
        <div className="space-y-4 mb-12">
          <AnimatePresence>
            {filteredCompanies.map((company, index) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-gradient-to-br from-[#111111] to-[#0D0D0D] rounded-2xl border border-white/5 p-6 hover:border-white/10 transition-all"
              >
                <div className="flex items-center justify-between">
                  {/* Company Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <Avatar className="size-14">
                      <AvatarFallback className="bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] text-lg">
                        {tickerBadge(company.ticker)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-lg mb-1">{company.ticker}</div>
                      <div className="text-sm text-[#B3B3B3]">{company.name}</div>
                      <div className="text-xs text-[#B3B3B3] mt-1">
                        <span className="px-2 py-0.5 rounded bg-white/5">{company.sector}</span>
                      </div>
                    </div>
                    <div
                      className={`ml-4 px-3 py-1 rounded-lg text-sm ${
                        company.change >= 0
                          ? "text-[#00FF88] bg-[#00FF88]/10"
                          : "text-red-400 bg-red-400/10"
                      }`}
                    >
                      {company.change >= 0 ? "+" : ""}
                      {company.changePercent.toFixed(2)}%
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-3xl mx-8">₹{company.price.toFixed(2)}</div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => toggleWhatsApp(company.id)}
                      className={`rounded-xl px-4 h-10 ${
                        company.whatsappEnabled
                          ? "bg-[#25D366] hover:bg-[#25D366]/90 text-white"
                          : "bg-white/5 hover:bg-white/10 text-[#B3B3B3]"
                      }`}
                    >
                      WhatsApp {company.whatsappEnabled ? "On" : "Off"}
                    </Button>
                    <Button
                      onClick={() => {
                        const sym = (company.ticker || "").toUpperCase();
                        const fav = readFavorites();
                        if (fav.has(sym)) fav.delete(sym);
                        else fav.add(sym);
                        writeFavorites(fav);
                          }}
                          variant="ghost"
                          size="icon"
                          className="rounded-xl text-[#FFD700] hover:bg-[#FFD700]/10"
                        >
                          <Star className="size-5" />
                    </Button>
                    <Button
                      onClick={() => handleRemoveCompany(company.id)}
                      variant="ghost"
                      size="icon"
                      className="rounded-xl text-red-400 hover:bg-red-400/10"
                    >
                      <Trash2 className="size-5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-[#111111] to-[#0D0D0D] rounded-2xl border border-white/5 p-6">
            <div className="text-[#B3B3B3] text-sm mb-2">Total Companies</div>
            <div className="text-3xl text-[#00FFFF]">{companies.length}</div>
          </div>
          <div className="bg-gradient-to-br from-[#111111] to-[#0D0D0D] rounded-2xl border border-white/5 p-6">
            <div className="text-[#B3B3B3] text-sm mb-2">WhatsApp Enabled</div>
            <div className="text-3xl text-[#25D366]">{whatsappEnabledCount}</div>
          </div>
          <div className="bg-gradient-to-br from-[#111111] to-[#0D0D0D] rounded-2xl border border-white/5 p-6">
            <div className="text-[#B3B3B3] text-sm mb-2">Total Sectors</div>
            <div className="text-3xl text-[#FF00FF]">
              {new Set(companies.map((c) => c.sector)).size}
            </div>
          </div>
        </div>
      </main>

      {/* Add Company Modal */}
      {isAddingCompany && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-[#111111] to-[#0D0D0D] rounded-3xl border border-white/10 p-8 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl">Add Company</h2>
              <Button
                onClick={() => setIsAddingCompany(false)}
                variant="ghost"
                size="icon"
                className="rounded-xl"
              >
                <X className="size-5" />
              </Button>
            </div>

            <Input
              value={newTicker}
              onChange={(e) => setNewTicker(e.target.value)}
              placeholder="Search by name or symbol (e.g., RIL)"
              className="mb-3 bg-[#1A1A1A] border-white/5 rounded-2xl h-12"
              onKeyPress={(e) => e.key === "Enter" && handleAddCompany()}
            />

            {/* Suggestions (minimal UI change, same modal styling) */}
            {suggestions.length > 0 && (
              <div className="mb-6 max-h-52 overflow-auto rounded-2xl border border-white/5 bg-[#111111]">
                {suggestions.map((s) => (
                  <button
                    key={s.symbol}
                    onClick={() => {
                      setSelectedSuggestion(s);
                      setNewTicker(s.symbol); // keep user aware what will be added
                      setSuggestions([]);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors"
                  >
                    <div className="text-sm">{s.companyName}</div>
                    <div className="text-xs text-[#B3B3B3]">
                      {s.symbol} • {s.exchange} • {s.sector}
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={() => setIsAddingCompany(false)}
                variant="outline"
                className="flex-1 rounded-2xl border-white/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddCompany}
                className="flex-1 bg-gradient-to-r from-[#00FFFF] to-[#00D4FF] hover:from-[#00D4FF] hover:to-[#00FFFF] text-black rounded-2xl"
              >
                Add
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Sector Modal */}
      {isAddingSector && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-[#111111] to-[#0D0D0D] rounded-3xl border border-white/10 p-8 max-w-2xl w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl">Add Sector</h2>
                <p className="text-sm text-[#B3B3B3] mt-1">
                  Select a sector to add all companies from that sector
                </p>
              </div>
              <Button
                onClick={() => setIsAddingSector(false)}
                variant="ghost"
                size="icon"
                className="rounded-xl"
              >
                <X className="size-5" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {sectors.map(({ sector, count }) => (
                <button
                  key={sector}
                  onClick={() => handleAddSector(sector)}
                  className="bg-[#1A1A1A] hover:bg-[#222222] border border-white/5 hover:border-[#00FFFF]/30 rounded-2xl p-6 text-left transition-all group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="size-10 rounded-xl bg-gradient-to-br from-[#00FFFF]/20 to-[#00D4FF]/20 flex items-center justify-center">
                      <Briefcase className="size-5 text-[#00FFFF]" />
                    </div>
                    <div className="text-lg group-hover:text-[#00FFFF] transition-colors">
                      {sector}
                    </div>
                  </div>
                  <div className="text-xs text-[#B3B3B3]">{count} companies</div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
