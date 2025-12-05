import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  TrendingUp, 
  Compass, 
  LogOut, 
  User,
  Camera,
  X,
  Star
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import FuturisticBackground from './FuturisticBackground';

export default function ProfilePage() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Your name',
    email: 'yourname@gmail.com',
    mobile: '',
    location: 'India',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = () => {
    // Handle save logic
    alert('Profile updated successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1628] via-[#0F1B3C] to-[#1A2550] text-white">
      <FuturisticBackground />
      
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0D1424]/80 backdrop-blur-xl border-b border-white/10">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3">
              <div className="size-10">
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
              <Link to="/news" className="text-sm text-white/60 hover:text-white transition-colors">
                Market News
              </Link>
              <Link to="/watchlist" className="text-sm text-white/60 hover:text-white transition-colors">
                Watchlist
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => setShowLogoutModal(true)}
              className="text-white/60 hover:text-white hover:bg-gradient-to-r hover:from-[#00FFFF]/10 hover:to-[#00D4FF]/10 transition-all cursor-pointer"
            >
              Logout →
            </Button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 flex pt-20">
        {/* Sidebar */}
        {/* <aside className="fixed left-0 w-64 h-[calc(100vh-5rem)] bg-[#0D1424]/60 backdrop-blur-xl border-r border-white/10 p-6">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="size-12 bg-gradient-to-br from-[#00FFFF] to-[#00D4FF] rounded-xl flex items-center justify-center">
                <TrendingUp className="size-7 text-black" />
              </div>
              <span className="text-2xl tracking-tight">Stoxie</span>
            </div>
          </div>
          
          <nav className="space-y-2">
            <Link to="/">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-colors">
                <Home className="size-5" />
                <span className="text-sm">Home</span>
              </div>
            </Link>
            <Link to="/dashboard">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-colors">
                <TrendingUp className="size-5" />
                <span className="text-sm">Dashboard</span>
              </div>
            </Link>
            <Link to="/news">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-colors">
                <Compass className="size-5" />
                <span className="text-sm">Market News</span>
              </div>
            </Link>
            <Link to="/watchlist">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-colors">
                <Star className="size-5" />
                <span className="text-sm">Watchlist</span>
              </div>
            </Link>
            <Link to="/profile">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#00FFFF]/20 to-[#FF00FF]/20 text-white border border-white/10">
                <User className="size-5" />
                <span className="text-sm">Profile</span>
              </div>
            </Link>
          </nav>
        </aside> */}

        {/* Main Content */}
        <main className="ml-64 flex-1 p-12 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl bg-[#0D1424]/60 backdrop-blur-xl rounded-3xl border border-white/10 p-10"
          >
            <h1 className="text-4xl mb-3">Profile</h1>
            
            <div className="mb-8">
              <h2 className="text-xl mb-2">Manage Your Information</h2>
              <p className="text-sm text-white/60">
                Review and update your profile details to ensure we deliver the best experience possible.
              </p>
            </div>

            {/* Profile Photo */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
              <div className="relative">
                <div className="size-20 rounded-full bg-gradient-to-br from-[#00FFFF]/20 to-[#FF00FF]/20 flex items-center justify-center border-2 border-white/20">
                  <User className="size-10 text-white/60" />
                </div>
                <button className="absolute bottom-0 right-0 size-7 bg-[#00D4FF] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <Camera className="size-4 text-black" />
                </button>
              </div>
              <div>
                <div className="text-sm mb-1">Your name</div>
                <div className="text-xs text-white/40">yourname@gmail.com</div>
              </div>
              <button className="ml-auto size-8 rounded-lg hover:bg-white/5 flex items-center justify-center">
                <X className="size-4 text-white/60" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <div>
                <label className="text-sm text-white/80 mb-2 block">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="your name"
                  className="bg-white/5 border-white/10 rounded-xl h-12 text-white placeholder:text-white/30 focus:border-[#00FFFF]/50"
                />
              </div>

              <div>
                <label className="text-sm text-white/80 mb-2 block">Email account</label>
                <Input
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="bg-white/5 border-white/10 rounded-xl h-12 text-white placeholder:text-white/30 focus:border-[#00FFFF]/50"
                />
              </div>

              <div>
                <label className="text-sm text-white/80 mb-2 block">Mobile number</label>
                <Input
                  value={formData.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  placeholder="Add number"
                  className="bg-white/5 border-white/10 rounded-xl h-12 text-white placeholder:text-white/30 focus:border-[#00FFFF]/50"
                />
              </div>

              <div>
                <label className="text-sm text-white/80 mb-2 block">Location</label>
                <Input
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="India"
                  className="bg-white/5 border-white/10 rounded-xl h-12 text-white placeholder:text-white/30 focus:border-[#00FFFF]/50"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-10">
              <Button
                onClick={handleSaveChanges}
                className="bg-gradient-to-r from-[#00FFFF] to-[#00D4FF] hover:from-[#00D4FF] hover:to-[#00FFFF] text-black rounded-xl h-12 px-8"
              >
                Save Change
              </Button>
            </div>
          </motion.div>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
            >
              <div className="bg-[#111111] border border-[#00FFFF]/30 rounded-3xl p-8 shadow-2xl shadow-[#00FFFF]/20">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="size-16 rounded-full bg-gradient-to-br from-[#00FFFF]/20 to-[#FF00FF]/20 border border-[#00FFFF]/30 flex items-center justify-center">
                    <User className="size-8 text-[#00FFFF]" />
                  </div>
                </div>

                {/* Content */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl mb-3">Logout Confirmation</h2>
                  <p className="text-[#B3B3B3]">
                    Are you sure you want to logout? You'll need to sign in again to access your dashboard.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowLogoutModal(false)}
                    variant="outline"
                    className="flex-1 h-12 rounded-2xl border-white/10 hover:bg-white/5 hover:border-[#00FFFF]/30 transition-all cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Link to="/" className="flex-1">
                    <Button
                      className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#00FFFF] to-[#00D4FF] hover:from-[#00D4FF] hover:to-[#00FFFF] hover:shadow-lg hover:shadow-[#00FFFF]/30 text-black transition-all duration-300 cursor-pointer"
                    >
                      Yes, Logout
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
