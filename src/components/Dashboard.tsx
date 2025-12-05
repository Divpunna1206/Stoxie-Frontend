import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  TrendingUp, 
  Star,
  User,
  TrendingDown,
  ChevronDown
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import FuturisticBackground from './FuturisticBackground';

interface StockData {
  id: number;
  rank: number;
  name: string;
  ticker: string;
  price: number;
  change: number;
  sector: string;
  news: string;
  newsTime: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number;
  trending: 'up' | 'down';
  isFavorite: boolean;
  volume: number;
  chartData: number[];
  isNew?: boolean;
}

const generateChartData = (trending: 'up' | 'down') => {
  const data = [];
  let value = 50;
  for (let i = 0; i < 20; i++) {
    const change = trending === 'up' 
      ? Math.random() * 8 - 2 
      : Math.random() * 8 - 6;
    value = Math.max(10, Math.min(100, value + change));
    data.push(value);
  }
  return data;
};

const initialStocks: StockData[] = [
  {
    id: 1,
    rank: 1,
    name: 'Reliance Industries Ltd.',
    ticker: 'RIL',
    price: 2456.75,
    change: -2.45,
    sector: 'Energy',
    news: 'Reliance announces major investment in green energy sector with $10B plan',
    newsTime: '5 min ago',
    sentiment: 'positive',
    sentimentScore: 7.8,
    trending: 'down',
    isFavorite: true,
    volume: 45678923,
    chartData: generateChartData('down'),
  },
  {
    id: 2,
    rank: 2,
    name: 'HDFC Bank Ltd.',
    ticker: 'HDFCBANK',
    price: 1678.30,
    change: 0.92,
    sector: 'Banking',
    news: 'HDFC Bank Q4 results exceed analyst expectations with strong NII growth',
    newsTime: '12 min ago',
    sentiment: 'positive',
    sentimentScore: 8.2,
    trending: 'up',
    isFavorite: true,
    volume: 32145678,
    chartData: generateChartData('up'),
  },
  {
    id: 3,
    rank: 3,
    name: 'Bharti Airtel Ltd.',
    ticker: 'AIRTEL',
    price: 1234.50,
    change: -1.23,
    sector: 'Telecom',
    news: 'Airtel faces regulatory challenges as TRAI reviews tariff structure',
    newsTime: '18 min ago',
    sentiment: 'negative',
    sentimentScore: 4.2,
    trending: 'down',
    isFavorite: false,
    volume: 28934567,
    chartData: generateChartData('down'),
  },
  {
    id: 4,
    rank: 4,
    name: 'ICICI Bank Ltd.',
    ticker: 'ICICIBANK',
    price: 1089.20,
    change: 0.22,
    sector: 'Banking',
    news: 'ICICI Bank expands digital banking services to tier-2 cities',
    newsTime: '25 min ago',
    sentiment: 'neutral',
    sentimentScore: 5.8,
    trending: 'up',
    isFavorite: false,
    volume: 19876543,
    chartData: generateChartData('up'),
  },
  {
    id: 5,
    rank: 5,
    name: 'Infosys Ltd.',
    ticker: 'INFY',
    price: 1567.80,
    change: 1.45,
    sector: 'IT',
    news: 'Infosys wins major AI contract from European banking consortium',
    newsTime: '32 min ago',
    sentiment: 'positive',
    sentimentScore: 8.5,
    trending: 'up',
    isFavorite: true,
    volume: 41234567,
    chartData: generateChartData('up'),
  },
  {
    id: 6,
    rank: 6,
    name: 'Tata Motors Ltd.',
    ticker: 'TATAMOTORS',
    price: 789.45,
    change: -0.85,
    sector: 'Automotive',
    news: 'Tata Motors EV sales surge 45% YoY in latest quarter',
    newsTime: '45 min ago',
    sentiment: 'positive',
    sentimentScore: 7.2,
    trending: 'down',
    isFavorite: false,
    volume: 56789012,
    chartData: generateChartData('down'),
  },
];

const newStockUpdates: StockData[] = [
  {
    id: 100,
    rank: 0,
    name: 'Wipro Ltd.',
    ticker: 'WIPRO',
    price: 456.30,
    change: 3.25,
    sector: 'IT',
    news: 'Breaking: Wipro announces strategic partnership with Microsoft for cloud solutions',
    newsTime: 'Just now',
    sentiment: 'positive',
    sentimentScore: 8.8,
    trending: 'up',
    isFavorite: false,
    isNew: true,
    volume: 34567890,
    chartData: generateChartData('up'),
  },
  {
    id: 101,
    rank: 0,
    name: 'Asian Paints Ltd.',
    ticker: 'ASIANPAINT',
    price: 3245.60,
    change: -1.85,
    sector: 'Consumer Goods',
    news: 'Asian Paints faces margin pressure due to rising raw material costs',
    newsTime: 'Just now',
    sentiment: 'negative',
    sentimentScore: 3.8,
    trending: 'down',
    isFavorite: false,
    isNew: true,
    volume: 12345678,
    chartData: generateChartData('down'),
  },
];

const sectors = ['All Sectors', 'Banking', 'IT', 'Energy', 'Telecom', 'Automotive', 'Consumer Goods'];

export default function Dashboard() {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Favorites'>('All');
  const [selectedSector, setSelectedSector] = useState('All Sectors');
  const [stocks, setStocks] = useState<StockData[]>(initialStocks);
  const [showSectorDropdown, setShowSectorDropdown] = useState(false);

  // Simulate new stock updates being added
  useEffect(() => {
    let updateIndex = 0;
    const interval = setInterval(() => {
      if (updateIndex < newStockUpdates.length) {
        const newStock = { ...newStockUpdates[updateIndex], isNew: true };
        setStocks(prevStocks => {
          // Update ranks
          const updatedStocks = prevStocks.map(stock => ({
            ...stock,
            rank: stock.rank + 1,
            isNew: false,
          }));
          return [newStock, ...updatedStocks];
        });
        updateIndex++;
      }
    }, 8000); // Add new stock every 8 seconds

    return () => clearInterval(interval);
  }, []);

  const filteredStocks = stocks.filter(stock => {
    if (activeFilter === 'Favorites' && !stock.isFavorite) return false;
    if (selectedSector !== 'All Sectors' && stock.sector !== selectedSector) return false;
    return true;
  });

  // Count unread favorites
  const unreadFavoritesCount = stocks.filter(stock => stock.isFavorite && stock.isNew).length;

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '#00FF88';
      case 'negative':
        return '#FF4D4D';
      default:
        return '#FFD700';
    }
  };

  const toggleFavorite = (id: number) => {
    setStocks(prevStocks =>
      prevStocks.map(stock =>
        stock.id === id ? { ...stock, isFavorite: !stock.isFavorite } : stock
      )
    );
  };

  const formatVolume = (volume: number) => {
    if (volume >= 10000000) {
      return `${(volume / 10000000).toFixed(2)}Cr`;
    } else if (volume >= 100000) {
      return `${(volume / 100000).toFixed(2)}L`;
    }
    return volume.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <FuturisticBackground />

      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0D1424]/80 backdrop-blur-xl border-b border-white/10">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3">
              <div className="size-10 flex items-center justify-center">
                 <img src="/favicon.png" alt="Stoxie Logo" className="size-8" />
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
        {/* Main Content */}
        <main className="p-8">
          {/* Dashboard Header */}
          <div className="mb-6">
            <h1 className="text-2xl">Dashboard</h1>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveFilter('All')}
                className={`px-6 py-2.5 rounded-2xl text-sm transition-all cursor-pointer ${
                  activeFilter === 'All'
                    ? 'bg-gradient-to-r from-[#1E3A5F] to-[#2A4A6F] text-white border border-[#00FFFF]/30'
                    : 'bg-[#1A1A1A] text-[#B3B3B3] hover:bg-[#222222]'
                }`}
              >
                All Stocks
              </button>
              <button
                onClick={() => setActiveFilter('Favorites')}
                className={`px-6 py-2.5 rounded-2xl text-sm transition-all flex items-center gap-2 cursor-pointer relative ${
                  activeFilter === 'Favorites'
                    ? 'bg-gradient-to-r from-[#1E3A5F] to-[#2A4A6F] text-white border border-[#00FFFF]/30'
                    : 'bg-[#1A1A1A] text-[#B3B3B3] hover:bg-[#222222]'
                }`}
              >
                <Star className={`size-4 ${activeFilter === 'Favorites' ? 'fill-[#FFD700] text-[#FFD700]' : ''}`} />
                Favorites
                {unreadFavoritesCount > 0 && (
                  <span className="ml-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#00FFFF] to-[#00D4FF] text-black text-xs">
                    {unreadFavoritesCount}
                  </span>
                )}
              </button>
              
              {/* Sector Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSectorDropdown(!showSectorDropdown)}
                  className="px-6 py-2.5 rounded-2xl text-sm transition-all bg-[#1A1A1A] text-[#B3B3B3] hover:bg-[#222222] flex items-center gap-2 cursor-pointer"
                >
                  {selectedSector}
                  <ChevronDown className="size-4" />
                </button>
                
                {showSectorDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full mt-2 left-0 bg-[#1A1A1A] border border-white/10 rounded-2xl overflow-hidden shadow-xl min-w-[200px] z-50"
                  >
                    {sectors.map((sector) => (
                      <button
                        key={sector}
                        onClick={() => {
                          setSelectedSector(sector);
                          setShowSectorDropdown(false);
                        }}
                        className={`w-full px-4 py-2.5 text-sm text-left hover:bg-white/5 transition-colors cursor-pointer ${
                          selectedSector === sector ? 'text-[#00FFFF] bg-white/5' : 'text-[#B3B3B3]'
                        }`}
                      >
                        {sector}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            <div className="text-sm text-[#B3B3B3]">
              Showing {filteredStocks.length} stocks
            </div>
          </div>

          {/* Enhanced Trading Table */}
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
                            backgroundColor: stock.isNew ? 'rgba(0, 255, 255, 0.1)' : 'transparent'
                          }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ duration: 0.5 }}
                          className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => toggleFavorite(stock.id)}
                                className="hover:scale-110 transition-transform"
                              >
                                <Star 
                                  className={`size-4 ${
                                    stock.isFavorite 
                                      ? 'text-[#FFD700] fill-[#FFD700]' 
                                      : 'text-[#4A4A4A]'
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
                              <div className={`px-4 py-2 rounded-full ${
                                stock.change >= 0 ? 'bg-[#00FF88]/20 text-[#00FF88]' : 'bg-red-400/20 text-red-400'
                              }`}>
                                <span className="text-sm">
                                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <span className="text-xs text-[#B3B3B3]">{formatVolume(stock.volume)}</span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="max-w-md">
                              <p className="text-xs text-[#B3B3B3] line-clamp-2 mb-3">
                                {stock.news}
                              </p>
                              <div className="flex items-center justify-between">
                                <Link 
                                  to={`/summary/${stock.id}`} 
                                  state={{ 
                                    newsTitle: stock.news,
                                    newsTime: stock.newsTime,
                                    company: stock.name,
                                    ticker: stock.ticker,
                                    sentiment: stock.sentiment,
                                    sentimentScore: stock.sentimentScore
                                  }}
                                  className="text-xs text-[#00FFFF] hover:text-[#00D4FF] transition-colors"
                                >
                                  Read more →
                                </Link>
                                <span className="text-xs text-[#B3B3B3]">
                                  {stock.newsTime}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-col items-center group">
                              <div className="relative size-16 mb-2">
                                {/* Background circle */}
                                <svg className="size-full -rotate-90">
                                  <circle
                                    cx="32"
                                    cy="32"
                                    r="28"
                                    stroke="rgba(255,255,255,0.1)"
                                    strokeWidth="4"
                                    fill="none"
                                  />
                                  {/* Progress circle */}
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
                                    className="group-hover:drop-shadow-[0_0_8px_var(--glow-color)] transition-all"
                                    style={{
                                      '--glow-color': sentimentColor,
                                      filter: `drop-shadow(0 0 4px ${sentimentColor})`
                                    } as any}
                                  />
                                </svg>
                                {/* Score text */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-xs group-hover:scale-110 transition-transform" style={{ color: sentimentColor }}>
                                    {stock.sentimentScore.toFixed(1)}
                                  </span>
                                </div>
                              </div>
                              {/* Sentiment label */}
                              <span 
                                className="text-xs capitalize px-2 py-0.5 rounded-full"
                                style={{ 
                                  color: sentimentColor,
                                  backgroundColor: `${sentimentColor}20`
                                }}
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
