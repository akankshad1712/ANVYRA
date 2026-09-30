"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useToast } from "@/providers/toast-provider";
import { Spinner } from "@/components/common/Loading";
import { ApiError } from "@/lib/api-client";

export default function LoginPage() {
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [formError, setFormError] = useState("");
  const { login }              = useAuthStore();
  const router                 = useRouter();
  const { success }            = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setLoading(true);
    try {
      await login(email, password);
      success("Welcome back!");
      router.push("/");
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setFormError(err.message);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F7F3EE]">

      {/* ── Left brand panel ─────────────────────────────── */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-[#1C0A04] overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#C4956A]/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#5C2E1A]/40 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#3D1A0A]/30 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center text-center px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Image
              src="/logos/anvyra-logo-white.png"
              alt="ANVYRA"
              width={180}
              height={56}
              className="h-14 w-auto object-contain"
              priority
            />
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 h-px w-16 bg-gradient-to-r from-transparent via-[#C4956A] to-transparent"
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-3xl font-bold font-[family-name:var(--font-space-grotesk)] text-[#F7F3EE] leading-tight"
          >
            Style Meets You.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-4 text-base text-[#C4956A]/80 leading-relaxed max-w-xs"
          >
            Premium fashion crafted for people who know exactly who they are.
          </motion.p>

          {/* Feature bullets */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-12 space-y-4 text-left w-full max-w-xs"
          >
            {[
              "Exclusive member-only drops",
              "Free shipping on orders ₹999+",
              "Easy returns within 7 days",
            ].map((feat, i) => (
              <div key={i} className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-[#C4956A] flex-shrink-0" />
                <span className="text-sm text-[#F7F3EE]/70">{feat}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="absolute bottom-8 text-[10px] font-bold uppercase tracking-[0.3em] text-[#C4956A]/50"
        >
          ANVYRA — Built for legacy
        </motion.p>
      </div>

      {/* ── Right form panel ─────────────────────────────── */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center px-6 py-12 sm:px-10">
        {/* Mobile logo */}
        <div className="mb-8 lg:hidden">
          <Image
            src="/logos/anvyra-logo-black.png"
            alt="ANVYRA"
            width={130}
            height={40}
            className="h-10 w-auto"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Heading */}
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#A0673A]">Welcome back</p>
            <h1 className="mt-2 font-[family-name:var(--font-space-grotesk)] text-4xl font-bold text-[#1C0A04]">
              Sign In
            </h1>
            <p className="mt-2 text-[#A0673A]">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-semibold text-[#5C2E1A] underline underline-offset-2 hover:text-[#3D1A0A] transition-colors">
                Create one
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-semibold text-[#3D1A0A]">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                required
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-[#D6CCBF] bg-white px-4 py-3 text-[#3D1A0A] placeholder:text-[#A0673A]/40 transition focus:border-[#C4956A] focus:outline-none focus:ring-3 focus:ring-[#C4956A]/15"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-semibold text-[#3D1A0A]">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-[#A0673A] hover:text-[#5C2E1A] transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  required
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#D6CCBF] bg-white px-4 py-3 pr-12 text-[#3D1A0A] placeholder:text-[#A0673A]/40 transition focus:border-[#C4956A] focus:outline-none focus:ring-3 focus:ring-[#C4956A]/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A0673A] hover:text-[#5C2E1A] transition-colors"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Inline error banner */}
            {formError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{formError}</span>
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-xl bg-[#1C0A04] py-3.5 font-semibold text-[#F7F3EE] transition-all duration-300 hover:bg-[#3D1A0A] hover:shadow-lg hover:shadow-[#1C0A04]/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Spinner size="sm" className="text-[#F7F3EE]" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-7 flex items-center gap-3">
            <div className="flex-1 h-px bg-[#D6CCBF]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C4956A]">ANVYRA</span>
            <div className="flex-1 h-px bg-[#D6CCBF]" />
          </div>

          <p className="text-center text-xs text-[#A0673A]">
            By signing in you agree to our{" "}
            <span className="underline cursor-pointer hover:text-[#5C2E1A] transition-colors">Terms</span>
            {" "}and{" "}
            <span className="underline cursor-pointer hover:text-[#5C2E1A] transition-colors">Privacy Policy</span>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
