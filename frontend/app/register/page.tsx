"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { useToast } from "@/providers/toast-provider";
import Container from "@/components/common/Container";
import { Spinner } from "@/components/common/Loading";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  const router = useRouter();
  const { error, success } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      success("Account created successfully!");
      router.push("/");
    } catch (err: any) {
      error(err.message ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="py-16">
      <Container className="max-w-md">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-lg">
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Join ANVYRA and start shopping.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2.5 focus:border-black focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2.5 focus:border-black focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2.5 focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700">Phone (optional)</label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2.5 focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={8}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2.5 focus:border-black focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-black py-3 font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
            >
              {loading ? <Spinner size="sm" className="text-white mx-auto" /> : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-black hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </Container>
    </main>
  );
}
