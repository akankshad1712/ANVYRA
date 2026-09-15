"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/store/auth.store";
import { useToast } from "@/providers/toast-provider";
import Container from "@/components/common/Container";
import { Spinner } from "@/components/common/Loading";

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const { login }   = useAuthStore();
  const router      = useRouter();
  const { error, success } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      success("Welcome back!");
      router.push("/");
    } catch (err: any) {
      error(err.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ── shared input class ── */
  const inputCls =
    "mt-1 w-full rounded-lg border border-[#D6CCBF] bg-white px-4 py-2.5 text-[#3D1A0A] placeholder:text-[#A0673A]/50 focus:border-[#C4956A] focus:outline-none focus:ring-2 focus:ring-[#C4956A]/20 transition";

  return (
    <main className="flex min-h-[80vh] items-center py-16 bg-[#F7F3EE]">
      <Container className="max-w-md">
        <div className="rounded-2xl border border-[#D6CCBF] bg-white p-8 shadow-lg">
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <Image src="/logos/anvyra-logo-black.png" alt="ANVYRA" width={120} height={38} className="h-9 w-auto" />
          </div>

          <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#1C0A04]">
            Sign In
          </h1>
          <p className="mt-1 text-sm text-[#A0673A]">
            Welcome back. Sign in to your account.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#5C2E1A]">Email</label>
              <input
                id="email" type="email" value={email} required
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls} placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#5C2E1A]">Password</label>
              <input
                id="password" type="password" value={password} required
                onChange={(e) => setPassword(e.target.value)}
                className={inputCls} placeholder="••••••••"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full rounded-full bg-[#5C2E1A] py-3 font-semibold text-[#F7F3EE] hover:bg-[#3D1A0A] disabled:opacity-50 transition-colors"
            >
              {loading ? <Spinner size="sm" className="text-[#F7F3EE] mx-auto" /> : "Sign In"}
            </button>
          </form>

          {/* Gold divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-[#D6CCBF]" />
            <span className="text-xs text-[#C4956A] uppercase tracking-wider">ANVYRA</span>
            <div className="flex-1 h-px bg-[#D6CCBF]" />
          </div>

          <p className="text-center text-sm text-[#A0673A]">
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold text-[#5C2E1A] hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </Container>
    </main>
  );
}
