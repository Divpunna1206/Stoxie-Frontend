
import client from "./client";

export type NewsItem = {
  id?: string;
  source: string;
  title: string;
  url: string;
  published_at?: string;
  summary?: string | null;
  market_impact?: string | null;
  sentiment_score?: number | null;
  image_url?: string | null;

  sector?: string | null; // ✅ NEW
};

export async function fetchNews(params?: { limit?: number; refresh?: boolean }): Promise<NewsItem[]> {
  const res = await client.get("/news", {
    params: {
      limit: params?.limit ?? 30,
      refresh: params?.refresh ?? false,
    },
    timeout: 30000,
  });

  const data: any = res.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}
