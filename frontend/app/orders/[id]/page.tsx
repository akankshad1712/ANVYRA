"use client";

import { use } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersService } from "@/services/orders.service";
import { useAuthStore } from "@/store/auth.store";
import { useToast } from "@/providers/toast-provider";
import Container from "@/components/common/Container";
import { PageLoader } from "@/components/common/Loading";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-purple-100 text-purple-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
  REFUNDED: "bg-zinc-100 text-zinc-600",
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
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
      success("Order cancelled");
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err: any) => showError(err.message ?? "Failed to cancel order"),
  });

  if (isLoading || !order) return <PageLoader />;

  const canCancel = !["SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"].includes(order.status);

  return (
    <main className="py-10">
      <Container className="max-w-3xl">
        <Link href="/orders" className="mb-6 flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition">
          <ArrowLeft className="h-4 w-4" /> Back to orders
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold">
              Order {order.orderNumber}
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <span className={cn("rounded-full px-3 py-1 text-sm font-medium", STATUS_STYLES[order.status])}>
            {order.status}
          </span>
        </div>

        {/* Items */}
        <section className="rounded-2xl border border-zinc-100 p-5 mb-6">
          <h2 className="font-semibold mb-4">Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="relative h-20 w-16 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0">
                  {item.productImage && <Image src={item.productImage} alt={item.productName} fill className="object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm line-clamp-2">{item.productName}</p>
                  {(item.selectedSize || item.selectedColor) && (
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {[item.selectedSize, item.selectedColor].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  <p className="text-xs text-zinc-600 mt-1">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-sm flex-shrink-0">₹{item.subtotal.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          {/* Shipping address */}
          {order.shippingAddress && (
            <section className="rounded-2xl border border-zinc-100 p-5">
              <h2 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" /> Shipping Address
              </h2>
              <p className="text-sm text-zinc-700">{order.shippingAddress.fullName}</p>
              <p className="text-sm text-zinc-500">{order.shippingAddress.street}</p>
              <p className="text-sm text-zinc-500">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
              <p className="text-sm text-zinc-500">{order.shippingAddress.country}</p>
            </section>
          )}

          {/* Payment summary */}
          <section className="rounded-2xl border border-zinc-100 p-5">
            <h2 className="font-semibold mb-3 text-sm">Payment Summary</h2>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-zinc-600">Subtotal</span><span>₹{order.subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-zinc-600">Shipping</span><span>{order.shippingCost === 0 ? "Free" : `₹${order.shippingCost}`}</span></div>
              <div className="flex justify-between font-semibold border-t pt-2 mt-1"><span>Total</span><span>₹{order.totalAmount.toLocaleString()}</span></div>
            </div>
            {order.paymentMethod && (
              <p className="mt-3 text-xs text-zinc-500">
                Payment: {order.paymentMethod.replace("_", " ")} ·{" "}
                <span className={order.paymentStatus === "SUCCESS" ? "text-emerald-600" : "text-zinc-600"}>
                  {order.paymentStatus}
                </span>
              </p>
            )}
          </section>
        </div>

        {canCancel && (
          <button
            onClick={() => cancelMutation.mutate()}
            disabled={cancelMutation.isPending}
            className="rounded-full border border-red-200 px-6 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 transition"
          >
            {cancelMutation.isPending ? "Cancelling…" : "Cancel Order"}
          </button>
        )}
      </Container>
    </main>
  );
}
