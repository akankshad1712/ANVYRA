"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { useToast } from "@/providers/toast-provider";
import Container from "@/components/common/Container";
import { Spinner } from "@/components/common/Loading";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();
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

  return (
    <main className="py-16">
      <Container className="max-w-md">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-lg">
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold">
            Sign In
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Welcome back. Sign in to your account.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2.5 focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2.5 focus:border-black focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-black py-3 font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
            >
              {loading ? <Spinner size="sm" className="text-white mx-auto" /> : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-600">
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold text-black hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </Container>
    </main>
  );
}
