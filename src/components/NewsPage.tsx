
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ExternalLink, User } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import FuturisticBackground from "./FuturisticBackground";
import { fetchNews, NewsItem } from "../api/news";

const sectors = ["All Sectors", "Banking", "IT", "Energy", "Telecom", "Automotive", "Consumer Goods"];

interface ArticleView {
  id: string;
  title: string;
  source: string;
  sector: string;
  time: string;
  sentiment: "Positive" | "Negative" | "Neutral";
  excerpt: string;
  url: string;
  imageUrl?: string | null;
}

const formatTimeAgo = (iso?: string): string => {
  if (!iso) return "Just now";
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min${diffMinutes > 1 ? "s" : ""} ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
};

const isValidImageUrl = (url?: string | null) => {
  if (!url) return false;
  const u = url.trim();
  return u.startsWith("http://") || u.startsWith("https://");
};

const mapNewsItemToArticle = (item: NewsItem): ArticleView => {
  const score = typeof item.sentiment_score === "number" ? item.sentiment_score : 5;
  let sentiment: "Positive" | "Negative" | "Neutral";
  if (score >= 6.5) sentiment = "Positive";
  else if (score <= 4) sentiment = "Negative";
  else sentiment = "Neutral";

  // ✅ use backend sector
  const sector = (item.sector && item.sector.trim()) ? item.sector : "General";

  return {
    id: item.id || item.url,
    title: item.title,
    source: item.source,
    sector,
    time: formatTimeAgo(item.published_at),
    sentiment,
    excerpt: item.summary || item.market_impact || "No summary available.",
    url: item.url || "#",
    imageUrl: item.image_url ?? null,
  };
};


export default function NewsPage() {
  const [selectedSector, setSelectedSector] = useState("All Sectors");
  const [articles, setArticles] = useState<ArticleView[]>([]);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const items = await fetchNews({ limit: 30, refresh: true });
        const mapped = items.map(mapNewsItemToArticle);
        setArticles(mapped);
      } catch (err) {
        console.error("Failed to load news", err);
        setArticles([]);
      }
    };

    loadNews();
  }, []);

  const filteredArticles = articles.filter((article) => {
    if (selectedSector !== "All Sectors" && article.sector !== selectedSector) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <FuturisticBackground />

      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0D1424]/80 backdrop-blur-xl border-b border-white/10">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl flex items-center justify-center">
                <img
                  src="/stoxie-logo.png"
                  alt="Stoxie Logo"
                  className="relative size-6 drop-shadow-[0_0_10px_rgba(34,211,238,0.9)]"
                />
              </div>
              <span className="text-xl tracking-tight">Stoxie</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm text-white/60 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/dashboard" className="text-sm text-white/60 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link to="/news" className="text-sm text-white">
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
                placeholder="Search news..."
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

      <main className="relative z-10 pt-24 px-8 pb-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl mb-2">Market News</h1>
          <p className="text-[#B3B3B3]">Stay updated with the latest financial news and market insights</p>
        </div>

        {/* Sector Filters */}
        <div className="flex items-center gap-3 mb-8">
          {sectors.map((sector) => (
            <button
              key={sector}
              onClick={() => setSelectedSector(sector)}
              className={`px-6 py-2.5 rounded-2xl text-sm transition-all ${
                selectedSector === sector
                  ? "bg-gradient-to-r from-[#1E3A5F] to-[#2A4A6F] text-white border border-[#00FFFF]/30"
                  : "bg-[#1A1A1A] text-[#B3B3B3] hover:bg-[#222222]"
              }`}
            >
              {sector}
            </button>
          ))}
        </div>

        {/* Article Count */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-sm text-[#B3B3B3]">Showing {filteredArticles.length} articles</div>
        </div>

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-gradient-to-br from-[#111111] to-[#0D0D0D] rounded-3xl border border-white/5 hover:border-[#00FFFF]/30 transition-all overflow-hidden group"
            >
              {/* ✅ Article Image (safe) */}
              <div className="aspect-video bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border-b border-white/5 overflow-hidden flex items-center justify-center">
                {isValidImageUrl(article.imageUrl) ? (
                  <img
                    src={article.imageUrl!.trim()}
                    alt={article.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // hide the broken image if it fails
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="text-4xl">📰</div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 rounded-lg bg-[#1A1A1A] text-[#B3B3B3] text-xs">
                    {article.sector}
                  </span>
                </div>

                <h3 className="text-lg mb-3 group-hover:text-[#00FFFF] transition-colors line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-sm text-[#B3B3B3] mb-4 line-clamp-3">{article.excerpt}</p>

                <div className="flex items-center justify-between text-xs text-[#B3B3B3] mb-4">
                  <span>{article.source}</span>
                  <span>{article.time}</span>
                </div>

                <div className="flex items-center gap-2">
                  <a href={article.url || "#"} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-[#00FFFF] to-[#00D4FF] hover:from-[#00D4FF] hover:to-[#00FFFF] text-black rounded-2xl text-sm h-9">
                      <ExternalLink className="mr-2 size-3" />
                      Read Article
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" className="border-white/10 hover:bg-white/5 rounded-2xl px-8">
            Load More Articles
          </Button>
        </div>
      </main>
    </div>
  );
}
