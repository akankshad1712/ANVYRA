"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/store/auth.store";
import { useToast } from "@/providers/toast-provider";
import Container from "@/components/common/Container";
import { Spinner } from "@/components/common/Loading";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", password: "", phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  const router       = useRouter();
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

  const inputCls =
    "mt-1 w-full rounded-lg border border-[#D6CCBF] bg-white px-4 py-2.5 text-[#3D1A0A] placeholder:text-[#A0673A]/50 focus:border-[#C4956A] focus:outline-none focus:ring-2 focus:ring-[#C4956A]/20 transition";
  const labelCls = "block text-sm font-medium text-[#5C2E1A]";
  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((f) => ({ ...f, [key]: e.target.value }));

  return (
    <main className="flex min-h-[80vh] items-center py-16 bg-[#F7F3EE]">
      <Container className="max-w-md">
        <div className="rounded-2xl border border-[#D6CCBF] bg-white p-8 shadow-lg">
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <Image src="/logos/anvyra-logo-black.png" alt="ANVYRA" width={120} height={38} className="h-9 w-auto" />
          </div>

          <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#1C0A04]">
            Create Account
          </h1>
          <p className="mt-1 text-sm text-[#A0673A]">Join ANVYRA and start shopping.</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>First Name</label>
                <input type="text" value={formData.firstName} onChange={set("firstName")} required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Last Name</label>
                <input type="text" value={formData.lastName} onChange={set("lastName")} required className={inputCls} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Email</label>
              <input type="email" value={formData.email} onChange={set("email")} required className={inputCls} placeholder="you@example.com" />
            </div>

            <div>
              <label className={labelCls}>Phone <span className="text-[#A0673A] font-normal">(optional)</span></label>
              <input type="tel" value={formData.phoneNumber} onChange={set("phoneNumber")} className={inputCls} placeholder="10-digit mobile" />
            </div>

            <div>
              <label className={labelCls}>Password</label>
              <input type="password" value={formData.password} onChange={set("password")} required minLength={8} className={inputCls} placeholder="Min. 8 characters" />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full rounded-full bg-[#5C2E1A] py-3 font-semibold text-[#F7F3EE] hover:bg-[#3D1A0A] disabled:opacity-50 transition-colors"
            >
              {loading ? <Spinner size="sm" className="text-[#F7F3EE] mx-auto" /> : "Create Account"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-[#D6CCBF]" />
            <span className="text-xs text-[#C4956A] uppercase tracking-wider">ANVYRA</span>
            <div className="flex-1 h-px bg-[#D6CCBF]" />
          </div>

          <p className="text-center text-sm text-[#A0673A]">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#5C2E1A] hover:underline">Sign in</Link>
          </p>
        </div>
      </Container>
    </main>
  );
}