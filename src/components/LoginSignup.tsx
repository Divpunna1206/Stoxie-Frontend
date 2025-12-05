// src/components/ui/LoginSignup.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Shield,
  Zap,
  Phone,
  ArrowRight,
  Check,
  User,
  Mail,
} from "lucide-react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import FuturisticBackground from "./FuturisticBackground";

import {
  signupUser,
  loginWithPhoneOtp,
  loginWithGoogleIdToken,
} from "../api/auth";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

type AuthMode = "login" | "signup";
type LoginStep = "phone" | "otp";

/**
 * Normalize a phone number into E.164 format.
 * - If it already starts with "+", we just trim and return it.
 * - If it looks like 91xxxxxxxxxx (12 digits) -> +91xxxxxxxxxx
 * - If it is a 10-digit Indian mobile number -> +91xxxxxxxxxx
 * - Otherwise we just prefix "+" to whatever digits we have.
 */
function normalizePhoneToE164(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;

  // If user already typed +91.... just return it
  if (trimmed.startsWith("+")) {
    return trimmed;
  }

  // Strip non-digits
  const digits = trimmed.replace(/\D/g, "");

  // 12 digits starting with 91 -> assume already includes country code
  if (digits.length === 12 && digits.startsWith("91")) {
    return "+" + digits;
  }

  // 10-digit Indian mobile -> assume +91
  if (digits.length === 10) {
    return "+91" + digits;
  }

  // Fallback: just prefix "+"
  return "+" + digits;
}

export default function LoginSignup() {
  const navigate = useNavigate();

  const [mode, setMode] = useState<AuthMode>("login");
  const [step, setStep] = useState<LoginStep>("phone");

  // shared phone state (used in both login + signup)
  const [phoneNumber, setPhoneNumber] = useState("");

  // OTP state (login)
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(0);

  // signup state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  // common UI state
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingSignup, setLoadingSignup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // --- LOGIN (PHONE + OTP) HANDLERS ---

  const startOtpStep = () => {
    setStep("otp");
    setOtp(["", "", "", "", "", ""]);
    setCountdown(30);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!phoneNumber) {
      setError("Please enter your phone number.");
      return;
    }

    if (!agreedToTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    const normalizedPhone = normalizePhoneToE164(phoneNumber);
    setPhoneNumber(normalizedPhone); // show +91... in UI

    // DEV ONLY: no Firebase SMS, just simulate OTP send
    console.log("[LOGIN] DEV MODE - Sending OTP to:", normalizedPhone);
    console.log("[LOGIN] Use OTP 123456 for testing.");

    startOtpStep();
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleResendOTP = () => {
    setError(null);

    if (!phoneNumber) {
      setError("Please enter your phone number again.");
      setStep("phone");
      return;
    }

    console.log("[LOGIN] DEV MODE - Resending OTP to:", phoneNumber);
    console.log("[LOGIN] Use OTP 123456 for testing.");

    startOtpStep();
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setLoadingLogin(true);

    try {
      // DEV NOTE: backend will validate OTP (e.g. "123456")
      const res = await loginWithPhoneOtp({
        phoneNumber,
        otp: otpValue,
      });

      console.log("[LOGIN] Backend login success:", res);
      // token already stored in loginWithPhoneOtp
      navigate("/dashboard");
    } catch (err: any) {
      console.error("[LOGIN] /login error:", err);
      const detail =
        err?.response?.data?.detail ||
        err?.message ||
        "Login failed. Please try again.";
      setError(detail);
    } finally {
      setLoadingLogin(false);
    }
  };

  // --- SIGNUP HANDLER ---

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!fullName || !email || !phoneNumber) {
      setError("Please fill in Name, Email and Mobile.");
      return;
    }

    console.log("[SIGNUP] Raw form values:", {
      fullName,
      email,
      phoneNumber,
    });

    const normalizedPhone = normalizePhoneToE164(phoneNumber);
    console.log("[SIGNUP] Normalized phone:", normalizedPhone);

    setLoadingSignup(true);

    try {
      const res = await signupUser({
        name: fullName,
        email,
        phone: normalizedPhone,
      });

      console.log("[SIGNUP] Success:", res);
      setSuccess(
        "Signup successful! You can now log in using your phone number and OTP."
      );

      setMode("login");
      setStep("phone");
      setPhoneNumber(normalizedPhone);
    } catch (err: any) {
      console.error("[SIGNUP] Error object:", err);
      console.error("[SIGNUP] Error response data:", err?.response?.data);

      const detail =
        err?.response?.data?.detail ||
        err?.message ||
        "Signup failed. Please try again.";
      setError(detail);
    } finally {
      setLoadingSignup(false);
    }
  };

  // --- GOOGLE LOGIN HANDLER ---

  const handleGoogleLogin = async () => {
    setError(null);
    setSuccess(null);
    setLoadingLogin(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      console.log("[GOOGLE LOGIN] Firebase user:", user.uid);

      // Send token to backend /verify-token (not /login)
      await loginWithGoogleIdToken(idToken);

      navigate("/dashboard");
    } catch (err: any) {
      console.error("[GOOGLE LOGIN] Error:", err);
      const msg =
        err?.message || "Google login failed. Please try again later.";
      setError(msg);
    } finally {
      setLoadingLogin(false);
    }
  };

  // --- UI ---

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-hidden">
      <FuturisticBackground />

      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0D0D0D]/80 backdrop-blur-xl border-b border-white/5">
        <div className="px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            {/* Modern logo container */}
            <div className="relative flex items-center justify-center">
              <div
                className="absolute -inset-1 rounded-2xl bg-[radial-gradient(circle_at_0_0,#00ffff55,transparent_60%),radial-gradient(circle_at_100%_100%,#22c55e44,transparent_60%)] blur-md opacity-80"
                aria-hidden="true"
              />
              <div className="relative size-10 rounded-2xl flex items-center justify-center border border-white/10 shadow-[0_0_25px_rgba(34,211,238,0.6)]">
                <div className="absolute opacity-80" />
                <img
                  src="/favicon.png"
                  alt="Stoxie Logo"
                  className="relative size-6 drop-shadow-[0_0_10px_rgba(34,211,238,0.9)]"
                />
              </div>
            </div>
            <span className="text-xl tracking-tight ml-1">Stoxie</span>
          </Link>
          <Link
            to="/"
            className="text-sm text-[#B3B3B3] hover:text-white transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden md:block"
          >
            <div className="space-y-8">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#00FFFF]/20 to-[#00D4FF]/20 border border-[#00FFFF]/30 mb-6"
                >
                  <Sparkles className="size-4 text-[#00FFFF]" />
                  <span className="text-sm text-[#00FFFF]">
                    Free Now for First 10,000 Users
                  </span>
                </motion.div>

                <h1 className="text-6xl mb-6 bg-gradient-to-r from-white via-[#00FFFF] to-[#00D4FF] bg-clip-text text-transparent">
                  Welcome to Stoxie
                </h1>
                <p className="text-xl text-[#B3B3B3] leading-relaxed">
                  Your AI-powered stock market companion. Get real-time
                  sentiment analysis, WhatsApp alerts, and market insights.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-[#111111] to-[#0D0D0D] border border-white/5"
                >
                  <div className="size-12 rounded-xl bg-gradient-to-br from-[#00FFFF]/20 to-[#00D4FF]/20 flex items-center justify-center flex-shrink-0">
                    <Zap className="size-6 text-[#00FFFF]" />
                  </div>
                  <div>
                    <h3 className="text-lg mb-1">Real-time Updates</h3>
                    <p className="text-sm text-[#B3B3B3]">
                      Get instant market updates and news delivered to your
                      WhatsApp
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-[#111111] to-[#0D0D0D] border border-white/5"
                >
                  <div className="size-12 rounded-xl bg-gradient-to-br from-[#A855F7]/20 to-[#FF00FF]/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="size-6 text-[#A855F7]" />
                  </div>
                  <div>
                    <h3 className="text-lg mb-1">AI-Powered Analysis</h3>
                    <p className="text-sm text-[#B3B3B3]">
                      Advanced sentiment analysis to help you make informed
                      decisions
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-[#111111] to-[#0D0D0D] border border-white/5"
                >
                  <div className="size-12 rounded-xl bg-gradient-to-br from-[#00FF88]/20 to-[#00FF88]/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="size-6 text-[#00FF88]" />
                  </div>
                  <div>
                    <h3 className="text-lg mb-1">Secure & Private</h3>
                    <p className="text-sm text-[#B3B3B3]">
                      Your data is encrypted and protected with industry
                      standards
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Auth Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-br from-[#111111] to-[#0D0D0D] rounded-3xl border border-white/10 p-8 shadow-2xl">
              {/* Toggle buttons */}
              <div className="flex mb-6 bg-black/40 rounded-full p-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setStep("phone");
                    setError(null);
                    setSuccess(null);
                  }}
                  className={`flex-1 py-2 text-sm rounded-full transition-all ${
                    mode === "login"
                      ? "bg-gradient-to-r from-[#00FFFF] to-[#00D4FF] text-black shadow-lg shadow-[#00FFFF]/30"
                      : "text-[#B3B3B3] hover:text-white"
                  }`}
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setError(null);
                    setSuccess(null);
                  }}
                  className={`flex-1 py-2 text-sm rounded-full transition-all ${
                    mode === "signup"
                      ? "bg-gradient-to-r from-[#00FFFF] to-[#00D4FF] text-black shadow-lg shadow-[#00FFFF]/30"
                      : "text-[#B3B3B3] hover:text-white"
                  }`}
                >
                  Sign up
                </button>
              </div>

              {error && (
                <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/40 rounded-2xl px-4 py-2">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/40 rounded-2xl px-4 py-2">
                  {success}
                </div>
              )}

              <AnimatePresence mode="wait">
                {/* LOGIN (phone + OTP) */}
                {mode === "login" ? (
                  <AnimatePresence mode="wait" key="login-mode">
                    {step === "phone" ? (
                      <motion.form
                        key="phone-step"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.25 }}
                        onSubmit={handleSendOTP}
                        className="space-y-6"
                      >
                        <div>
                          <h2 className="text-3xl mb-2">Welcome to Stoxie</h2>
                          <p className="text-sm text-[#B3B3B3]">
                            Enter your mobile number to receive an OTP.
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm text-[#B3B3B3] mb-2">
                            Mobile Number
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#B3B3B3]" />
                            <Input
                              type="tel"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              placeholder="+91 98765 43210"
                              className="pl-12 bg-[#1A1A1A] border-white/5 rounded-2xl h-14 focus:border-[#00FFFF]/50"
                              required
                            />
                          </div>
                          <p className="text-xs text-[#B3B3B3] mt-2">
                            We'll send you a one-time password via SMS (dev:
                            use 123456).
                          </p>
                        </div>

                        <label className="flex items-start gap-3 cursor-pointer group">
                          <div className="relative flex items-center justify-center mt-0.5">
                            <input
                              type="checkbox"
                              checked={agreedToTerms}
                              onChange={(e) =>
                                setAgreedToTerms(e.target.checked)
                              }
                              className="size-5 rounded-lg border-2 border-white/20 bg-[#1A1A1A] appearance-none cursor-pointer checked:bg-gradient-to-br checked:from-[#00FFFF] checked:to-[#00D4FF] checked:border-[#00FFFF] transition-all"
                            />
                            {agreedToTerms && (
                              <Check className="size-3 text-black absolute pointer-events-none" />
                            )}
                          </div>
                          <span className="text-sm text-[#B3B3B3] leading-relaxed group-hover:text-white transition-colors">
                            I agree to Stoxie's{" "}
                            <button
                              type="button"
                              className="text-[#00FFFF] hover:underline"
                            >
                              Terms of Service
                            </button>{" "}
                            and{" "}
                            <button
                              type="button"
                              className="text-[#00FFFF] hover:underline"
                            >
                              Privacy Policy
                            </button>
                          </span>
                        </label>

                        <Button
                          type="submit"
                          disabled={!agreedToTerms || loadingLogin}
                          className="w-full bg-gradient-to-r from-[#00FFFF] to-[#00D4FF] hover:from-[#00D4FF] hover:to-[#00FFFF] hover:shadow-lg hover:shadow-[#00FFFF]/30 text-black rounded-2xl h-14 text-base group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loadingLogin ? "Sending OTP..." : "Send OTP"}
                          <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
                        </Button>

                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10" />
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-[#111111] text-[#B3B3B3]">
                              Or continue with
                            </span>
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleGoogleLogin}
                          className="w-full h-12 rounded-2xl border-white/10 hover:bg-white/5 hover:border-[#00FFFF]/30"
                        >
                          <svg className="size-5 mr-2" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="currentColor"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="currentColor"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                              fill="currentColor"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                          Continue with Google
                        </Button>
                      </motion.form>
                    ) : (
                      <motion.form
                        key="otp-step"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.25 }}
                        onSubmit={handleVerifyOTP}
                        className="space-y-6"
                      >
                        <div>
                          <h2 className="text-3xl mb-2">Verify OTP</h2>
                          <p className="text-sm text-[#B3B3B3]">
                            Enter the 6-digit code sent to{" "}
                            <span className="text-white">{phoneNumber}</span>
                          </p>
                          <button
                            type="button"
                            onClick={() => setStep("phone")}
                            className="text-sm text-[#00FFFF] hover:underline mt-1"
                          >
                            Change number
                          </button>
                        </div>

                        <div>
                          <label className="block text-sm text-[#B3B3B3] mb-4">
                            Enter OTP
                          </label>
                          <div className="flex gap-3 justify-between">
                            {otp.map((digit, index) => (
                              <Input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) =>
                                  handleOtpChange(index, e.target.value)
                                }
                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                className="w-14 h-14 text-center text-2xl bg-[#1A1A1A] border-white/10 rounded-2xl focus:border-[#00FFFF]/50"
                                required
                              />
                            ))}
                          </div>
                        </div>

                        <div className="text-center">
                          {countdown > 0 ? (
                            <p className="text-sm text-[#B3B3B3]">
                              Resend OTP in{" "}
                              <span className="text-[#00FFFF]">
                                {countdown}s
                              </span>
                            </p>
                          ) : (
                            <button
                              type="button"
                              onClick={handleResendOTP}
                              className="text-sm text-[#00FFFF] hover:text-[#00D4FF] transition-colors cursor-pointer"
                            >
                              Resend OTP
                            </button>
                          )}
                        </div>

                        <Button
                          type="submit"
                          disabled={loadingLogin}
                          className="w-full bg-gradient-to-r from-[#00FFFF] to-[#00D4FF] hover:from-[#00D4FF] hover:to-[#00FFFF] hover:shadow-lg hover:shadow-[#00FFFF]/30 text-black rounded-2xl h-14 text-base group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loadingLogin ? "Verifying..." : "Verify & Continue"}
                          <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </motion.form>
                    )}
                  </AnimatePresence>
                ) : (
                  // SIGNUP MODE
                  <motion.form
                    key="signup-mode"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={handleSignupSubmit}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-3xl mb-2">Create your account</h2>
                      <p className="text-sm text-[#B3B3B3]">
                        Sign up with your details to start using Stoxie.
                      </p>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-sm text-[#B3B3B3] mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#B3B3B3]" />
                        <Input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="John Doe"
                          className="pl-12 bg-[#1A1A1A] border-white/5 rounded-2xl h-12 focus:border-[#00FFFF]/50"
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm text-[#B3B3B3] mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#B3B3B3]" />
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="pl-12 bg-[#1A1A1A] border-white/5 rounded-2xl h-12 focus:border-[#00FFFF]/50"
                          required
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm text-[#B3B3B3] mb-2">
                        Mobile Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#B3B3B3]" />
                        <Input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="pl-12 bg-[#1A1A1A] border-white/5 rounded-2xl h-12 focus:border-[#00FFFF]/50"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loadingSignup}
                      className="w-full bg-gradient-to-r from-[#00FFFF] to-[#00D4FF] hover:from-[#00D4FF] hover:to-[#00FFFF] hover:shadow-lg hover:shadow-[#00FFFF]/30 text-black rounded-2xl h-12 text-base group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingSignup ? "Signing you up..." : "Sign up"}
                      <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 size-32 bg-gradient-to-br from-[#00FFFF]/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 right-10 size-40 bg-gradient-to-br from-[#FF00FF]/20 to-transparent rounded-full blur-3xl"
        />
      </div>
    </div>
  );
}
