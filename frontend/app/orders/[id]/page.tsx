"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ordersService } from "@/services/orders.service";
import { useAuthStore } from "@/store/auth.store";
import Container from "@/components/common/Container";
import { PageLoader } from "@/components/common/Loading";
import Image from "next/image";
import Link from "next/link";
import { DEFAULT_FALLBACK } from "@/lib/product-images";
import {
  ArrowLeft, Package, MapPin, CreditCard,
  CheckCircle, Clock, Truck, XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; dot: string; Icon: any }> = {
  PENDING:    { label: "Pending",    color: "bg-amber-100 text-amber-800",    dot: "bg-amber-500",   Icon: Clock       },
  CONFIRMED:  { label: "Confirmed",  color: "bg-blue-100 text-blue-800",      dot: "bg-blue-500",    Icon: CheckCircle },
  PROCESSING: { label: "Processing", color: "bg-purple-100 text-purple-800",  dot: "bg-purple-500",  Icon: Package     },
  SHIPPED:    { label: "Shipped",    color: "bg-indigo-100 text-indigo-800",  dot: "bg-indigo-500",  Icon: Truck       },
  DELIVERED:  { label: "Delivered",  color: "bg-emerald-100 text-emerald-800",dot: "bg-emerald-500", Icon: CheckCircle },
  CANCELLED:  { label: "Cancelled",  color: "bg-red-100 text-red-800",        dot: "bg-red-500",     Icon: XCircle     },
  REFUNDED:   { label: "Refunded",   color: "bg-gray-100 text-gray-700",      dot: "bg-gray-400",    Icon: CheckCircle },
};

const TIMELINE: OrderStatus[] = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login?from=/orders");
  }, [isAuthenticated, authLoading, router]);

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ["order", id],
    queryFn: () => ordersService.getOrderById(Number(id)),
    enabled: isAuthenticated && !!id,
  });

  if (authLoading || isLoading) return <PageLoader />;

  if (isError || !order) {
    return (
      <main className="min-h-screen bg-[#F7F3EE] flex items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto h-16 w-16 text-[#C4956A]/40 mb-4" />
          <h1 className="text-2xl font-bold text-[#1C0A04] mb-2">Order not found</h1>
          <Link href="/orders" className="text-[#A0673A] underline hover:text-[#5C2E1A]">
            Back to orders
          </Link>
        </div>
      </main>
    );
  }

  const status  = STATUS_CONFIG[order.status];
  const StatusIcon = status.Icon;
  const isCancelled = order.status === "CANCELLED" || order.status === "REFUNDED";
  const timelineIdx = TIMELINE.indexOf(order.status as any);

  return (
    <main className="min-h-screen bg-[#F7F3EE] py-8 lg:py-12">
      <Container className="max-w-3xl">

        {/* Back */}
        <Link
          href="/orders"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#A0673A] hover:text-[#5C2E1A] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to orders
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex flex-wrap items-start justify-between gap-4"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#A0673A]">Order Detail</p>
            <h1 className="mt-1 font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#1C0A04]">
              {order.orderNumber}
            </h1>
            <p className="mt-1 text-sm text-[#A0673A]">
              Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric", month: "long", year: "numeric",
              })}
            </p>
          </div>
          <span className={cn(
            "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold",
            status.color
          )}>
            <span className={cn("h-2 w-2 rounded-full", status.dot)} />
            {status.label}
          </span>
        </motion.div>

        {/* Timeline */}
        {!isCancelled && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="mb-6 rounded-2xl border border-[#D6CCBF] bg-white p-6 shadow-sm"
          >
            <h2 className="mb-5 text-sm font-semibold text-[#1C0A04]">Order Progress</h2>
            <div className="relative flex items-center justify-between">
              {/* Track line */}
              <div className="absolute left-0 right-0 top-4 h-0.5 bg-[#EDE8E0]" />
              <div
                className="absolute left-0 top-4 h-0.5 bg-[#C4956A] transition-all duration-700"
                style={{ width: `${timelineIdx >= 0 ? (timelineIdx / (TIMELINE.length - 1)) * 100 : 0}%` }}
              />
              {TIMELINE.map((s, i) => {
                const cfg = STATUS_CONFIG[s];
                const done = timelineIdx >= i;
                const Icon = cfg.Icon;
                return (
                  <div key={s} className="relative flex flex-col items-center gap-2 z-10">
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                      done ? "border-[#C4956A] bg-[#C4956A] text-white" : "border-[#D6CCBF] bg-white text-[#A0673A]"
                    )}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <p className={cn(
                      "text-[10px] font-semibold uppercase tracking-wide text-center max-w-[56px] leading-tight",
                      done ? "text-[#5C2E1A]" : "text-[#A0673A]"
                    )}>
                      {cfg.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Items */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6 rounded-2xl border border-[#D6CCBF] bg-white p-6 shadow-sm"
        >
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#1C0A04]">
            <Package className="h-4 w-4 text-[#C4956A]" />
            Items ({order.items.length})
          </h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="relative h-16 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-[#EDE8E0]">
                  <Image
                    src={item.productImage || DEFAULT_FALLBACK}
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-[#1C0A04] line-clamp-2">{item.productName}</p>
                  {(item.selectedSize || item.selectedColor) && (
                    <p className="text-xs text-[#A0673A] mt-0.5">
                      {[item.selectedSize, item.selectedColor].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  <p className="text-xs text-[#A0673A] mt-0.5">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-sm text-[#1C0A04] flex-shrink-0">
                  ₹{item.subtotal.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Address + Payment + Total */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Shipping address */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="rounded-2xl border border-[#D6CCBF] bg-white p-5 shadow-sm"
          >
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1C0A04]">
              <MapPin className="h-4 w-4 text-[#C4956A]" />
              Shipping Address
            </h2>
            <div className="text-sm text-[#5C2E1A] space-y-0.5">
              <p className="font-semibold">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
              <p className="text-[#A0673A]">📞 {order.shippingAddress.phone}</p>
            </div>
          </motion.div>

          {/* Payment + totals */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-2xl border border-[#D6CCBF] bg-white p-5 shadow-sm"
          >
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1C0A04]">
              <CreditCard className="h-4 w-4 text-[#C4956A]" />
              Payment
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#A0673A]">Method</span>
                <span className="font-medium text-[#1C0A04]">{order.paymentMethod ?? "COD"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A0673A]">Subtotal</span>
                <span className="text-[#1C0A04]">₹{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A0673A]">Shipping</span>
                <span className={order.shippingCost === 0 ? "text-emerald-700 font-medium" : "text-[#1C0A04]"}>
                  {order.shippingCost === 0 ? "Free" : `₹${order.shippingCost}`}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-[#A0673A]">Discount</span>
                  <span className="text-emerald-700 font-medium">-₹{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-[#EDE8E0] pt-2 font-bold text-[#1C0A04]">
                <span>Total</span>
                <span>₹{order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8 flex flex-wrap gap-3 justify-center"
        >
          <Link
            href="/shop"
            className="rounded-full bg-[#5C2E1A] px-8 py-3 font-semibold text-[#F7F3EE] transition hover:bg-[#3D1A0A] text-sm"
          >
            Continue Shopping
          </Link>
          <Link
            href="/orders"
            className="rounded-full border border-[#D6CCBF] px-8 py-3 font-semibold text-[#5C2E1A] transition hover:border-[#C4956A] text-sm"
          >
            All Orders
          </Link>
        </motion.div>
      </Container>
    </main>
  );
}
