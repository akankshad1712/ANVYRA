"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { productsService } from "@/services/products.service";
import { categoriesService } from "@/services/categories.service";
import Container from "@/components/common/Container";
import ProductCard from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/common/Loading";
import EmptyState from "@/components/common/EmptyState";
import { Package, ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ShopContent() {
  const searchParams = useSearchParams();
  const [page, setPage]           = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const categoryId = searchParams.get("categoryId");
  const q          = searchParams.get("q");
  const minPrice   = searchParams.get("minPrice");
  const maxPrice   = searchParams.get("maxPrice");
  const sortParam  = searchParams.get("sort");

  const getSortConfig = () => {
    if (sortParam === "price-asc")  return { sortBy: "price",     sortDir: "asc"  as const };
    if (sortParam === "price-desc") return { sortBy: "price",     sortDir: "desc" as const };
    return                                 { sortBy: "createdAt", sortDir: "desc" as const };
  };
  const { sortBy, sortDir } = getSortConfig();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesService.getAll,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", { page, categoryId, q, minPrice, maxPrice, sortBy, sortDir }],
    queryFn: () => productsService.getAll({
      page, size: 20,
      categoryId: categoryId ? Number(categoryId) : undefined,
      q: q ?? undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sortBy, sortDir,
    }),
  });

  const products        = data?.content ?? [];
  const totalPages      = data?.totalPages ?? 0;
  const totalElements   = data?.totalElements ?? 0;
  const selectedCategory= categories?.find((c) => c.id === Number(categoryId));
  const hasActiveFilters= !!(categoryId || q || minPrice || maxPrice);

  const filterBtnCls = (active: boolean) => cn(
    "block rounded-lg px-3 py-2 text-sm transition-colors",
    active
      ? "bg-[#5C2E1A] text-[#F7F3EE] font-medium"
      : "text-[#5C2E1A] hover:bg-[#EDE8E0]"
  );

  return (
    <main className="py-8 bg-[#F7F3EE]">
      <Container>
        {/* Page header */}
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[#1C0A04] sm:text-4xl">
              {q ? `Results for "${q}"` : selectedCategory?.name ?? "All Products"}
            </h1>
            {totalElements > 0 && (
              <p className="mt-1 text-sm text-[#A0673A]">{totalElements} products</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <select
              defaultValue={sortParam ?? "newest"}
              onChange={(e) => {
                const url = new URL(window.location.href);
                url.searchParams.set("sort", e.target.value);
                window.location.href = url.toString();
              }}
              className="rounded-lg border border-[#D6CCBF] bg-white px-3 py-2 text-sm text-[#5C2E1A] focus:border-[#C4956A] focus:outline-none"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 rounded-lg border border-[#D6CCBF] bg-white px-3 py-2 text-sm text-[#5C2E1A] hover:border-[#C4956A] transition-colors sm:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* API error banner */}
          {isError && (
            <div className="mb-4 w-full rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Failed to load products. Please check your connection and try again.
            </div>
          )}
          {/* Sidebar */}
          <aside className={cn(
            "w-56 flex-shrink-0 hidden sm:block",
            showFilters && "!block"
          )}>
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Categories</h3>
                <div className="space-y-1">
                  <a href="/shop" className={filterBtnCls(!categoryId)}>All Products</a>
                  {categories?.map((cat) => (
                    <a key={cat.id} href={`/shop?categoryId=${cat.id}`} className={filterBtnCls(String(cat.id) === categoryId)}>
                      {cat.name}
                    </a>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Price</h3>
                <div className="space-y-1">
                  {[
                    { label: "Under ₹1,000",      min: undefined, max: 999  },
                    { label: "₹1,000 – ₹2,500",   min: 1000,      max: 2500 },
                    { label: "₹2,500 – ₹5,000",   min: 2500,      max: 5000 },
                    { label: "₹5,000+",            min: 5000,      max: undefined },
                  ].map((range) => {
                    const isActive = String(minPrice ?? "") === String(range.min ?? "") &&
                                     String(maxPrice ?? "") === String(range.max ?? "");
                    const href = (() => {
                      const url = new URL(window.location.href);
                      if (range.min) url.searchParams.set("minPrice", String(range.min));
                      else url.searchParams.delete("minPrice");
                      if (range.max) url.searchParams.set("maxPrice", String(range.max));
                      else url.searchParams.delete("maxPrice");
                      return url.pathname + url.search;
                    })();
                    return <a key={range.label} href={isActive ? "/shop" : href} className={filterBtnCls(isActive)}>{range.label}</a>;
                  })}
                </div>
              </div>

              {hasActiveFilters && (
                <a href="/shop" className="flex items-center gap-1.5 text-sm font-medium text-[#A0673A] hover:text-[#5C2E1A] transition-colors">
                  <X className="h-3.5 w-3.5" /> Clear all filters
                </a>
              )}
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <ProductGridSkeleton count={20} />
            ) : products.length === 0 ? (
              <EmptyState
                icon={<Package className="h-12 w-12" />}
                title="No products found"
                description={q ? `No results for "${q}". Try a different search term.` : "No products match your filters."}
                action={{ label: "Clear filters", href: "/shop" }}
              />
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
                  {products.map((p, i) => (
                    <ProductCard key={p.id} product={p} priority={i < 4} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-3">
                    <button
                      onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
                      className="flex items-center gap-1 rounded-full border border-[#D6CCBF] bg-white px-4 py-2 text-sm text-[#5C2E1A] disabled:opacity-40 hover:border-[#C4956A] transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" /> Previous
                    </button>
                    <span className="px-4 text-sm text-[#A0673A]">{page + 1} / {totalPages}</span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                      className="flex items-center gap-1 rounded-full border border-[#D6CCBF] bg-white px-4 py-2 text-sm text-[#5C2E1A] disabled:opacity-40 hover:border-[#C4956A] transition-colors"
                    >
                      Next <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}
