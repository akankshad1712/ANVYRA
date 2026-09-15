"use client";

import { use, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { useToast } from "@/providers/toast-provider";
import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";
import { PageLoader, Spinner } from "@/components/common/Loading";
import Image from "next/image";
import { ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const ALL_STATUSES: OrderStatus[] = [
  "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"
];

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING:    "bg-amber-100 text-amber-800",
  CONFIRMED:  "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED:    "bg-indigo-100 text-indigo-800",
  DELIVERED:  "bg-emerald-100 text-emerald-800",
  CANCELLED:  "bg-red-100 text-red-800",
  REFUNDED:   "bg-[#EDE8E0] text-[#5C2E1A]",
};

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }  = use(params);
  const qc      = useQueryClient();
  const { success, error: showError } = useToast();
  const [newStatus, setNewStatus] = useState<OrderStatus | "">("");

  const { data: order, isLoading } = useQuery({
    queryKey: ["admin", "order", id],
    queryFn: () => adminService.getOrderById(Number(id)),
  });

  const updateMutation = useMutation({
    mutationFn: (status: OrderStatus) => adminService.updateOrderStatus(Number(id), status),
    onSuccess: (updated) => {
      success(`Order status updated to ${updated.status}`);
      qc.invalidateQueries({ queryKey: ["admin", "order", id] });
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      setNewStatus("");
    },
    onError: (e: any) => showError(e.message ?? "Failed to update status"),
  });

  if (isLoading || !order) return <PageLoader />;

  return (
    <div>
      <AdminBreadcrumb crumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Orders",    href: "/admin/orders" },
        { label: order.orderNumber },
      ]} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#1C0A04]">
            {order.orderNumber}
          </h1>
          <p className="text-sm text-[#A0673A] mt-0.5">
            {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <span className={cn("rounded-full px-3 py-1 text-sm font-medium", STATUS_STYLES[order.status])}>
          {order.status}
        </span>
      </div>

      {/* Update status panel */}
      <div className="mb-6 rounded-2xl border border-[#D6CCBF] bg-white p-5">
        <h2 className="font-semibold text-[#1C0A04] mb-3">Update Order Status</h2>
        <div className="flex flex-wrap gap-2">
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              disabled={s === order.status || updateMutation.isPending}
              onClick={() => updateMutation.mutate(s)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:opacity-40",
                s === order.status
                  ? "bg-[#5C2E1A] text-[#F7F3EE] cursor-default"
                  : "border border-[#D6CCBF] text-[#5C2E1A] hover:border-[#C4956A] hover:bg-[#EDE8E0]"
              )}
            >
              {updateMutation.isPending && newStatus === s
                ? <Spinner size="sm" className="text-[#5C2E1A]" />
                : s
              }
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-[#A0673A]">
          Current status: <strong>{order.status}</strong>. Click any status to immediately update.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-[#D6CCBF] bg-white p-5">
            <h2 className="font-semibold text-[#1C0A04] mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative h-16 w-14 flex-shrink-0 rounded-lg overflow-hidden bg-[#EDE8E0]">
                    {item.productImage && (
                      <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-[#3D1A0A] line-clamp-2">{item.productName}</p>
                    {(item.selectedSize || item.selectedColor) && (
                      <p className="text-xs text-[#A0673A] mt-0.5">
                        {[item.selectedSize, item.selectedColor].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    <p className="text-xs text-[#A0673A] mt-1">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                  </div>
                  <p className="font-semibold text-sm text-[#3D1A0A] flex-shrink-0">₹{item.subtotal.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side panels */}
        <div className="space-y-4">
          {/* Payment */}
          <div className="rounded-2xl border border-[#D6CCBF] bg-white p-5">
            <h2 className="font-semibold text-[#1C0A04] mb-3">Payment</h2>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-[#A0673A]">Subtotal</span><span>₹{order.subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-[#A0673A]">Shipping</span><span>{order.shippingCost === 0 ? "Free" : `₹${order.shippingCost}`}</span></div>
              <div className="flex justify-between font-semibold border-t border-[#EDE8E0] pt-1.5 text-[#1C0A04]"><span>Total</span><span>₹{order.totalAmount.toLocaleString()}</span></div>
              <p className="text-xs text-[#A0673A] pt-1">
                Method: {order.paymentMethod?.replace("_", " ") ?? "—"} ·{" "}
                <span className={order.paymentStatus === "SUCCESS" ? "text-emerald-700 font-medium" : ""}>
                  {order.paymentStatus ?? "—"}
                </span>
              </p>
            </div>
          </div>

          {/* Shipping address */}
          {order.shippingAddress && (
            <div className="rounded-2xl border border-[#D6CCBF] bg-white p-5">
              <h2 className="font-semibold text-[#1C0A04] mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#C4956A]" /> Shipping Address
              </h2>
              <div className="text-sm text-[#A0673A] space-y-0.5">
                <p className="text-[#3D1A0A] font-medium">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
                <p>📞 {order.shippingAddress.phone}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <Link href="/admin/orders" className="flex items-center gap-2 text-sm text-[#A0673A] hover:text-[#5C2E1A] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to orders
        </Link>
      </div>
    </div>
  );
}
