"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Check, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useToast } from "@/providers/toast-provider";
import { Spinner } from "@/components/common/Loading";
import { ApiError } from "@/lib/api-client";

const PERKS = [
  "Early access to new drops",
  "Member-exclusive pricing",
  "Order tracking & history",
  "One-click reorder",
];

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", password: "", phoneNumber: "",
  });
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [formError, setFormError] = useState("");
  const { register }              = useAuthStore();
  const router                    = useRouter();
  const { success }               = useToast();

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setLoading(true);
    try {
      await register(formData);
      success("Account created! Welcome to ANVYRA.");
      router.push("/");
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setFormError(err.message);
      } else {
        setFormError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-[#D6CCBF] bg-white px-4 py-3 text-[#3D1A0A] placeholder:text-[#A0673A]/40 transition focus:border-[#C4956A] focus:outline-none focus:ring-3 focus:ring-[#C4956A]/15";
  const labelCls = "block text-sm font-semibold text-[#3D1A0A] mb-1.5";

  return (
    <div className="flex min-h-screen bg-[#F7F3EE]">

      {/* ── Left brand panel ─────────────────────────────── */}
      <div className="relative hidden lg:flex lg:w-5/12 flex-col items-center justify-center bg-[#1C0A04] overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#C4956A]/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#5C2E1A]/40 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center text-center px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Image
              src="/logos/anvyra-logo-white.png"
              alt="ANVYRA"
              width={160}
              height={50}
              className="h-12 w-auto object-contain"
              priority
            />
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 h-px w-16 bg-gradient-to-r from-transparent via-[#C4956A] to-transparent"
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 text-2xl font-bold font-[family-name:var(--font-space-grotesk)] text-[#F7F3EE] leading-tight"
          >
            Join the legacy.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="mt-3 text-sm text-[#C4956A]/80 max-w-xs leading-relaxed"
          >
            Create your account and unlock a world of premium fashion.
          </motion.p>

          {/* Perks list */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-10 space-y-3 text-left w-full max-w-xs"
          >
            {PERKS.map((perk, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C4956A]/20 flex-shrink-0">
                  <Check className="h-3 w-3 text-[#C4956A]" />
                </div>
                <span className="text-sm text-[#F7F3EE]/70">{perk}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="absolute bottom-8 text-[10px] font-bold uppercase tracking-[0.3em] text-[#C4956A]/50"
        >
          ANVYRA — Style Meets You
        </motion.p>
      </div>

      {/* ── Right form panel ─────────────────────────────── */}
      <div className="flex w-full lg:w-7/12 flex-col items-center justify-center px-6 py-12 sm:px-10 overflow-y-auto">
        {/* Mobile logo */}
        <div className="mb-6 lg:hidden">
          <Image src="/logos/anvyra-logo-black.png" alt="ANVYRA" width={130} height={40} className="h-10 w-auto" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Heading */}
          <div className="mb-7">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#A0673A]">New here?</p>
            <h1 className="mt-2 font-[family-name:var(--font-space-grotesk)] text-4xl font-bold text-[#1C0A04]">
              Create Account
            </h1>
            <p className="mt-2 text-[#A0673A]">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-[#5C2E1A] underline underline-offset-2 hover:text-[#3D1A0A] transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={set("firstName")}
                  required
                  autoComplete="given-name"
                  placeholder="Alex"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={set("lastName")}
                  required
                  autoComplete="family-name"
                  placeholder="Jordan"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className={labelCls}>Email address</label>
              <input
                type="email"
                value={formData.email}
                onChange={set("email")}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className={inputCls}
              />
            </div>

            {/* Phone */}
            <div>
              <label className={labelCls}>
                Phone{" "}
                <span className="text-[#A0673A] font-normal text-xs">(optional)</span>
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={set("phoneNumber")}
                autoComplete="tel"
                placeholder="10-digit mobile number"
                className={inputCls}
              />
            </div>

            {/* Password */}
            <div>
              <label className={labelCls}>Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={formData.password}
                  onChange={set("password")}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  className={inputCls + " pr-12"}
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
              {/* Password strength hint */}
              {formData.password.length > 0 && (
                <div className="mt-1.5 flex gap-1">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        formData.password.length >= n * 3
                          ? formData.password.length >= 12
                            ? "bg-emerald-500"
                            : "bg-[#C4956A]"
                          : "bg-[#D6CCBF]"
                      }`}
                    />
                  ))}
                </div>
              )}
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
              className="group mt-2 w-full overflow-hidden rounded-xl bg-[#1C0A04] py-3.5 font-semibold text-[#F7F3EE] transition-all duration-300 hover:bg-[#3D1A0A] hover:shadow-lg hover:shadow-[#1C0A04]/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Spinner size="sm" className="text-[#F7F3EE]" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-[#D6CCBF]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C4956A]">ANVYRA</span>
            <div className="flex-1 h-px bg-[#D6CCBF]" />
          </div>

          <p className="text-center text-xs text-[#A0673A]">
            By creating an account you agree to our{" "}
            <span className="underline cursor-pointer hover:text-[#5C2E1A] transition-colors">Terms</span>
            {" "}and{" "}
            <span className="underline cursor-pointer hover:text-[#5C2E1A] transition-colors">Privacy Policy</span>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
