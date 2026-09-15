"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";
import Link from "next/link";
import { Search, Boxes, ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function AdminInventoryPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");
  const [page, setPage]     = useState(0);

  const activeFilter = filter === "all" ? undefined : filter === "out" ? false : undefined;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "inventory", { search, filter, page }],
    queryFn: () => adminService.listAllProducts({
      search: search || undefined,
      // Pass active=false for out-of-stock view; otherwise list all
      active: activeFilter,
      page,
      size: 30,
      sortBy: "quantity",
      sortDir: "asc",
    }),
  });

  const allProducts  = data?.content ?? [];
  const totalPages   = data?.totalPages ?? 0;

  // Client-side stock filter after fetch
  const products = allProducts.filter((p) => {
    if (filter === "out") return p.quantity === 0;
    if (filter === "low") return p.quantity > 0 && p.quantity <= 5;
    return true;
  });

  const stockLabel = (qty: number) => {
    if (qty === 0) return { text: "Out of Stock", cls: "bg-red-100 text-red-700" };
    if (qty <= 5)  return { text: `Low (${qty})`, cls: "bg-amber-100 text-amber-700" };
    return { text: String(qty), cls: "bg-emerald-100 text-emerald-700" };
  };

  return (
    <div>
      <AdminBreadcrumb crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Inventory" }]} />

      <div className="mb-6">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#1C0A04]">Inventory</h1>
        <p className="text-sm text-[#A0673A] mt-0.5">Real-time stock view. Edit products to update quantities.</p>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A0673A]" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search products…"
            className="w-full rounded-lg border border-[#D6CCBF] bg-white pl-9 pr-4 py-2 text-sm text-[#3D1A0A] focus:border-[#C4956A] focus:outline-none" />
        </div>
        {(["all", "low", "out"] as const).map((f) => (
          <button key={f} onClick={() => { setFilter(f); setPage(0); }}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              filter === f
                ? "border-[#5C2E1A] bg-[#5C2E1A] text-[#F7F3EE]"
                : "border-[#D6CCBF] bg-white text-[#5C2E1A] hover:border-[#C4956A]"
            )}>
            {f === "all" ? "All" : f === "low" ? "Low Stock (≤5)" : "Out of Stock"}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-[#D6CCBF] bg-white overflow-hidden">
        {isError ? (
          <div className="p-6 text-sm text-red-700 bg-red-50">
            Failed to load inventory. Please refresh the page.
          </div>
        ) : isLoading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-[#EDE8E0]" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <Boxes className="h-12 w-12 text-[#C4956A]/50 mb-4" />
            <p className="font-semibold text-[#3D1A0A]">No products match this filter</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[#EDE8E0] bg-[#F7F3EE]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Sizes</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE8E0]">
                {products.map((p) => {
                  const stock = stockLabel(p.quantity);
                  return (
                    <tr key={p.id} className="hover:bg-[#F7F3EE] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-[#EDE8E0]">
                            {p.images?.[0] && <Image src={p.images[0]} alt={p.name} fill className="object-cover" />}
                          </div>
                          <div>
                            <p className="font-medium text-[#3D1A0A] line-clamp-1">{p.name}</p>
                            <p className="text-xs text-[#A0673A]">{p.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#A0673A]">{p.category?.name ?? "—"}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {p.sizes?.length ? p.sizes.map((s) => (
                            <span key={s} className="rounded bg-[#EDE8E0] px-1.5 py-0.5 text-xs text-[#5C2E1A]">{s}</span>
                          )) : <span className="text-[#A0673A] text-xs">—</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", stock.cls)}>
                          {stock.text}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "rounded-full px-2.5 py-0.5 text-xs font-medium",
                          p.active ? "bg-emerald-100 text-emerald-700" : "bg-[#EDE8E0] text-[#A0673A]"
                        )}>
                          {p.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/products/${p.id}`}
                          className="rounded-lg p-1.5 inline-flex text-[#A0673A] hover:bg-[#EDE8E0] hover:text-[#5C2E1A] transition-colors"
                          aria-label={`Edit ${p.name}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
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
