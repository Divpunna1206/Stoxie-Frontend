import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, TrendingUp, Sparkles, ExternalLink, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import FuturisticBackground from './FuturisticBackground';

const newsArticles = [
  {
    id: 1,
    title: 'Tech Stocks Surge on AI Optimism as Major Companies Announce Breakthroughs',
    source: 'Financial Times',
    sector: 'IT',
    time: '2 hours ago',
    sentiment: 'Positive',
    excerpt: 'Major technology companies are seeing significant gains as artificial intelligence innovations continue to drive market enthusiasm...',
  },
  {
    id: 2,
    title: 'Federal Reserve Holds Interest Rates Steady Amid Economic Uncertainty',
    source: 'Bloomberg',
    sector: 'Banking',
    time: '4 hours ago',
    sentiment: 'Neutral',
    excerpt: 'The Federal Reserve decided to maintain current interest rates, signaling a cautious approach to monetary policy...',
  },
  {
    id: 3,
    title: 'Oil Prices Drop 3% Amid Global Supply Concerns and Demand Forecasts',
    source: 'Reuters',
    sector: 'Energy',
    time: '6 hours ago',
    sentiment: 'Negative',
    excerpt: 'Crude oil prices fell sharply today as traders reassess global demand amid new supply data from major producers...',
  },
  {
    id: 4,
    title: 'Electric Vehicle Sales Hit Record High in Q4 Despite Market Challenges',
    source: 'CNBC',
    sector: 'Automotive',
    time: '8 hours ago',
    sentiment: 'Positive',
    excerpt: 'Electric vehicle manufacturers reported record sales figures, surpassing analyst expectations despite ongoing supply chain issues...',
  },
  {
    id: 5,
    title: 'Banking Sector Shows Strong Earnings Growth as Digital Services Expand',
    source: 'Wall Street Journal',
    sector: 'Banking',
    time: '10 hours ago',
    sentiment: 'Positive',
    excerpt: 'Major banks reported better-than-expected quarterly earnings, driven by growth in digital banking services and improved loan quality...',
  },
  {
    id: 6,
    title: 'Retail Sector Faces Headwinds as Consumer Spending Patterns Shift',
    source: 'MarketWatch',
    sector: 'Consumer Goods',
    time: '12 hours ago',
    sentiment: 'Negative',
    excerpt: 'Traditional retailers are grappling with changing consumer behaviors as online shopping continues to gain market share...',
  },
  {
    id: 7,
    title: 'Semiconductor Stocks Rally on Increased Demand for AI Chips',
    source: 'TechCrunch',
    sector: 'IT',
    time: '14 hours ago',
    sentiment: 'Positive',
    excerpt: 'Chip manufacturers are seeing increased orders as demand for AI-capable processors continues to accelerate across industries...',
  },
  {
    id: 8,
    title: 'Telecom Giants Invest $50B in 5G Infrastructure Expansion',
    source: 'Bloomberg Healthcare',
    sector: 'Telecom',
    time: '16 hours ago',
    sentiment: 'Neutral',
    excerpt: 'Major telecommunications companies announce massive infrastructure investments to accelerate 5G network deployment across urban areas...',
  },
  {
    id: 9,
    title: 'HDFC Bank Reports Record Quarterly Profits with Strong NII Growth',
    source: 'Financial Times',
    sector: 'Banking',
    time: '18 hours ago',
    sentiment: 'Positive',
    excerpt: 'HDFC Bank exceeds analyst expectations with robust net interest income growth and improved asset quality metrics...',
  },
  {
    id: 10,
    title: 'Reliance Industries Announces $10B Green Energy Investment',
    source: 'Economic Times',
    sector: 'Energy',
    time: '20 hours ago',
    sentiment: 'Positive',
    excerpt: 'Reliance Industries unveils ambitious green energy roadmap with major investments in solar and hydrogen technologies...',
  },
  {
    id: 11,
    title: 'Tata Motors EV Sales Surge 45% Year-over-Year',
    source: 'Reuters',
    sector: 'Automotive',
    time: '22 hours ago',
    sentiment: 'Positive',
    excerpt: 'Tata Motors electric vehicle division posts impressive growth numbers as Indian EV market continues rapid expansion...',
  },
  {
    id: 12,
    title: 'Asian Paints Faces Margin Pressure from Rising Raw Material Costs',
    source: 'CNBC',
    sector: 'Consumer Goods',
    time: '1 day ago',
    sentiment: 'Negative',
    excerpt: 'Leading paint manufacturer reports margin compression as input costs surge, putting pressure on profitability...',
  },
];

const sectors = ['All Sectors', 'Banking', 'IT', 'Energy', 'Telecom', 'Automotive', 'Consumer Goods'];

export default function NewsPage() {
  const [selectedSector, setSelectedSector] = useState('All Sectors');

  const filteredArticles = newsArticles.filter(article => {
    if (selectedSector !== 'All Sectors' && article.sector !== selectedSector) return false;
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
                 <img src="/favicon.png" alt="Stoxie Logo" className="size-8" />
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
                  ? 'bg-gradient-to-r from-[#1E3A5F] to-[#2A4A6F] text-white border border-[#00FFFF]/30'
                  : 'bg-[#1A1A1A] text-[#B3B3B3] hover:bg-[#222222]'
              }`}
            >
              {sector}
            </button>
          ))}
        </div>

        {/* Article Count */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-sm text-[#B3B3B3]">
            Showing {filteredArticles.length} articles
          </div>
        </div>

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-gradient-to-br from-[#111111] to-[#0D0D0D] rounded-3xl border border-white/5 hover:border-[#00FFFF]/30 transition-all overflow-hidden group"
            >
              {/* Article Image Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] flex items-center justify-center border-b border-white/5">
                <div className="text-4xl">📰</div>
              </div>

              <div className="p-6">
                {/* Tags */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 rounded-lg bg-[#1A1A1A] text-[#B3B3B3] text-xs">
                    {article.sector}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg mb-3 group-hover:text-[#00FFFF] transition-colors line-clamp-2">
                  {article.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-[#B3B3B3] mb-4 line-clamp-3">
                  {article.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-[#B3B3B3] mb-4">
                  <span>{article.source}</span>
                  <span>{article.time}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <a 
                    href="https://www.example.com/article" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
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

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" className="border-white/10 hover:bg-white/5 rounded-2xl px-8">
            Load More Articles
          </Button>
        </div>
      </main>
    </div>
  );
}
