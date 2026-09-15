"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING:    "bg-amber-100 text-amber-800",
  CONFIRMED:  "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED:    "bg-indigo-100 text-indigo-800",
  DELIVERED:  "bg-emerald-100 text-emerald-800",
  CANCELLED:  "bg-red-100 text-red-800",
  REFUNDED:   "bg-[#EDE8E0] text-[#5C2E1A]",
};

export default function AdminOrdersPage() {
  const [page, setPage] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "orders", page],
    queryFn: () => adminService.listAllOrders(page, 20),
  });

  const orders     = data?.content     ?? [];
  const totalPages = data?.totalPages  ?? 0;

  return (
    <div>
      <AdminBreadcrumb crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Orders" }]} />

      <div className="mb-6">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#1C0A04]">Orders</h1>
        <p className="text-sm text-[#A0673A] mt-0.5">{data?.totalElements ?? 0} total orders</p>
      </div>

      <div className="rounded-2xl border border-[#D6CCBF] bg-white overflow-hidden">
        {isError ? (
          <div className="p-6 text-sm text-red-700 bg-red-50">
            Failed to load orders. Please refresh the page.
          </div>
        ) : isLoading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-[#EDE8E0]" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <ShoppingCart className="h-12 w-12 text-[#C4956A]/50 mb-4" />
            <p className="font-semibold text-[#3D1A0A]">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[#EDE8E0] bg-[#F7F3EE]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Order</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Items</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Payment</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE8E0]">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#F7F3EE] transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#3D1A0A]">{order.orderNumber}</p>
                    </td>
                    <td className="px-4 py-3 text-[#A0673A]">{order.items.length}</td>
                    <td className="px-4 py-3 font-medium text-[#3D1A0A]">₹{order.totalAmount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-[#5C2E1A] text-xs">{order.paymentMethod?.replace("_", " ") ?? "—"}</p>
                        <p className={cn("text-xs font-medium",
                          order.paymentStatus === "SUCCESS" ? "text-emerald-700" :
                          order.paymentStatus === "FAILED" ? "text-red-600" : "text-[#A0673A]"
                        )}>
                          {order.paymentStatus ?? "—"}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", STATUS_STYLES[order.status])}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#A0673A] text-xs">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${order.id}`}
                        className="text-xs text-[#C4956A] hover:underline font-medium">
                        Manage →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
            className="rounded-full border border-[#D6CCBF] bg-white p-2 text-[#5C2E1A] disabled:opacity-40 hover:border-[#C4956A] transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-[#A0673A]">{page + 1} / {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
            className="rounded-full border border-[#D6CCBF] bg-white p-2 text-[#5C2E1A] disabled:opacity-40 hover:border-[#C4956A] transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
