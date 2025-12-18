
// import apiClient from "./client";

// export type WatchlistItem = {
//   id: number;
//   symbol: string;
//   name: string;
//   sector: string | null;
//   notify_whatsapp?: boolean;
// };

// export async function fetchWatchlist(): Promise<WatchlistItem[]> {
//   const res = await apiClient.get<WatchlistItem[]>("/watchlist");
//   return res.data;
// }

// /**
//  * Add to watchlist.
//  * Backend schema: probably symbol + optional name/sector.
//  */
// export async function addToWatchlist(params: {
//   symbol: string;
//   name?: string;
//   sector?: string | null;
// }): Promise<WatchlistItem> {
//   const res = await apiClient.post<WatchlistItem>("/watchlist", {
//     symbol: params.symbol,
//     name: params.name,
//     sector: params.sector ?? null,
//   });
//   return res.data;
// }

// export async function removeFromWatchlist(id: number): Promise<void> {
//   await apiClient.delete(`/watchlist/${id}`);
// }

// /**
//  * Optional: only if your backend has PATCH /watchlist/{id}/whatsapp
//  */
// export async function toggleWatchlistWhatsapp(
//   id: number,
//   notify: boolean
// ): Promise<WatchlistItem> {
//   const res = await apiClient.patch<WatchlistItem>(
//     `/watchlist/${id}/whatsapp`,
//     { notify_whatsapp: notify }
//   );
//   return res.data;
// }

// src/api/watchlist.ts
// import apiClient from "./client";

// export type WatchlistItem = {
//   id: number;
//   symbol: string;
//   name: string;
//   sector: string | null;
//   notify_whatsapp: boolean;
// };

// export type CompanyCatalogItem = {
//   catalog_id?: number | null;
//   symbol: string; // e.g. "RELIANCE.BSE"
//   companyName: string;
//   sector: string;
//   exchange: string; // "BSE" | "NSE"
//   price?: number | null;
//   currency?: string;
// };

// export async function fetchWatchlist(): Promise<WatchlistItem[]> {
//   const res = await apiClient.get<WatchlistItem[]>("/watchlist");
//   return res.data;
// }

// /**
//  * Backend schema: { symbol, exchange? }
//  */
// export async function addToWatchlist(params: {
//   symbol: string;
//   exchange?: "BSE" | "NSE";
// }): Promise<WatchlistItem> {
//   const res = await apiClient.post<WatchlistItem>("/watchlist", {
//     symbol: params.symbol,
//     exchange: params.exchange,
//   });
//   return res.data;
// }

// export async function removeFromWatchlist(id: number): Promise<void> {
//   await apiClient.delete(`/watchlist/${id}`);
// }

// export async function toggleWatchlistWhatsapp(
//   id: number,
//   notify: boolean
// ): Promise<WatchlistItem> {
//   const res = await apiClient.patch<WatchlistItem>(`/watchlist/${id}/whatsapp`, {
//     notify_whatsapp: notify,
//   });
//   return res.data;
// }

// export async function fetchCompanies(params?: {
//   q?: string;
//   limit?: number;
//   exchange?: "BSE" | "NSE";
// }): Promise<CompanyCatalogItem[]> {
//   const res = await apiClient.get<CompanyCatalogItem[]>("/companies", {
//     params: {
//       q: params?.q ?? "",
//       limit: params?.limit ?? 500,
//       exchange: params?.exchange,
//     },
//   });
//   return res.data;
// }

// export async function searchCompanies(params: {
//   q: string;
//   limit?: number;
//   exchange?: "BSE" | "NSE";
// }): Promise<CompanyCatalogItem[]> {
//   const res = await apiClient.get<CompanyCatalogItem[]>("/companies/search", {
//     params: {
//       q: params.q,
//       limit: params.limit ?? 20,
//       exchange: params.exchange,
//     },
//   });
//   return res.data;
// }

// src/api/watchlist.ts
import apiClient from "./client";

export type WatchlistItem = {
  id: number;
  symbol: string;
  name: string;
  sector: string | null;
  notify_whatsapp: boolean;
};

export type CompanySearchResult = {
  catalog_id?: number | null;
  symbol: string; // e.g. "RIL.BSE"
  companyName: string;
  sector: string;
  exchange: string; // "BSE" | "NSE"
  price?: number | null;
  currency?: string; // "INR"
};

export async function fetchWatchlist(): Promise<WatchlistItem[]> {
  const res = await apiClient.get<WatchlistItem[]>("/watchlist");
  return res.data;
}

/**
 * Backend expects: { symbol, exchange? }
 * (NOT name/sector)
 */
export async function addToWatchlist(params: {
  symbol: string;
  exchange?: string | null; // "BSE" | "NSE"
}): Promise<WatchlistItem> {
  const res = await apiClient.post<WatchlistItem>("/watchlist", {
    symbol: params.symbol,
    exchange: params.exchange ?? null,
  });
  return res.data;
}

export async function removeFromWatchlist(id: number): Promise<void> {
  await apiClient.delete(`/watchlist/${id}`);
}

export async function toggleWatchlistWhatsapp(
  id: number,
  notify: boolean
): Promise<WatchlistItem> {
  const res = await apiClient.patch<WatchlistItem>(`/watchlist/${id}/whatsapp`, {
    notify_whatsapp: notify,
  });
  return res.data;
}

/**
 * Company catalog endpoints (for Add Company modal + Add Sector modal)
 */
export async function searchCompanies(params: {
  q: string;
  limit?: number;
  exchange?: string | null;
}): Promise<CompanySearchResult[]> {
  const res = await apiClient.get<CompanySearchResult[]>("/companies/search", {
    params: {
      q: params.q,
      limit: params.limit ?? 20,
      exchange: params.exchange ?? undefined,
    },
  });
  return res.data;
}

export async function fetchCompanies(params?: {
  q?: string;
  limit?: number; // can be up to 500 (your backend supports it)
  exchange?: string | null;
}): Promise<CompanySearchResult[]> {
  const res = await apiClient.get<CompanySearchResult[]>("/companies", {
    params: {
      q: params?.q ?? "",
      limit: params?.limit ?? 20,
      exchange: params?.exchange ?? undefined,
    },
  });
  return res.data;
}
