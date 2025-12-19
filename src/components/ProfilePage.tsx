
// src/components/ProfilePage.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { LogOut, User, Camera, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import FuturisticBackground from "./FuturisticBackground";

import { getMyProfile, updateMyProfile } from "../api/profile";
import { clearAuthToken } from "../api/auth";

export default function ProfilePage() {
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // ✅ controls the profile info card visibility
  const [showProfileCard, setShowProfileCard] = useState(true);

  // UI form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    location: "India", // UI-only (not in backend)
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Load profile on mount
  useEffect(() => {
    async function load() {
      setError(null);
      setSuccessMsg(null);
      setLoading(true);
      try {
        const p = await getMyProfile();
        setFormData({
          name: p.display_name ?? "",
          email: p.email ?? "",
          mobile: p.phone_number ?? "",
          location: "India",
        });
      } catch (err: any) {
        const msg =
          err?.response?.data?.detail || "Failed to load profile (are you logged in?)";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSaveChanges = async () => {
    setError(null);
    setSuccessMsg(null);

    if (!formData.name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!formData.mobile.trim()) {
      setError("Mobile number is required.");
      return;
    }

    setSaving(true);
    try {
      const updated = await updateMyProfile({
        display_name: formData.name.trim(),
        email: formData.email.trim(),
        phone_number: formData.mobile.trim(),
      });

      // reflect latest data
      setFormData((prev) => ({
        ...prev,
        name: updated.display_name ?? prev.name,
        email: updated.email ?? prev.email,
        mobile: updated.phone_number ?? prev.mobile,
      }));

      // ✅ show success + hide the profile card
      setSuccessMsg("Profile updated successfully!");
      setShowProfileCard(false);
    } catch (err: any) {
      const msg = err?.response?.data?.detail || "Failed to update profile";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    clearAuthToken();
    setShowLogoutModal(false);
    navigate("/");
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
              <Link
                to="/dashboard"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Link to="/news" className="text-sm text-white/60 hover:text-white transition-colors">
                Market News
              </Link>
              <Link
                to="/watchlist"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
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
        <main className="flex-1 p-12 flex items-center justify-center">
          <div className="w-full max-w-2xl">
            {/* ✅ Success message (shows after save + when card closes) */}
            <AnimatePresence>
              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-6 text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl px-4 py-3 flex items-center justify-between"
                >
                  <span>{successMsg}</span>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => navigate("/dashboard")}
                      className="h-9 rounded-xl border-white/10 hover:bg-white/5"
                    >
                      Go to Dashboard
                    </Button>

                    <button
                      type="button"
                      onClick={() => setSuccessMsg(null)}
                      className="size-9 rounded-xl hover:bg-white/5 flex items-center justify-center"
                      aria-label="Close success message"
                    >
                      <X className="size-4 text-white/70" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ✅ Profile Card: hide it after successful save */}
            <AnimatePresence>
              {showProfileCard && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.35 }}
                  className="w-full bg-[#0D1424]/60 backdrop-blur-xl rounded-3xl border border-white/10 p-10"
                >
                  <h1 className="text-4xl mb-3">Profile</h1>

                  <div className="mb-6">
                    <h2 className="text-xl mb-2">Manage Your Information</h2>
                    <p className="text-sm text-white/60">Review and update your profile details.</p>
                  </div>

                  {error && (
                    <div className="mb-5 text-sm text-red-400 bg-red-500/10 border border-red-500/40 rounded-2xl px-4 py-2">
                      {error}
                    </div>
                  )}

                  {loading ? (
                    <div className="text-sm text-white/60">Loading profile...</div>
                  ) : (
                    <>
                      {/* Profile Photo */}
                      <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
                        <div className="relative">
                          <div className="size-20 rounded-full bg-gradient-to-br from-[#00FFFF]/20 to-[#FF00FF]/20 flex items-center justify-center border-2 border-white/20">
                            <User className="size-10 text-white/60" />
                          </div>
                          <button
                            type="button"
                            className="absolute bottom-0 right-0 size-7 bg-[#00D4FF] rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                          >
                            <Camera className="size-4 text-black" />
                          </button>
                        </div>

                        <div>
                          <div className="text-sm mb-1">{formData.name || "—"}</div>
                          <div className="text-xs text-white/40">{formData.email || "—"}</div>
                        </div>

                        {/* ✅ Top X: go to dashboard (your requirement) */}
                        <button
                          type="button"
                          onClick={() => navigate("/dashboard")}
                          className="ml-auto size-8 rounded-lg hover:bg-white/5 flex items-center justify-center"
                          aria-label="Close profile and go to dashboard"
                        >
                          <X className="size-4 text-white/60" />
                        </button>
                      </div>

                      {/* Form Fields */}
                      <div className="space-y-6">
                        <div>
                          <label className="text-sm text-white/80 mb-2 block">Name</label>
                          <Input
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            placeholder="Your name"
                            className="bg-white/5 border-white/10 rounded-xl h-12 text-white placeholder:text-white/30 focus:border-[#00FFFF]/50"
                          />
                        </div>

                        <div>
                          <label className="text-sm text-white/80 mb-2 block">Email account</label>
                          <Input
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            placeholder="yourname@gmail.com"
                            className="bg-white/5 border-white/10 rounded-xl h-12 text-white placeholder:text-white/30 focus:border-[#00FFFF]/50"
                          />
                        </div>

                        <div>
                          <label className="text-sm text-white/80 mb-2 block">Mobile number</label>
                          <Input
                            value={formData.mobile}
                            onChange={(e) => handleInputChange("mobile", e.target.value)}
                            placeholder="+91xxxxxxxxxx"
                            className="bg-white/5 border-white/10 rounded-xl h-12 text-white placeholder:text-white/30 focus:border-[#00FFFF]/50"
                          />
                        </div>

                        <div>
                          <label className="text-sm text-white/80 mb-2 block">Location</label>
                          <Input
                            value={formData.location}
                            onChange={(e) => handleInputChange("location", e.target.value)}
                            placeholder="India"
                            className="bg-white/5 border-white/10 rounded-xl h-12 text-white placeholder:text-white/30 focus:border-[#00FFFF]/50"
                          />
                        </div>
                      </div>

                      {/* Save Button */}
                      <div className="mt-10">
                        <Button
                          onClick={handleSaveChanges}
                          disabled={saving}
                          className="bg-gradient-to-r from-[#00FFFF] to-[#00D4FF] hover:from-[#00D4FF] hover:to-[#00FFFF] text-black rounded-xl h-12 px-8 disabled:opacity-60"
                        >
                          {saving ? "Saving..." : "Save Change"}
                        </Button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ✅ If card is closed and no success message, show a simple fallback */}
            {!showProfileCard && !successMsg && (
              <div className="text-center text-white/70">
                <Button
                  onClick={() => setShowProfileCard(true)}
                  className="bg-white/10 hover:bg-white/15 rounded-xl"
                >
                  Edit Profile Again
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
            >
              <div className="bg-[#111111] border border-[#00FFFF]/30 rounded-3xl p-8 shadow-2xl shadow-[#00FFFF]/20">
                <div className="flex justify-center mb-6">
                  <div className="size-16 rounded-full bg-gradient-to-br from-[#00FFFF]/20 to-[#FF00FF]/20 border border-[#00FFFF]/30 flex items-center justify-center">
                    <LogOut className="size-7 text-[#00FFFF]" />
                  </div>
                </div>

                <div className="text-center mb-8">
                  <h2 className="text-2xl mb-3">Logout Confirmation</h2>
                  <p className="text-[#B3B3B3]">Are you sure you want to logout?</p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowLogoutModal(false)}
                    variant="outline"
                    className="flex-1 h-12 rounded-2xl border-white/10 hover:bg-white/5 hover:border-[#00FFFF]/30"
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={handleLogout}
                    className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-[#00FFFF] to-[#00D4FF] text-black"
                  >
                    Yes, Logout
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
