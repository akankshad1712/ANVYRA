"use client";

import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import StatCard from "@/components/admin/StatCard";
import { cn } from "@/lib/utils";
import {
  Package, ShoppingCart, Users, AlertTriangle,
  TrendingUp, CheckCircle, XCircle, Clock,
  Boxes, Tag,
} from "lucide-react";
import Link from "next/link";
import type { OrderStatus } from "@/types";

const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING:    "bg-amber-100 text-amber-800",
  CONFIRMED:  "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED:    "bg-indigo-100 text-indigo-800",
  DELIVERED:  "bg-emerald-100 text-emerald-800",
  CANCELLED:  "bg-red-100 text-red-800",
  REFUNDED:   "bg-[#EDE8E0] text-[#5C2E1A]",
};

function StatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-24 animate-pulse rounded-2xl bg-[#EDE8E0]" />
      ))}
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: adminService.getDashboardStats,
    refetchInterval: 60_000,   // refresh every minute
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#1C0A04]">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-[#A0673A]">
          Overview of your ANVYRA store
        </p>
      </div>

      {isError && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Failed to load dashboard stats. Please refresh or check your connection.
        </div>
      )}

      {isLoading ? (
        <StatsSkeleton />
      ) : stats ? (
        <>
          {/* Stats grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Products"   value={stats.totalProducts}   icon={Package}      accent="bronze" />
            <StatCard title="Active Products"  value={stats.activeProducts}  icon={CheckCircle}  accent="green"  />
            <StatCard title="Total Orders"     value={stats.totalOrders}     icon={ShoppingCart} accent="brown"  />
            <StatCard title="Pending Orders"   value={stats.pendingOrders}   icon={Clock}        accent="amber"  />
            <StatCard title="Delivered"        value={stats.deliveredOrders} icon={TrendingUp}   accent="green"  />
            <StatCard title="Cancelled"        value={stats.cancelledOrders} icon={XCircle}      accent="red"    />
            <StatCard title="Customers"        value={stats.totalCustomers}  icon={Users}        accent="bronze" />
            <StatCard title="Low Stock"        value={stats.lowStockProducts} icon={AlertTriangle} accent="amber"
              sub={stats.outOfStockProducts > 0 ? `${stats.outOfStockProducts} out of stock` : undefined}
            />
          </div>

          {/* Revenue */}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#D6CCBF] bg-white p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-[#A0673A]">Revenue (Shipped + Delivered)</p>
              <p className="mt-1 text-3xl font-bold text-[#1C0A04]">
                ₹{Number(stats.totalRevenue).toLocaleString("en-IN")}
              </p>
              <p className="mt-1 text-xs text-[#A0673A]">
                {stats.shippedOrders + stats.deliveredOrders} fulfilled orders
              </p>
            </div>
            <div className="rounded-2xl border border-[#D6CCBF] bg-white p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-[#A0673A]">Categories</p>
              <p className="mt-1 text-3xl font-bold text-[#1C0A04]">{stats.totalCategories}</p>
              <Link href="/admin/categories" className="mt-1 text-xs text-[#C4956A] hover:underline">
                Manage categories →
              </Link>
            </div>
          </div>

          {/* Recent orders */}
          {stats.recentOrders.length > 0 && (
            <section className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-[#1C0A04]">Recent Orders</h2>
                <Link href="/admin/orders" className="text-sm text-[#C4956A] hover:underline">View all</Link>
              </div>
              <div className="rounded-2xl border border-[#D6CCBF] bg-white overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-[#EDE8E0] bg-[#F7F3EE]">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Order</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Items</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Total</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EDE8E0]">
                      {stats.recentOrders.slice(0, 8).map((order) => (
                        <tr key={order.id} className="hover:bg-[#F7F3EE] transition-colors">
                          <td className="px-4 py-3">
                            <Link href={`/admin/orders/${order.id}`} className="font-medium text-[#5C2E1A] hover:underline">
                              {order.orderNumber}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-[#A0673A]">{order.items.length}</td>
                          <td className="px-4 py-3 font-medium text-[#3D1A0A]">₹{order.totalAmount.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", ORDER_STATUS_STYLES[order.status])}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[#A0673A]">
                            {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* Recent users */}
          {stats.recentUsers.length > 0 && (
            <section className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-[#1C0A04]">Recent Customers</h2>
                <Link href="/admin/users" className="text-sm text-[#C4956A] hover:underline">View all</Link>
              </div>
              <div className="rounded-2xl border border-[#D6CCBF] bg-white overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-[#EDE8E0] bg-[#F7F3EE]">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Role</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EDE8E0]">
                      {stats.recentUsers.slice(0, 6).map((u) => (
                        <tr key={u.id} className="hover:bg-[#F7F3EE] transition-colors">
                          <td className="px-4 py-3 font-medium text-[#3D1A0A]">{u.firstName} {u.lastName}</td>
                          <td className="px-4 py-3 text-[#A0673A]">{u.email}</td>
                          <td className="px-4 py-3">
                            <span className={cn(
                              "rounded-full px-2.5 py-0.5 text-xs font-medium",
                              u.role === "ADMIN" ? "bg-[#C4956A]/20 text-[#5C2E1A]" : "bg-[#EDE8E0] text-[#A0673A]"
                            )}>{u.role}</span>
                          </td>
                          <td className="px-4 py-3 text-[#A0673A]">
                            {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}
        </>
      ) : null}
    </div>
  );
}
