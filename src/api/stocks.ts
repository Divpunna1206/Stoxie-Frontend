
// src/api/stocks.ts
import apiClient from "./client";

type WatchlistItem = {
  id: number;
  symbol: string;
  name: string;
  sector: string | null;
  notify_whatsapp: boolean;
};

type CompanyCatalogItem = {
  catalog_id?: number | null;
  symbol: string; // e.g. "RIL.BSE"
  companyName: string;
  sector: string;
  exchange: string;
  price?: number | null;
  currency?: string;
};

export type StockQuote = {
  symbol: string;
  name: string;
  sector: string;
  price: number;

  // placeholders until paid APIs
  change: number; // dashboard renders as "%", so keep 0 for now
  volume: number;
  sentiment_score?: number | null;
  last_news_headline?: string | null;
  last_updated?: string | null;
};

let catalogMapCache: Map<string, CompanyCatalogItem> | null = null;

async function getCatalogMap(): Promise<Map<string, CompanyCatalogItem>> {
  if (catalogMapCache) return catalogMapCache;

  const res = await apiClient.get<CompanyCatalogItem[]>("/companies", {
    params: { q: "", limit: 500 },
  });

  const map = new Map<string, CompanyCatalogItem>();
  for (const c of res.data || []) {
    map.set((c.symbol || "").toUpperCase(), c);
  }

  catalogMapCache = map;
  return map;
}

export async function fetchDashboardStocks(): Promise<StockQuote[]> {
  // 1) Watchlist = what to show on dashboard
  const wlRes = await apiClient.get<WatchlistItem[]>("/watchlist");
  const watchlist = wlRes.data || [];

  if (watchlist.length === 0) return [];

  // 2) Catalog = optional (price/sector help)
  let catalog: Map<string, CompanyCatalogItem> | null = null;
  try {
    catalog = await getCatalogMap();
  } catch {
    catalog = null;
  }

  // 3) Build quotes with safe placeholders
  const nowIso = new Date().toISOString();

  return watchlist.map((w) => {
    const symUpper = (w.symbol || "").toUpperCase();
    const cat = catalog?.get(symUpper);

    return {
      symbol: w.symbol,
      name: w.name,
      sector: (w.sector ?? cat?.sector ?? "Unknown") as string,
      price: Number(cat?.price ?? 0),

      change: 0,
      volume: 0,
      sentiment_score: 5.0,
      last_news_headline: null,
      last_updated: nowIso,
    };
  });
}

export async function fetchStockBySymbol(
  symbol: string
): Promise<StockQuote | null> {
  const stocks = await fetchDashboardStocks();
  return stocks.find((s) => s.symbol?.toUpperCase() === symbol.toUpperCase()) ?? null;
}
