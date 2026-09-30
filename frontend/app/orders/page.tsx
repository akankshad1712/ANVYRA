"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ordersService } from "@/services/orders.service";
import { useAuthStore } from "@/store/auth.store";
import Container from "@/components/common/Container";
import EmptyState from "@/components/common/EmptyState";
import { PageLoader } from "@/components/common/Loading";
import Link from "next/link";
import { Package, ChevronRight, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const STATUS_STYLES: Record<OrderStatus, { pill: string; dot: string }> = {
  PENDING:    { pill: "bg-amber-100  text-amber-800",    dot: "bg-amber-400"   },
  CONFIRMED:  { pill: "bg-blue-100   text-blue-800",     dot: "bg-blue-400"    },
  PROCESSING: { pill: "bg-purple-100 text-purple-800",   dot: "bg-purple-400"  },
  SHIPPED:    { pill: "bg-indigo-100 text-indigo-800",   dot: "bg-indigo-400"  },
  DELIVERED:  { pill: "bg-emerald-100 text-emerald-800", dot: "bg-emerald-400" },
  CANCELLED:  { pill: "bg-red-100    text-red-800",      dot: "bg-red-400"     },
  REFUNDED:   { pill: "bg-[#EDE8E0]  text-[#5C2E1A]",   dot: "bg-[#A0673A]"   },
};

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login?from=/orders");
  }, [isAuthenticated, authLoading, router]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: () => ordersService.getMyOrders(0, 50),
    enabled: isAuthenticated,
  });

  if (authLoading || isLoading) return <PageLoader />;

  const orders = data?.content ?? [];

  return (
    <main className="min-h-screen bg-[#F7F3EE] py-8 lg:py-12">
      <Container className="max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#A0673A]">Account</p>
          <h1 className="mt-2 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[#1C0A04] lg:text-4xl">
            My Orders
          </h1>
          {orders.length > 0 && (
            <p className="mt-1 text-sm text-[#A0673A]">{orders.length} order{orders.length !== 1 ? "s" : ""} total</p>
          )}
        </motion.div>

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
          <div className="space-y-3">
            {orders.map((order, i) => {
              const style = STATUS_STYLES[order.status];
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.04 }}
                >
                  <Link
                    href={`/orders/${order.id}`}
                    className="group flex items-center gap-4 rounded-2xl border border-[#D6CCBF] bg-white p-5 shadow-sm hover:border-[#C4956A] hover:shadow-md transition-all duration-200"
                  >
                    {/* Icon */}
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#EDE8E0] group-hover:bg-[#E8DDD4] transition-colors">
                      <ShoppingBag className="h-5 w-5 text-[#5C2E1A]" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-sm text-[#1C0A04]">{order.orderNumber}</p>
                        <span className={cn(
                          "flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                          style.pill
                        )}>
                          <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
                          {order.status}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-[#A0673A]">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""} ·{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                    </div>

                    {/* Amount */}
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-[#1C0A04]">₹{order.totalAmount.toLocaleString()}</p>
                    </div>

                    <ChevronRight className="h-4 w-4 text-[#A0673A] group-hover:text-[#5C2E1A] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </Container>
    </main>
  );
}


