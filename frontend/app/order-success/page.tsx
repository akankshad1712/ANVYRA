"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import Container from "@/components/common/Container";
import { motion } from "framer-motion";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber  = searchParams.get("orderNumber") ?? "";

  return (
    <main className="flex min-h-[80vh] items-center bg-[#F7F3EE]">
      <Container className="max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 mb-6">
            <CheckCircle className="h-10 w-10 text-emerald-600" />
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C4956A]">
            Style Meets You
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[#1C0A04]">
            Order Confirmed!
          </h1>
          <p className="mt-3 text-[#A0673A]">
            Thank you for your purchase. We've received your order and will start processing it shortly.
          </p>

          {orderNumber && (
            <div className="mt-6 rounded-2xl border border-[#D6CCBF] bg-white p-6">
              <p className="text-sm text-[#A0673A]">Order Number</p>
              <p className="mt-1 font-[family-name:var(--font-space-grotesk)] text-xl font-bold tracking-wide text-[#1C0A04]">
                {orderNumber}
              </p>
              <p className="mt-2 text-xs text-[#A0673A]">
                Save this for tracking your order.
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/orders"
              className="flex items-center justify-center gap-2 rounded-full bg-[#5C2E1A] px-6 py-3.5 font-semibold text-[#F7F3EE] hover:bg-[#3D1A0A] transition-colors"
            >
              <Package className="h-4 w-4" />
              Track Order
            </Link>
            <Link
              href="/shop"
              className="flex items-center justify-center gap-2 rounded-full border border-[#C4956A] px-6 py-3.5 font-semibold text-[#5C2E1A] hover:bg-[#EDE8E0] transition-colors"
            >
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </Container>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[80vh] items-center justify-center bg-[#F7F3EE]"><p className="text-[#A0673A]">Loading…</p></div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
