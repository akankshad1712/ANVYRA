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
  PENDING:    "bg-amber-100 text-amber-800",
  CONFIRMED:  "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED:    "bg-indigo-100 text-indigo-800",
  DELIVERED:  "bg-emerald-100 text-emerald-800",
  CANCELLED:  "bg-red-100 text-red-800",
  REFUNDED:   "bg-[#EDE8E0] text-[#5C2E1A]",
};

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: () => ordersService.getMyOrders(0, 20),
    enabled: isAuthenticated,
  });

  if (authLoading || isLoading) return <PageLoader />;

  const orders = data?.content ?? [];

  return (
    <main className="py-10 bg-[#F7F3EE]">
      <Container className="max-w-3xl">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[#1C0A04] mb-8">
          My Orders
        </h1>

        {isError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Failed to load orders. Please refresh the page.
          </div>
        )}

        {!isError && orders.length === 0 ? (
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
                className="flex items-center gap-4 rounded-2xl border border-[#D6CCBF] bg-white p-5 hover:border-[#C4956A] transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="font-semibold text-sm text-[#3D1A0A]">{order.orderNumber}</p>
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", STATUS_STYLES[order.status])}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#A0673A] mt-1">
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""} ·{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-[#3D1A0A]">₹{order.totalAmount.toLocaleString()}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-[#A0673A] group-hover:text-[#5C2E1A] transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
