"use client";

import { use, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import Container from "@/components/common/Container";
import { motion } from "framer-motion";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") ?? "";

  return (
    <main className="flex min-h-[80vh] items-center">
      <Container className="max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 mb-6">
            <CheckCircle className="h-10 w-10 text-emerald-500" />
          </div>

          <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold">
            Order Confirmed!
          </h1>
          <p className="mt-3 text-zinc-600">
            Thank you for your purchase. We've received your order and will start processing it shortly.
          </p>

          {orderNumber && (
            <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
              <p className="text-sm text-zinc-500">Order Number</p>
              <p className="mt-1 font-[family-name:var(--font-space-grotesk)] text-xl font-bold tracking-wide text-zinc-950">
                {orderNumber}
              </p>
              <p className="mt-2 text-xs text-zinc-500">
                Save this for tracking your order. You'll also receive a confirmation shortly.
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/orders"
              className="flex items-center justify-center gap-2 rounded-full bg-black px-6 py-3.5 font-semibold text-white hover:bg-zinc-800 transition"
            >
              <Package className="h-4 w-4" />
              Track Order
            </Link>
            <Link
              href="/shop"
              className="flex items-center justify-center gap-2 rounded-full border border-zinc-300 px-6 py-3.5 font-semibold text-zinc-700 hover:border-zinc-500 transition"
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
    <Suspense fallback={<div className="flex min-h-[80vh] items-center justify-center">Loading…</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
