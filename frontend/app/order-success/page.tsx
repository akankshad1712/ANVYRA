"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight, ShoppingBag } from "lucide-react";
import { Suspense } from "react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber  = searchParams.get("orderNumber") ?? "—";

  return (
    <main className="min-h-screen bg-[#F7F3EE] flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md text-center"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/logos/anvyra-badge.png"
            alt="ANVYRA"
            width={64}
            height={64}
            className="h-16 w-16 object-contain"
          />
        </div>

        {/* Check icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100"
        >
          <CheckCircle className="h-12 w-12 text-emerald-600" />
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#A0673A]">
            Order Confirmed
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-space-grotesk)] text-4xl font-bold text-[#1C0A04]">
            Thank you!
          </h1>
          <p className="mt-4 text-[#5C2E1A] leading-relaxed">
            Your order has been placed successfully. We'll start processing it right away.
          </p>
        </motion.div>

        {/* Order number card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 rounded-2xl border border-[#D6CCBF] bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EDE8E0]">
              <Package className="h-5 w-5 text-[#C4956A]" />
            </div>
            <div className="text-left">
              <p className="text-xs text-[#A0673A] font-medium uppercase tracking-wider">
                Order Number
              </p>
              <p className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[#1C0A04]">
                {orderNumber}
              </p>
            </div>
          </div>

          <div className="space-y-2 text-sm text-[#5C2E1A]">
            <div className="flex items-center justify-between rounded-lg bg-[#F7F3EE] px-4 py-2.5">
              <span className="text-[#A0673A]">Status</span>
              <span className="flex items-center gap-1.5 font-semibold text-amber-700">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Pending
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-[#F7F3EE] px-4 py-2.5">
              <span className="text-[#A0673A]">Estimated Delivery</span>
              <span className="font-semibold text-[#1C0A04]">5–7 business days</span>
            </div>
          </div>
        </motion.div>

        {/* What's next */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6 rounded-2xl border border-[#D6CCBF] bg-[#EDE8E0] p-5 text-left"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-[#A0673A] mb-3">
            What happens next
          </p>
          <div className="space-y-3">
            {[
              { step: "1", text: "We'll confirm your order and begin processing" },
              { step: "2", text: "Your items will be packed with care" },
              { step: "3", text: "Shipped and tracked to your doorstep" },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-3">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#C4956A] text-[10px] font-bold text-[#1C0A04]">
                  {s.step}
                </span>
                <p className="text-sm text-[#5C2E1A]">{s.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
        >
          <Link
            href="/orders"
            className="flex items-center justify-center gap-2 rounded-full bg-[#1C0A04] px-8 py-3.5 font-semibold text-[#F7F3EE] transition hover:bg-[#3D1A0A]"
          >
            <Package className="h-4 w-4" />
            View My Orders
          </Link>
          <Link
            href="/shop"
            className="flex items-center justify-center gap-2 rounded-full border border-[#D6CCBF] px-8 py-3.5 font-semibold text-[#5C2E1A] transition hover:border-[#C4956A] hover:bg-[#EDE8E0]"
          >
            <ShoppingBag className="h-4 w-4" />
            Continue Shopping
          </Link>
        </motion.div>

        {/* Brand note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-10 text-xs text-[#A0673A]"
        >
          Thank you for choosing ANVYRA — Dress the Story.
          <br />
          Built by Akanksha Deshmukh with care.
        </motion.p>
      </motion.div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <OrderSuccessContent />
    </Suspense>
  );
}
