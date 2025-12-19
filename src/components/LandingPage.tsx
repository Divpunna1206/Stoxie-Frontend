import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, TrendingUp, Newspaper, Globe, Sparkles, BarChart3, Shield, Zap, MessageCircle, BrainCircuit, Users, Clock } from 'lucide-react';
import { Button } from './ui/button';
import FuturisticBackground from './FuturisticBackground';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <FuturisticBackground />
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-10 flex items-center justify-center">
               <img src="/stoxie-logo.png" alt="Stoxie Logo" className="size-10" />
            </div>
            <span className="text-xl tracking-tight font-bold">Stoxie</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm text-[#B3B3B3] hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-[#B3B3B3] hover:text-white transition-colors">How It Works</a>
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-sm hover:bg-gradient-to-r hover:from-[#00FFFF]/10 hover:to-[#00D4FF]/10 transition-all cursor-pointer">Login</Button>
            </Link>
            <Link to="/login">
              <Button size="sm" className="bg-gradient-to-r from-[#00FFFF] to-[#00D4FF] hover:from-[#00D4FF] hover:to-[#00FFFF] hover:shadow-lg hover:shadow-[#00FFFF]/30 text-black rounded-2xl transition-all duration-300 cursor-pointer">
                Claim Free Access
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FF00FF]/20 to-[#00FFFF]/20 border border-[#00FFFF]/30"
            >
              <Clock className="size-4 text-[#00FFFF]" />
              <span className="text-sm text-white">🔥 Limited to First 10,000 Users - 7,000 Spots Left!</span>
            </motion.div>
            
            <h1 className="text-6xl leading-[1.1] tracking-tight">
              AI Stock Insights
              <br />
              <span className="bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] bg-clip-text text-transparent">Delivered</span> to WhatsApp
            </h1>
            
            <p className="text-lg text-[#B3B3B3] max-w-md">
              Get AI-powered stock summaries, real-time sentiment analysis, and market insights sent directly to your WhatsApp. Completely free for the first 10,000 users.
            </p>
            
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button className="bg-gradient-to-r from-[#00FFFF] to-[#00D4FF] hover:from-[#00D4FF] hover:to-[#00FFFF] hover:shadow-lg hover:shadow-[#00FFFF]/30 text-black rounded-2xl px-8 h-12 transition-all duration-300 cursor-pointer">
                  Claim Your Free Spot Now
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Button variant="outline" className="border-white/10 hover:bg-white/5 hover:border-[#00FFFF]/30 rounded-2xl px-8 h-12 transition-all cursor-pointer">
                <MessageCircle className="mr-2 size-4" />
                See WhatsApp Demo
              </Button>
            </div>
            
            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-2xl text-[#00FF88]">3,000</div>
                <div className="text-sm text-[#B3B3B3]">Already Registered</div>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div>
                <div className="text-2xl text-[#FF00FF]">7,000</div>
                <div className="text-sm text-[#B3B3B3]">Spots Remaining</div>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div>
                <div className="text-2xl text-[#00FFFF]">100%</div>
                <div className="text-sm text-[#B3B3B3]">Free Now</div>
              </div>
            </div>
          </motion.div>

          {/* Right - How It Works */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#00FFFF]/20 via-transparent to-[#FF00FF]/20 blur-3xl" />
            <div className="relative bg-gradient-to-br from-[#0D0D0D] to-[#111111] rounded-3xl p-8 border border-white/10 shadow-2xl shadow-[#00FFFF]/10">
              <h3 className="text-2xl mb-6 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] bg-clip-text text-transparent">
                How Stoxie Works
              </h3>
              
              <div className="space-y-6">
                {/* Step 1 */}
                <motion.div 
                  className="flex gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex-shrink-0 size-10 rounded-xl bg-gradient-to-br from-[#00FFFF] to-[#00D4FF] flex items-center justify-center text-black">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm mb-1">Create Your Watchlist</h4>
                    <p className="text-xs text-[#B3B3B3]">
                      Add stocks you want to track. Monitor real-time market movements and news.
                    </p>
                  </div>
                </motion.div>

                {/* Step 2 */}
                <motion.div 
                  className="flex gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex-shrink-0 size-10 rounded-xl bg-gradient-to-br from-[#A855F7] to-[#FF00FF] flex items-center justify-center text-black">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm mb-1">AI Analyzes Everything</h4>
                    <p className="text-xs text-[#B3B3B3]">
                      Our AI reads news, analyzes sentiment, and generates comprehensive summaries.
                    </p>
                  </div>
                </motion.div>

                {/* Step 3 */}
                <motion.div 
                  className="flex gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex-shrink-0 size-10 rounded-xl bg-gradient-to-br from-[#00FF88] to-[#00FFFF] flex items-center justify-center text-black">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm mb-1">Receive on WhatsApp</h4>
                    <p className="text-xs text-[#B3B3B3]">
                      Get instant AI summaries and alerts sent directly to your WhatsApp. Stay informed anywhere.
                    </p>
                  </div>
                </motion.div>

                {/* Visual Separator */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-6" />

                {/* Key Features List */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-xs text-[#B3B3B3]">
                    <div className="size-1.5 rounded-full bg-[#00FFFF]" />
                    Real-time alerts
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#B3B3B3]">
                    <div className="size-1.5 rounded-full bg-[#FF00FF]" />
                    Sentiment scores
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#B3B3B3]">
                    <div className="size-1.5 rounded-full bg-[#00FF88]" />
                    AI summaries
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#B3B3B3]">
                    <div className="size-1.5 rounded-full bg-[#FFD700]" />
                    Market insights
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-4">
                  <div className="bg-gradient-to-r from-[#00FFFF]/10 to-[#FF00FF]/10 border border-[#00FFFF]/20 rounded-2xl p-4 text-center">
                    <div className="text-xs text-[#B3B3B3] mb-1">100% Free • No Credit Card</div>
                    <div className="text-sm">Join 3,000+ Smart Investors</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">Everything you need to trade smarter</h2>
            <p className="text-[#B3B3B3]">Powerful features designed for modern investors</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 - WhatsApp Integration */}
            <div className="bg-[#0D0D0D] rounded-3xl p-8 border border-white/5 hover:border-[#00FFFF]/30 transition-all group">
              <div className="size-12 rounded-2xl bg-[#00FFFF]/10 flex items-center justify-center mb-6 group-hover:bg-[#00FFFF]/20 transition-colors">
                <MessageCircle className="size-6 text-[#00FFFF]" />
              </div>
              <h3 className="text-xl mb-3">WhatsApp Delivery</h3>
              <p className="text-[#B3B3B3]">
                Receive AI-generated stock summaries and market alerts directly to your WhatsApp instantly.
              </p>
            </div>

            {/* Feature 2 - Sentiment Analysis */}
            <div className="bg-[#0D0D0D] rounded-3xl p-8 border border-white/5 hover:border-[#FF00FF]/30 transition-all group">
              <div className="size-12 rounded-2xl bg-[#FF00FF]/10 flex items-center justify-center mb-6 group-hover:bg-[#FF00FF]/20 transition-colors">
                <BrainCircuit className="size-6 text-[#FF00FF]" />
              </div>
              <h3 className="text-xl mb-3">Sentiment Analysis</h3>
              <p className="text-[#B3B3B3]">
                Advanced AI analyzes news sentiment to give you real-time market mood indicators with accuracy scores.
              </p>
            </div>

            {/* Feature 3 - AI Summaries */}
            <div className="bg-[#0D0D0D] rounded-3xl p-8 border border-white/5 hover:border-[#00FF88]/30 transition-all group">
              <div className="size-12 rounded-2xl bg-[#00FF88]/10 flex items-center justify-center mb-6 group-hover:bg-[#00FF88]/20 transition-colors">
                <Sparkles className="size-6 text-[#00FF88]" />
              </div>
              <h3 className="text-xl mb-3">AI Stock Summaries</h3>
              <p className="text-[#B3B3B3]">
                Get instant AI-powered summaries of any stock, news article, or market trend in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3">
              <MessageCircle className="size-8 text-[#00FFFF]" />
              <h3 className="text-lg">WhatsApp Integration</h3>
              <p className="text-sm text-[#B3B3B3]">Get summaries sent directly to WhatsApp</p>
            </div>
            <div className="space-y-3">
              <BrainCircuit className="size-8 text-[#FF00FF]" />
              <h3 className="text-lg">Sentiment Tracking</h3>
              <p className="text-sm text-[#B3B3B3]">Real-time market mood analysis</p>
            </div>
            <div className="space-y-3">
              <Zap className="size-8 text-[#A855F7]" />
              <h3 className="text-lg">Instant Alerts</h3>
              <p className="text-sm text-[#B3B3B3]">Real-time notifications on market moves</p>
            </div>
            <div className="space-y-3">
              <Sparkles className="size-8 text-[#00FF88]" />
              <h3 className="text-lg">AI-Powered</h3>
              <p className="text-sm text-[#B3B3B3]">Smart summaries and predictions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Free Now Section */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#00FF88]/20 to-[#00FFFF]/20 border border-[#00FF88]/30 mb-6"
            >
              <Users className="size-4 text-[#00FF88]" />
              <span className="text-sm text-white">Limited Offer - First 10,000 Users Only</span>
            </motion.div>
            <h2 className="text-4xl mb-4">100% Free Now</h2>
            <p className="text-[#B3B3B3]">No credit card required. No hidden fees. Just pure value.</p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Main Free Plan Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative bg-gradient-to-br from-[#0D0D0D] to-[#111111] rounded-3xl p-12 border-2 border-[#00FFFF] overflow-hidden"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00FFFF]/10 via-transparent to-[#FF00FF]/10" />
              
              <div className="relative z-10 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="text-sm text-[#B3B3B3] mb-2">Stoxie Free Now</div>
                    <div className="text-6xl mb-2">
                      <span className="bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] bg-clip-text text-transparent">$0</span>
                    </div>
                    <div className="text-sm text-[#B3B3B3]">For the first 10,000 users</div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl text-[#00FF88] mb-1">3,000</div>
                    <div className="text-xs text-[#B3B3B3] mb-2">Registered</div>
                    <div className="text-3xl text-[#FF00FF]">7,000</div>
                    <div className="text-xs text-[#B3B3B3]">Spots Left</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h4 className="text-sm mb-4 text-[#00FFFF]">Core Features</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-sm">
                        <div className="size-5 rounded-full bg-[#00FF88]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="size-2 rounded-full bg-[#00FF88]" />
                        </div>
                        <span>Unlimited AI stock summaries</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm">
                        <div className="size-5 rounded-full bg-[#00FF88]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="size-2 rounded-full bg-[#00FF88]" />
                        </div>
                        <span>WhatsApp delivery of summaries</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm">
                        <div className="size-5 rounded-full bg-[#00FF88]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="size-2 rounded-full bg-[#00FF88]" />
                        </div>
                        <span>Real-time sentiment analysis</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm">
                        <div className="size-5 rounded-full bg-[#00FF88]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="size-2 rounded-full bg-[#00FF88]" />
                        </div>
                        <span>Unlimited watchlists</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm mb-4 text-[#FF00FF]">Advanced Features</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-sm">
                        <div className="size-5 rounded-full bg-[#00FFFF]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="size-2 rounded-full bg-[#00FFFF]" />
                        </div>
                        <span>Real-time market data feeds</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm">
                        <div className="size-5 rounded-full bg-[#00FFFF]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="size-2 rounded-full bg-[#00FFFF]" />
                        </div>
                        <span>Global market coverage (US & India)</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm">
                        <div className="size-5 rounded-full bg-[#00FFFF]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="size-2 rounded-full bg-[#00FFFF]" />
                        </div>
                        <span>News feed with AI filtering</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm">
                        <div className="size-5 rounded-full bg-[#00FFFF]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="size-2 rounded-full bg-[#00FFFF]" />
                        </div>
                        <span>Instant alerts and notifications</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-[#1A1A1A] rounded-2xl p-6 mb-8">
                  <div className="flex items-center gap-3 mb-3">
                    <MessageCircle className="size-5 text-[#00FFFF]" />
                    <h4 className="text-sm">WhatsApp Integration Highlights</h4>
                  </div>
                  <ul className="grid md:grid-cols-2 gap-3 text-xs text-[#B3B3B3]">
                    <li className="flex items-center gap-2">
                      <div className="size-1 rounded-full bg-[#00FFFF]" />
                      Instant summary delivery
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="size-1 rounded-full bg-[#00FFFF]" />
                      Price alerts on WhatsApp
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="size-1 rounded-full bg-[#00FFFF]" />
                      Sentiment updates
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="size-1 rounded-full bg-[#00FFFF]" />
                      Daily market briefs
                    </li>
                  </ul>
                </div>
                 
                <div className="text-center flex justify-center">
                <Link to="/login">
                  <Button className="w-40  bg-gradient-to-r from-[#00FFFF] to-[#00D4FF] hover:from-[#00D4FF] hover:to-[#00FFFF] text-black rounded-2xl h-14 text-base">
                    Claim Your Free Spot Now ({7000} Remaining)
                    <ArrowRight className="ml-2 size-5" />
                  </Button>
                </Link>
                </div> 
                <div className="text-center mt-4 text-xs text-[#B3B3B3]">
                  ✓ No credit card required  •  ✓ Free now for first 10K users  •  ✓ Cancel anytime
                </div>
              </div>

              {/* Animated corner accents */}
              <div className="absolute top-0 right-0 size-32 bg-gradient-to-br from-[#00FFFF]/20 to-transparent blur-2xl" />
              <div className="absolute bottom-0 left-0 size-32 bg-gradient-to-tr from-[#FF00FF]/20 to-transparent blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="size-6 flex items-center justify-center">
               <img src="/stoxie-logo.png" alt="Stoxie Logo" className="size-6" />
              </div>
              <span className="tracking-tight">Stoxie</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-[#B3B3B3] hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-sm text-[#B3B3B3] hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-sm text-[#B3B3B3] hover:text-white transition-colors">Support</a>
            </div>
            <div className="text-sm text-[#B3B3B3]">
              © 2025 Stoxie. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
