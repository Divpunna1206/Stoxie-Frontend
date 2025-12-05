import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Sparkles, ExternalLink, Search, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import FuturisticBackground from './FuturisticBackground';

const chartData = [
  { time: '09:00', value: 178.20 },
  { time: '10:00', value: 177.85 },
  { time: '11:00', value: 178.90 },
  { time: '12:00', value: 179.45 },
  { time: '13:00', value: 178.75 },
  { time: '14:00', value: 179.20 },
  { time: '15:00', value: 178.45 },
  { time: '16:00', value: 178.45 },
];

const newsItems = [
  {
    id: 1,
    title: 'Apple Announces New Vision Pro Features at WWDC',
    source: 'TechCrunch',
    time: '1h ago',
    sentiment: 'Positive',
  },
  {
    id: 2,
    title: 'iPhone Sales Beat Expectations in Q4',
    source: 'Bloomberg',
    time: '3h ago',
    sentiment: 'Positive',
  },
  {
    id: 3,
    title: 'Apple Services Revenue Continues Strong Growth',
    source: 'Reuters',
    time: '5h ago',
    sentiment: 'Positive',
  },
];

export default function StockDetail() {
  const { ticker } = useParams();
  const [activeTab, setActiveTab] = useState('1D');

  return (
    <div className="min-h-screen bg-black text-white">
      <FuturisticBackground />
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0D0D0D]/80 backdrop-blur-xl border-b border-white/5">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2">
              <TrendingUp className="size-5 text-[#2563EB]" />
              <span className="tracking-tight">Stack Test</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#B3B3B3]" />
              <Input
                placeholder="Search stocks, news..."
                className="pl-10 bg-[#111111] border-white/5 rounded-2xl h-10 focus:border-[#2563EB]/50"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link to="/profile">
              <Avatar className="size-8 cursor-pointer hover:ring-2 hover:ring-[#00FFFF]/50 transition-all">
                <AvatarFallback className="bg-gradient-to-br from-[#00FFFF] to-[#FF00FF] text-xs text-black">
                  <User className="size-5" />
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-14 px-8 pb-8 max-w-7xl mx-auto">
        {/* Back Button */}
        <Link to="/dashboard">
          <Button variant="ghost" className="mb-6 text-[#B3B3B3] hover:text-white">
            <ArrowLeft className="mr-2 size-4" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Stock Header */}
        <div className="bg-[#0D0D0D] rounded-3xl p-8 border border-white/5 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl">{ticker || 'AAPL'}</h1>
                <span className="px-3 py-1 rounded-full bg-[#06B6D4]/10 text-[#06B6D4] text-sm">
                  Bullish
                </span>
              </div>
              <p className="text-[#B3B3B3]">Apple Inc. - NASDAQ</p>
            </div>
            <div className="text-right">
              <div className="text-3xl mb-1">$178.45</div>
              <div className="text-[#06B6D4] flex items-center justify-end gap-1">
                <span>+$4.12</span>
                <span>(+2.36%)</span>
              </div>
              <div className="text-xs text-[#B3B3B3] mt-1">As of 4:00 PM EST</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button className="bg-[#2563EB] hover:bg-[#2563EB]/90 rounded-2xl">
              <Sparkles className="mr-2 size-4" />
              AI Summary
            </Button>
            <Button variant="outline" className="border-white/10 hover:bg-white/5 rounded-2xl">
              Add to Watchlist
            </Button>
            <Button variant="outline" className="border-white/10 hover:bg-white/5 rounded-2xl">
              <ExternalLink className="mr-2 size-4" />
              Company Website
            </Button>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-[#0D0D0D] rounded-3xl p-6 border border-white/5 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl">Price Chart</h2>
            <div className="flex items-center gap-2">
              {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map((period) => (
                <button
                  key={period}
                  onClick={() => setActiveTab(period)}
                  className={`px-4 py-2 rounded-xl text-sm transition-colors ${
                    activeTab === period
                      ? 'bg-[#2563EB] text-white'
                      : 'bg-[#111111] text-[#B3B3B3] hover:text-white'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" />
                <XAxis 
                  dataKey="time" 
                  stroke="#B3B3B3" 
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#B3B3B3" 
                  style={{ fontSize: '12px' }}
                  domain={['dataMin - 1', 'dataMax + 1']}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: '#111111', 
                    border: '1px solid rgba(255,255,255,0.05)', 
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#2563EB" 
                  strokeWidth={3}
                  fill="url(#colorGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-[#0D0D0D] rounded-3xl p-6 border border-white/5">
            <div className="text-sm text-[#B3B3B3] mb-2">Market Cap</div>
            <div className="text-2xl">$2.78T</div>
          </div>
          <div className="bg-[#0D0D0D] rounded-3xl p-6 border border-white/5">
            <div className="text-sm text-[#B3B3B3] mb-2">52W High</div>
            <div className="text-2xl">$199.62</div>
          </div>
          <div className="bg-[#0D0D0D] rounded-3xl p-6 border border-white/5">
            <div className="text-sm text-[#B3B3B3] mb-2">52W Low</div>
            <div className="text-2xl">$164.08</div>
          </div>
          <div className="bg-[#0D0D0D] rounded-3xl p-6 border border-white/5">
            <div className="text-sm text-[#B3B3B3] mb-2">Volume</div>
            <div className="text-2xl">52.3M</div>
          </div>
          <div className="bg-[#0D0D0D] rounded-3xl p-6 border border-white/5">
            <div className="text-sm text-[#B3B3B3] mb-2">P/E Ratio</div>
            <div className="text-2xl">29.45</div>
          </div>
          <div className="bg-[#0D0D0D] rounded-3xl p-6 border border-white/5">
            <div className="text-sm text-[#B3B3B3] mb-2">Dividend Yield</div>
            <div className="text-2xl">0.52%</div>
          </div>
          <div className="bg-[#0D0D0D] rounded-3xl p-6 border border-white/5">
            <div className="text-sm text-[#B3B3B3] mb-2">EPS</div>
            <div className="text-2xl">$6.05</div>
          </div>
          <div className="bg-[#0D0D0D] rounded-3xl p-6 border border-white/5">
            <div className="text-sm text-[#B3B3B3] mb-2">Beta</div>
            <div className="text-2xl">1.24</div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-[#0D0D0D] rounded-3xl border border-white/5 overflow-hidden">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full bg-transparent border-b border-white/5 rounded-none p-0">
              <TabsTrigger 
                value="overview" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2563EB] data-[state=active]:bg-transparent px-8 py-4"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="news" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2563EB] data-[state=active]:bg-transparent px-8 py-4"
              >
                News
              </TabsTrigger>
              <TabsTrigger 
                value="predictions" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2563EB] data-[state=active]:bg-transparent px-8 py-4"
              >
                Predictions
              </TabsTrigger>
              <TabsTrigger 
                value="sentiment" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2563EB] data-[state=active]:bg-transparent px-8 py-4"
              >
                Sentiment
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg mb-3">About Apple Inc.</h3>
                  <p className="text-[#B3B3B3] leading-relaxed">
                    Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company offers iPhone, Mac, iPad, and Wearables, Home and Accessories. It also provides AppleCare support services; cloud services; and operates various platforms, including the App Store.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-[#B3B3B3] mb-1">CEO</div>
                    <div>Tim Cook</div>
                  </div>
                  <div>
                    <div className="text-sm text-[#B3B3B3] mb-1">Founded</div>
                    <div>April 1, 1976</div>
                  </div>
                  <div>
                    <div className="text-sm text-[#B3B3B3] mb-1">Headquarters</div>
                    <div>Cupertino, California</div>
                  </div>
                  <div>
                    <div className="text-sm text-[#B3B3B3] mb-1">Employees</div>
                    <div>161,000</div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="news" className="p-8">
              <div className="space-y-4">
                {newsItems.map((news) => (
                  <Link key={news.id} to={`/summary/${news.id}`}>
                    <div className="bg-[#111111] rounded-2xl p-5 border border-white/5 hover:border-[#2563EB]/30 transition-all cursor-pointer group">
                      <div className="flex items-start justify-between mb-2">
                        <span className={`px-2 py-1 rounded-lg text-xs ${
                          news.sentiment === 'Positive' ? 'bg-[#06B6D4]/10 text-[#06B6D4]' :
                          news.sentiment === 'Neutral' ? 'bg-[#B3B3B3]/10 text-[#B3B3B3]' :
                          'bg-red-500/10 text-red-400'
                        }`}>
                          {news.sentiment}
                        </span>
                      </div>
                      <h3 className="mb-2 group-hover:text-[#2563EB] transition-colors">
                        {news.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-[#B3B3B3]">
                        <span>{news.source}</span>
                        <span>{news.time}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="predictions" className="p-8">
              <div className="text-center py-12">
                <Sparkles className="size-12 text-[#2563EB] mx-auto mb-4" />
                <h3 className="text-xl mb-2">AI Predictions</h3>
                <p className="text-[#B3B3B3] mb-6">
                  Get AI-powered price predictions and analysis for {ticker || 'AAPL'}
                </p>
                <Button className="bg-[#2563EB] hover:bg-[#2563EB]/90 rounded-2xl">
                  Generate Prediction
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="sentiment" className="p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl mb-1">Overall Sentiment</h3>
                    <p className="text-[#B3B3B3]">Based on recent news and social media</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl text-[#06B6D4] mb-1">82%</div>
                    <div className="text-sm text-[#B3B3B3]">Bullish</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#111111] rounded-2xl p-5 border border-white/5">
                    <div className="text-sm text-[#B3B3B3] mb-2">Positive</div>
                    <div className="text-2xl text-[#06B6D4]">72%</div>
                  </div>
                  <div className="bg-[#111111] rounded-2xl p-5 border border-white/5">
                    <div className="text-sm text-[#B3B3B3] mb-2">Neutral</div>
                    <div className="text-2xl text-[#B3B3B3]">18%</div>
                  </div>
                  <div className="bg-[#111111] rounded-2xl p-5 border border-white/5">
                    <div className="text-sm text-[#B3B3B3] mb-2">Negative</div>
                    <div className="text-2xl text-red-400">10%</div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
