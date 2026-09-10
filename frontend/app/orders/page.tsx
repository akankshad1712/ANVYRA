"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ordersService } from "@/services/orders.service";
import { useAuthStore } from "@/store/auth.store";
import Container from "@/components/common/Container";
import EmptyState from "@/components/common/EmptyState";
import { PageLoader } from "@/components/common/Loading";
import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
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

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => ordersService.getMyOrders(0, 20),
    enabled: isAuthenticated,
  });

  if (authLoading || isLoading) return <PageLoader />;

  const orders = data?.content ?? [];

  return (
    <main className="py-10">
      <Container className="max-w-3xl">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold mb-8">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <EmptyState
            icon={<Package className="h-12 w-12" />}
            title="No orders yet"
            description="Once you place an order it'll appear here."
            action={{ label: "Start Shopping", href: "/shop" }}
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="flex items-center gap-4 rounded-2xl border border-zinc-100 p-5 hover:border-zinc-300 transition group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="font-semibold text-sm">{order.orderNumber}</p>
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", STATUS_STYLES[order.status])}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""} ·{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold">₹{order.totalAmount.toLocaleString()}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900 transition flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
