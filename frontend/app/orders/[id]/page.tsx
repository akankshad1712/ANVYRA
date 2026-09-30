"use client";

import { use } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ordersService } from "@/services/orders.service";
import { useAuthStore } from "@/store/auth.store";
import { useToast } from "@/providers/toast-provider";
import Container from "@/components/common/Container";
import { PageLoader } from "@/components/common/Loading";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, CreditCard, Package, Check, Truck, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types";
import { DEFAULT_FALLBACK } from "@/lib/product-images";

const STATUS_STYLES: Record<OrderStatus, { pill: string; label: string }> = {
  PENDING:    { pill: "bg-amber-100  text-amber-800",   label: "Pending"    },
  CONFIRMED:  { pill: "bg-blue-100   text-blue-800",    label: "Confirmed"  },
  PROCESSING: { pill: "bg-purple-100 text-purple-800",  label: "Processing" },
  SHIPPED:    { pill: "bg-indigo-100 text-indigo-800",  label: "Shipped"    },
  DELIVERED:  { pill: "bg-emerald-100 text-emerald-800",label: "Delivered"  },
  CANCELLED:  { pill: "bg-red-100    text-red-800",     label: "Cancelled"  },
  REFUNDED:   { pill: "bg-[#EDE8E0]  text-[#5C2E1A]",  label: "Refunded"   },
};

const TIMELINE_STEPS: OrderStatus[] = [
  "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED",
];

const STEP_ICONS: Partial<Record<OrderStatus, React.ReactNode>> = {
  PENDING:    <Package className="h-3.5 w-3.5" />,
  CONFIRMED:  <Check    className="h-3.5 w-3.5" />,
  PROCESSING: <Star     className="h-3.5 w-3.5" />,
  SHIPPED:    <Truck    className="h-3.5 w-3.5" />,
  DELIVERED:  <Star     className="h-3.5 w-3.5" />,
};

function StatusTimeline({ current }: { current: OrderStatus }) {
  const cancelled = current === "CANCELLED" || current === "REFUNDED";
  const currentIdx = TIMELINE_STEPS.indexOf(current);

  if (cancelled) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
        <span className="text-sm font-semibold text-red-700">
          {current === "CANCELLED" ? "🚫 Order Cancelled" : "↩️ Order Refunded"}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0">
      {TIMELINE_STEPS.map((step, i) => {
        const done    = i <= currentIdx;
        const active  = i === currentIdx;
        const isLast  = i === TIMELINE_STEPS.length - 1;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors text-xs font-bold",
                active  ? "border-[#C4956A] bg-[#C4956A] text-white shadow-md shadow-[#C4956A]/30"
                        : done ? "border-[#5C2E1A] bg-[#5C2E1A] text-[#F7F3EE]"
                               : "border-[#D6CCBF] bg-white text-[#A0673A]"
              )}>
                {done && !active ? <Check className="h-3.5 w-3.5" /> : STEP_ICONS[step]}
              </div>
              <span className={cn(
                "hidden sm:block text-[10px] font-semibold text-center whitespace-nowrap",
                active ? "text-[#C4956A]" : done ? "text-[#5C2E1A]" : "text-[#A0673A]"
              )}>
                {STATUS_STYLES[step].label}
              </span>
            </div>
            {!isLast && (
              <div className={cn(
                "h-0.5 flex-1 mx-1 mb-5 sm:mb-4 transition-colors",
                i < currentIdx ? "bg-[#5C2E1A]" : "bg-[#D6CCBF]"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }              = use(params);
  const { isAuthenticated } = useAuthStore();
  const { success, error: showError } = useToast();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => ordersService.getOrderById(Number(id)),
    enabled: isAuthenticated,
  });

  const cancelMutation = useMutation({
    mutationFn: () => ordersService.cancelOrder(Number(id)),
    onSuccess: () => {
      success("Order cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err: any) => showError(err.message ?? "Failed to cancel order"),
  });

  if (isLoading || !order) return <PageLoader />;

  const canCancel    = !["SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"].includes(order.status);
  const statusStyle  = STATUS_STYLES[order.status];

  return (
    <main className="min-h-screen bg-[#F7F3EE] py-8 lg:py-12">
      <Container className="max-w-3xl">
        {/* Back link */}
        <Link href="/orders" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#A0673A] hover:text-[#5C2E1A] transition-colors">
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
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#A0673A]">Order</p>
            <h1 className="mt-1 font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#1C0A04] sm:text-3xl">
              {order.orderNumber}
            </h1>
            <p className="mt-1 text-sm text-[#A0673A]">
              Placed {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric", month: "long", year: "numeric",
              })}
            </p>
          </div>
          <span className={cn("rounded-full px-4 py-1.5 text-sm font-semibold", statusStyle.pill)}>
            {statusStyle.label}
          </span>
        </motion.div>

        {/* Status timeline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mb-8 rounded-2xl border border-[#D6CCBF] bg-white p-5 shadow-sm"
        >
          <h2 className="mb-4 text-sm font-semibold text-[#1C0A04]">Order Status</h2>
          <StatusTimeline current={order.status} />
        </motion.div>

        {/* Items */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6 rounded-2xl border border-[#D6CCBF] bg-white p-5 shadow-sm"
        >
          <h2 className="mb-4 font-semibold text-[#1C0A04]">
            Items
            <span className="ml-2 text-sm font-normal text-[#A0673A]">
              ({order.items.length} item{order.items.length !== 1 ? "s" : ""})
            </span>
          </h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-[#EDE8E0]">
                  <Image
                    src={item.productImage || DEFAULT_FALLBACK}
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 min-w-0 items-start justify-between gap-2">
                  <div>
                    <Link
                      href={`/product/${item.productId}`}
                      className="font-medium text-sm text-[#3D1A0A] hover:text-[#5C2E1A] transition-colors line-clamp-2"
                    >
                      {item.productName}
                    </Link>
                    {(item.selectedSize || item.selectedColor) && (
                      <p className="text-xs text-[#A0673A] mt-0.5">
                        {[item.selectedSize && `Size: ${item.selectedSize}`, item.selectedColor].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    <p className="text-xs text-[#A0673A] mt-1">
                      ₹{(item.subtotal / item.quantity).toLocaleString()} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold text-sm text-[#1C0A04] flex-shrink-0">
                    ₹{item.subtotal.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Address + Payment grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mb-6 grid gap-4 sm:grid-cols-2"
        >
          {/* Shipping address */}
          {order.shippingAddress && (
            <div className="rounded-2xl border border-[#D6CCBF] bg-white p-5 shadow-sm">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1C0A04]">
                <MapPin className="h-4 w-4 text-[#C4956A]" /> Shipping Address
              </h2>
              <div className="text-sm text-[#3D1A0A] space-y-0.5">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-[#A0673A]">{order.shippingAddress.street}</p>
                <p className="text-[#A0673A]">
                  {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.postalCode}
                </p>
                <p className="text-[#A0673A]">{order.shippingAddress.country}</p>
              </div>
            </div>
          )}

          {/* Payment summary */}
          <div className="rounded-2xl border border-[#D6CCBF] bg-white p-5 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1C0A04]">
              <CreditCard className="h-4 w-4 text-[#C4956A]" /> Payment Summary
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#A0673A]">Subtotal</span>
                <span className="text-[#3D1A0A]">₹{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A0673A]">Shipping</span>
                <span className={order.shippingCost === 0 ? "text-emerald-700 font-medium" : "text-[#3D1A0A]"}>
                  {order.shippingCost === 0 ? "Free" : `₹${order.shippingCost}`}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#EDE8E0] pt-2 font-bold text-[#1C0A04]">
                <span>Total</span>
                <span>₹{order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
            {order.paymentMethod && (
              <div className="mt-3 flex items-center justify-between rounded-lg bg-[#F7F3EE] px-3 py-2">
                <span className="text-xs text-[#A0673A]">{order.paymentMethod.replace("_", " ")}</span>
                <span className={cn(
                  "text-xs font-semibold rounded-full px-2 py-0.5",
                  order.paymentStatus === "SUCCESS" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                )}>
                  {order.paymentStatus}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Cancel button */}
        {canCancel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <button
              onClick={() => cancelMutation.mutate()}
              disabled={cancelMutation.isPending}
              className="rounded-xl border-2 border-red-200 px-6 py-3 text-sm font-semibold text-red-700 hover:bg-red-50 hover:border-red-300 disabled:opacity-50 transition-colors"
            >
              {cancelMutation.isPending ? "Cancelling…" : "Cancel Order"}
            </button>
          </motion.div>
        )}
      </Container>
    </main>
  );
}
