import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  Search,
  Plus,
  Send,
  Star,
  Trash2,
  User,
  Sparkles,
  X,
  Briefcase,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import FuturisticBackground from './FuturisticBackground';

interface Company {
  id: string;
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  whatsappEnabled: boolean;
  sector: string;
}

const sectorCompanies = {
  Banking: [
    { ticker: 'HDFCBANK', name: 'HDFC Bank Ltd.', sector: 'Banking' },
    { ticker: 'ICICIBANK', name: 'ICICI Bank Ltd.', sector: 'Banking' },
    { ticker: 'SBIN', name: 'State Bank of India', sector: 'Banking' },
    { ticker: 'AXISBANK', name: 'Axis Bank Ltd.', sector: 'Banking' },
  ],
  IT: [
    { ticker: 'INFY', name: 'Infosys Ltd.', sector: 'IT' },
    { ticker: 'TCS', name: 'Tata Consultancy Services', sector: 'IT' },
    { ticker: 'WIPRO', name: 'Wipro Ltd.', sector: 'IT' },
    { ticker: 'HCLTECH', name: 'HCL Technologies', sector: 'IT' },
  ],
  Energy: [
    { ticker: 'RIL', name: 'Reliance Industries Ltd.', sector: 'Energy' },
    { ticker: 'ONGC', name: 'Oil & Natural Gas Corp', sector: 'Energy' },
    { ticker: 'IOC', name: 'Indian Oil Corporation', sector: 'Energy' },
    { ticker: 'BPCL', name: 'Bharat Petroleum Corp', sector: 'Energy' },
  ],
  Telecom: [
    { ticker: 'AIRTEL', name: 'Bharti Airtel Ltd.', sector: 'Telecom' },
    { ticker: 'RJIO', name: 'Reliance Jio', sector: 'Telecom' },
    { ticker: 'IDEA', name: 'Vodafone Idea Ltd.', sector: 'Telecom' },
  ],
  Automotive: [
    { ticker: 'TATAMOTORS', name: 'Tata Motors Ltd.', sector: 'Automotive' },
    { ticker: 'M&M', name: 'Mahindra & Mahindra', sector: 'Automotive' },
    { ticker: 'MARUTI', name: 'Maruti Suzuki India', sector: 'Automotive' },
    { ticker: 'HEROMOTOCO', name: 'Hero MotoCorp Ltd.', sector: 'Automotive' },
  ],
  'Consumer Goods': [
    { ticker: 'ASIANPAINT', name: 'Asian Paints Ltd.', sector: 'Consumer Goods' },
    { ticker: 'HINDUNILVR', name: 'Hindustan Unilever', sector: 'Consumer Goods' },
    { ticker: 'ITC', name: 'ITC Ltd.', sector: 'Consumer Goods' },
    { ticker: 'BRITANNIA', name: 'Britannia Industries', sector: 'Consumer Goods' },
  ],
};

const initialCompanies: Company[] = [
  {
    id: '1',
    ticker: 'RIL',
    name: 'Reliance Industries Ltd.',
    price: 2456.75,
    change: 3.21,
    changePercent: 2.34,
    whatsappEnabled: true,
    sector: 'Energy',
  },
  {
    id: '2',
    ticker: 'HDFCBANK',
    name: 'HDFC Bank Ltd.',
    price: 1678.30,
    change: 12.45,
    changePercent: 5.12,
    whatsappEnabled: true,
    sector: 'Banking',
  },
  {
    id: '3',
    ticker: 'INFY',
    name: 'Infosys Ltd.',
    price: 1567.80,
    change: -1.23,
    changePercent: -1.23,
    whatsappEnabled: false,
    sector: 'IT',
  },
];

export default function WatchlistPage() {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingCompany, setIsAddingCompany] = useState(false);
  const [isAddingSector, setIsAddingSector] = useState(false);
  const [newTicker, setNewTicker] = useState('');

  const toggleWhatsApp = (id: string) => {
    setCompanies(companies.map(c => 
      c.id === id ? { ...c, whatsappEnabled: !c.whatsappEnabled } : c
    ));
  };

  const handleRemoveCompany = (id: string) => {
    setCompanies(companies.filter(c => c.id !== id));
  };

  const handleAddCompany = () => {
    if (newTicker.trim()) {
      const newCompany: Company = {
        id: Date.now().toString(),
        ticker: newTicker.toUpperCase(),
        name: `${newTicker.toUpperCase()} Company`,
        price: Math.random() * 500 + 50,
        change: Math.random() * 20 - 10,
        changePercent: Math.random() * 5 - 2.5,
        whatsappEnabled: false,
        sector: 'Other',
      };
      setCompanies([...companies, newCompany]);
      setNewTicker('');
      setIsAddingCompany(false);
    }
  };

  const handleAddSector = (sectorName: string) => {
    const sectorComps = sectorCompanies[sectorName as keyof typeof sectorCompanies];
    const newCompanies = sectorComps.map((comp) => ({
      id: Date.now().toString() + Math.random(),
      ticker: comp.ticker,
      name: comp.name,
      price: Math.random() * 3000 + 500,
      change: Math.random() * 20 - 10,
      changePercent: Math.random() * 5 - 2.5,
      whatsappEnabled: false,
      sector: comp.sector,
    }));
    
    // Filter out companies that already exist
    const existingTickers = companies.map(c => c.ticker);
    const filteredNewCompanies = newCompanies.filter(c => !existingTickers.includes(c.ticker));
    
    setCompanies([...companies, ...filteredNewCompanies]);
    setIsAddingSector(false);
  };

  const whatsappEnabledCount = companies.filter(c => c.whatsappEnabled).length;

  const handleSendToWhatsApp = () => {
    const enabledCompanies = companies.filter(c => c.whatsappEnabled);
    if (enabledCompanies.length === 0) {
      alert('Please enable WhatsApp for at least one company');
      return;
    }
    alert(`Sending summaries for ${enabledCompanies.length} companies to WhatsApp`);
  };

  const filteredCompanies = companies.filter(c =>
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
                 <img src="/favicon.png" alt="Stoxie Logo" className="size-8" />
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
                        {company.ticker.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-lg mb-1">{company.ticker}</div>
                      <div className="text-sm text-[#B3B3B3]">{company.name}</div>
                      <div className="text-xs text-[#B3B3B3] mt-1">
                        <span className="px-2 py-0.5 rounded bg-white/5">{company.sector}</span>
                      </div>
                    </div>
                    <div className={`ml-4 px-3 py-1 rounded-lg text-sm ${
                      company.change >= 0 ? 'text-[#00FF88] bg-[#00FF88]/10' : 'text-red-400 bg-red-400/10'
                    }`}>
                      {company.change >= 0 ? '+' : ''}{company.changePercent.toFixed(2)}%
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
                          ? 'bg-[#25D366] hover:bg-[#25D366]/90 text-white'
                          : 'bg-white/5 hover:bg-white/10 text-[#B3B3B3]'
                      }`}
                    >
                      WhatsApp {company.whatsappEnabled ? 'On' : 'Off'}
                    </Button>
                    <Button
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
            <div className="text-3xl text-[#FF00FF]">{new Set(companies.map(c => c.sector)).size}</div>
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
              placeholder="Enter ticker symbol (e.g., AAPL)"
              className="mb-6 bg-[#1A1A1A] border-white/5 rounded-2xl h-12"
              onKeyPress={(e) => e.key === 'Enter' && handleAddCompany()}
            />
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
                <p className="text-sm text-[#B3B3B3] mt-1">Select a sector to add all companies from that sector</p>
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
              {Object.keys(sectorCompanies).map((sector) => (
                <button
                  key={sector}
                  onClick={() => handleAddSector(sector)}
                  className="bg-[#1A1A1A] hover:bg-[#222222] border border-white/5 hover:border-[#00FFFF]/30 rounded-2xl p-6 text-left transition-all group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="size-10 rounded-xl bg-gradient-to-br from-[#00FFFF]/20 to-[#00D4FF]/20 flex items-center justify-center">
                      <Briefcase className="size-5 text-[#00FFFF]" />
                    </div>
                    <div className="text-lg group-hover:text-[#00FFFF] transition-colors">{sector}</div>
                  </div>
                  <div className="text-xs text-[#B3B3B3]">
                    {sectorCompanies[sector as keyof typeof sectorCompanies].length} companies
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
