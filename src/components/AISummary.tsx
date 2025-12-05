import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Copy, Download, Share2, TrendingUp, Search, User, Sparkles, CheckCircle2, TrendingDown, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import FuturisticBackground from './FuturisticBackground';
import { motion } from "framer-motion";


export default function AISummary() {
  const { id } = useParams();

  const handleCopy = () => {
    // Copy summary to clipboard
    alert('Summary copied to clipboard!');
  };

  const handleDownload = () => {
    // Download summary as PDF
    alert('Downloading summary...');
  };

  const handleShare = () => {
    // Share to WhatsApp
    alert('Opening WhatsApp...');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <FuturisticBackground />
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0D0D0D]/80 backdrop-blur-xl border-b border-white/5">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="size-8 bg-gradient-to-br from-[#00FFFF] to-[#00D4FF] rounded-lg flex items-center justify-center">
                <TrendingUp className="size-5 text-black" />
              </div>
              <span className="tracking-tight">Stoxie</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#B3B3B3]" />
              <Input
                placeholder="Search stocks, news..."
                className="pl-10 bg-[#111111] border-white/5 rounded-2xl h-10 focus:border-[#00FFFF]/50"
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
          <Button variant="ghost" className="mb-6 text-[#B3B3B3] hover:text-white hover:bg-gradient-to-r hover:from-[#00FFFF]/10 hover:to-[#00D4FF]/10 transition-all cursor-pointer">
            <ArrowLeft className="mr-2 size-4" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="size-5 text-[#00FFFF]" />
            <span className="text-sm text-[#B3B3B3]">AI-Powered Summary</span>
          </div>
          <h1 className="text-4xl mb-4">Tech Stocks Surge on AI Optimism</h1>
          <div className="flex items-center gap-4 text-sm text-[#B3B3B3]">
            <span>Financial Times</span>
            <span>•</span>
            <span>November 26, 2025</span>
          </div>
        </motion.div>

        {/* Article Link Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <a 
            href="https://www.example.com/article" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block bg-gradient-to-br from-[#111111] to-[#0D0D0D] rounded-3xl border border-white/10 p-6 hover:border-[#00FFFF]/30 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-gradient-to-br from-[#00FFFF]/20 to-[#00D4FF]/20 flex items-center justify-center">
                  <ExternalLink className="size-6 text-[#00FFFF]" />
                </div>
                <div>
                  <div className="text-lg mb-1 group-hover:text-[#00FFFF] transition-colors">Read Original Article</div>
                  <div className="text-sm text-[#B3B3B3]">View the full story on Financial Times</div>
                </div>
              </div>
              <ArrowLeft className="size-5 text-[#B3B3B3] rotate-180 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>
        </motion.div>

        {/* Single Column Layout - AI Summary */}
        <div className="space-y-6">
          {/* Grid Layout for Cards */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Key Takeaways */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-[#0D0D0D] rounded-3xl border border-white/5 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="size-5 text-[#00FFFF]" />
                <h3 className="text-xl">Key Takeaways</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="size-1.5 rounded-full bg-[#00FFFF] mt-2 shrink-0" />
                  <span className="text-[#B3B3B3]">
                    Tech stocks rallied 2.4% led by AI-focused companies with NVIDIA up 5.2%
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="size-1.5 rounded-full bg-[#00FFFF] mt-2 shrink-0" />
                  <span className="text-[#B3B3B3]">
                    AI market projected to grow from $450B to $1.5T by 2030
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="size-1.5 rounded-full bg-[#00FFFF] mt-2 shrink-0" />
                  <span className="text-[#B3B3B3]">
                    Cloud providers seeing increased demand for AI-powered services
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="size-1.5 rounded-full bg-[#00FFFF] mt-2 shrink-0" />
                  <span className="text-[#B3B3B3]">
                    Some analysts caution about stretched valuations in AI sector
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="size-1.5 rounded-full bg-[#00FFFF] mt-2 shrink-0" />
                  <span className="text-[#B3B3B3]">
                    Record options trading volume indicates strong investor conviction
                  </span>
                </li>
              </ul>
            </motion.div>

            {/* Market Impact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-[#0D0D0D] rounded-3xl border border-white/5 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="size-5 text-[#00D4FF]" />
                <h3 className="text-xl">Market Impact</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="size-8 rounded-xl bg-[#00FFFF]/10 flex items-center justify-center shrink-0">
                    <TrendingUp className="size-4 text-[#00FFFF]" />
                  </div>
                  <div>
                    <div className="mb-1">Affected Sectors</div>
                    <div className="text-sm text-[#B3B3B3]">Technology, Cloud Computing, Semiconductors</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="size-8 rounded-xl bg-[#00FF88]/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="size-4 text-[#00FF88]" />
                  </div>
                  <div>
                    <div className="mb-1">Key Winners</div>
                    <div className="text-sm text-[#B3B3B3]">NVIDIA (+5.2%), Microsoft (+3%), Alphabet (+3%)</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="size-8 rounded-xl bg-[#A855F7]/10 flex items-center justify-center shrink-0">
                    <AlertCircle className="size-4 text-[#A855F7]" />
                  </div>
                  <div>
                    <div className="mb-1">Risk Level</div>
                    <div className="text-sm text-[#B3B3B3]">Moderate - Some analysts warn of high valuations</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Suggested Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-gradient-to-br from-[#00FFFF]/10 to-[#00D4FF]/10 rounded-3xl border border-[#00FFFF]/20 p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="size-5 text-[#00FFFF]" />
              <h3 className="text-xl">Suggested Actions</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="size-6 rounded-lg bg-gradient-to-br from-[#00FFFF] to-[#00D4FF] flex items-center justify-center text-xs text-black shrink-0">
                  1
                </div>
                <span className="text-[#B3B3B3]">
                  Consider adding AI-focused tech stocks to watchlist for monitoring
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="size-6 rounded-lg bg-gradient-to-br from-[#00FFFF] to-[#00D4FF] flex items-center justify-center text-xs text-black shrink-0">
                  2
                </div>
                <span className="text-[#B3B3B3]">
                  Watch upcoming earnings reports from major tech companies
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="size-6 rounded-lg bg-gradient-to-br from-[#00FFFF] to-[#00D4FF] flex items-center justify-center text-xs text-black shrink-0">
                  3
                </div>
                <span className="text-[#B3B3B3]">
                  Be mindful of valuation risks; consider dollar-cost averaging
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="size-6 rounded-lg bg-gradient-to-br from-[#00FFFF] to-[#00D4FF] flex items-center justify-center text-xs text-black shrink-0">
                  4
                </div>
                <span className="text-[#B3B3B3]">
                  Diversify across cloud providers and semiconductor companies
                </span>
              </li>
            </ul>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-[#0D0D0D] rounded-3xl border border-white/5 p-6"
          >
            <h3 className="text-lg mb-4">Share Summary</h3>
            <div className="grid grid-cols-3 gap-3">
              <Button 
                onClick={handleCopy}
                variant="outline" 
                className="border-white/10 hover:bg-white/5 hover:border-[#00FFFF]/30 rounded-2xl"
              >
                <Copy className="mr-2 size-4" />
                Copy
              </Button>
              <Button 
                onClick={handleDownload}
                variant="outline" 
                className="border-white/10 hover:bg-white/5 hover:border-[#00FFFF]/30 rounded-2xl"
              >
                <Download className="mr-2 size-4" />
                Download
              </Button>
              <Button 
                onClick={handleShare}
                className="bg-[#25D366] hover:bg-[#25D366]/90 rounded-2xl"
              >
                <Share2 className="mr-2 size-4" />
                WhatsApp
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
