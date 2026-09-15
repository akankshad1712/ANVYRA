"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { categoriesService } from "@/services/categories.service";
import { useToast } from "@/providers/toast-provider";
import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { ProductGridSkeleton } from "@/components/common/Loading";
import Link from "next/link";
import Image from "next/image";
import {
  Plus, Search, ChevronLeft, ChevronRight,
  Pencil, Trash2, Package,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminProductsPage() {
  const qc = useQueryClient();
  const { success, error: showError } = useToast();

  const [search,     setSearch]     = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [active,     setActive]     = useState<boolean | undefined>();
  const [page,       setPage]       = useState(0);
  const [deleteId,   setDeleteId]   = useState<number | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "products", { search, categoryId, active, page }],
    queryFn: () => adminService.listAllProducts({ search: search || undefined, categoryId, active, page, size: 20 }),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminService.deleteProduct(id),
    onSuccess: () => {
      success("Product deleted");
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      setDeleteId(null);
    },
    onError: (e: any) => { showError(e.message ?? "Failed to delete"); setDeleteId(null); },
  });

  const products = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div>
      <AdminBreadcrumb crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Products" }]} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#1C0A04]">Products</h1>
          <p className="text-sm text-[#A0673A] mt-0.5">{data?.totalElements ?? 0} total products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-full bg-[#5C2E1A] px-4 py-2.5 text-sm font-semibold text-[#F7F3EE] hover:bg-[#3D1A0A] transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Product
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A0673A]" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search products…"
            className="w-full rounded-lg border border-[#D6CCBF] bg-white pl-9 pr-4 py-2 text-sm text-[#3D1A0A] focus:border-[#C4956A] focus:outline-none"
          />
        </div>
        <select
          value={categoryId ?? ""}
          onChange={(e) => { setCategoryId(e.target.value ? Number(e.target.value) : undefined); setPage(0); }}
          className="rounded-lg border border-[#D6CCBF] bg-white px-3 py-2 text-sm text-[#5C2E1A] focus:border-[#C4956A] focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select
          value={active === undefined ? "" : String(active)}
          onChange={(e) => { setActive(e.target.value === "" ? undefined : e.target.value === "true"); setPage(0); }}
          className="rounded-lg border border-[#D6CCBF] bg-white px-3 py-2 text-sm text-[#5C2E1A] focus:border-[#C4956A] focus:outline-none"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[#D6CCBF] bg-white overflow-hidden">
        {isError ? (
          <div className="p-6 text-sm text-red-700 bg-red-50 rounded-2xl border border-red-200">
            Failed to load products. Please refresh the page.
          </div>
        ) : isLoading ? (
          <div className="p-6"><ProductGridSkeleton count={8} /></div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <Package className="h-12 w-12 text-[#C4956A]/50 mb-4" />
            <p className="font-semibold text-[#3D1A0A]">No products found</p>
            <p className="text-sm text-[#A0673A] mt-1">Try adjusting your filters or add a new product.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[#EDE8E0] bg-[#F7F3EE]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE8E0]">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F7F3EE] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-[#EDE8E0]">
                          {p.images?.[0] && (
                            <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-[#3D1A0A] line-clamp-1">{p.name}</p>
                          <p className="text-xs text-[#A0673A]">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#A0673A]">{p.category?.name ?? "—"}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#3D1A0A]">₹{p.effectivePrice.toLocaleString()}</p>
                      {p.discountPrice > 0 && <p className="text-xs text-[#A0673A] line-through">₹{p.price.toLocaleString()}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        p.quantity === 0 ? "bg-red-100 text-red-700" :
                        p.quantity <= 5 ? "bg-amber-100 text-amber-700" :
                        "bg-emerald-100 text-emerald-700"
                      )}>
                        {p.quantity === 0 ? "Out of stock" : p.quantity <= 5 ? `Low (${p.quantity})` : p.quantity}
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
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/products/${p.id}`}
                          className="rounded-lg p-1.5 text-[#A0673A] hover:bg-[#EDE8E0] hover:text-[#5C2E1A] transition-colors"
                          aria-label={`Edit ${p.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteId(p.id)}
                          className="rounded-lg p-1.5 text-[#A0673A] hover:bg-red-50 hover:text-red-600 transition-colors"
                          aria-label={`Delete ${p.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
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

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Product"
        description="This will permanently remove the product. Orders referencing it will retain a snapshot. This action cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => deleteId !== null && deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
