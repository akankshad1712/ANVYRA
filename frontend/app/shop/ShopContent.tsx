"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
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
  const router       = useRouter();
  const pathname     = usePathname();

  const [page, setPage]               = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  // Prevent hydration mismatch: categories come from API (client-only)
  const [mounted, setMounted]         = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Read URL params
  const categoryIdParam = searchParams.get("categoryId");
  const q               = searchParams.get("q");
  const minPrice        = searchParams.get("minPrice");
  const maxPrice        = searchParams.get("maxPrice");
  const sortParam       = searchParams.get("sort");

  // Reset page to 0 whenever any filter/search param changes
  useEffect(() => {
    setPage(0);
  }, [categoryIdParam, q, minPrice, maxPrice, sortParam]);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesService.getAll,
    staleTime: 5 * 60 * 1000,
  });

  // Resolve categoryId — supports ?categoryId=3 (numeric) from sidebar/navbar
  const resolvedCategoryId = categoryIdParam ? Number(categoryIdParam) : undefined;

  const getSortConfig = () => {
    if (sortParam === "price-asc")  return { sortBy: "price",     sortDir: "asc"  as const };
    if (sortParam === "price-desc") return { sortBy: "price",     sortDir: "desc" as const };
    return                                 { sortBy: "createdAt", sortDir: "desc" as const };
  };
  const { sortBy, sortDir } = getSortConfig();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", { page, categoryIdParam, q, minPrice, maxPrice, sortBy, sortDir }],
    queryFn: () => productsService.getAll({
      page,
      size: 20,
      categoryId: resolvedCategoryId,
      q:          q ?? undefined,
      minPrice:   minPrice ? Number(minPrice) : undefined,
      maxPrice:   maxPrice ? Number(maxPrice) : undefined,
      sortBy,
      sortDir,
    }),
  });

  const products      = data?.content ?? [];
  const totalPages    = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  const selectedCategory = categories.find((c) => c.id === resolvedCategoryId);
  const hasActiveFilters = !!(categoryIdParam || q || minPrice || maxPrice);

  // ── helper: build href preserving current filters ─────────────────────────
  const buildHref = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged: Record<string, string | undefined> = {
      categoryId: categoryIdParam ?? undefined,
      q:          q ?? undefined,
      minPrice:   minPrice ?? undefined,
      maxPrice:   maxPrice ?? undefined,
      sort:       sortParam ?? undefined,
      ...overrides,
    };
    for (const [key, val] of Object.entries(merged)) {
      if (val !== undefined) params.set(key, val);
    }
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const filterBtnCls = (active: boolean) => cn(
    "block w-full text-left rounded-lg px-3 py-2 text-sm transition-colors",
    active
      ? "bg-[#5C2E1A] text-[#F7F3EE] font-semibold"
      : "text-[#5C2E1A] hover:bg-[#EDE8E0]"
  );

  return (
    <main className="min-h-screen bg-[#F7F3EE] py-8">
      <Container>
        {/* ── Page header ──────────────────────────────────────── */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[#1C0A04] sm:text-4xl">
              {q
                ? `Results for "${q}"`
                : selectedCategory?.name ?? "All Products"}
            </h1>
            {totalElements > 0 && (
              <p className="mt-1 text-sm text-[#A0673A]">{totalElements.toLocaleString()} products</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <select
              value={sortParam ?? "newest"}
              onChange={(e) => router.push(buildHref({ sort: e.target.value }))}
              className="rounded-lg border border-[#D6CCBF] bg-white px-3 py-2 text-sm text-[#5C2E1A] focus:border-[#C4956A] focus:outline-none"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 rounded-lg border border-[#D6CCBF] bg-white px-3 py-2 text-sm text-[#5C2E1A] hover:border-[#C4956A] transition-colors sm:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#5C2E1A] text-[10px] font-bold text-[#F7F3EE]">
                  !
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── Error banner ─────────────────────────────────────── */}
        {isError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Failed to load products. Please check your connection and try again.
          </div>
        )}

        <div className="flex gap-8">
          {/* ── Sidebar ──────────────────────────────────────────── */}
          <aside
            className={cn(
              "w-56 flex-shrink-0 hidden sm:block",
              showFilters && "!block"
            )}
          >
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <div>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#A0673A]">
                  Categories
                </h3>
                <div className="space-y-0.5">
                  <a href="/shop" className={filterBtnCls(!categoryIdParam)}>
                    All Products
                  </a>
                  {mounted && categories.map((cat) => (
                    <a
                      key={cat.id}
                      href={buildHref({ categoryId: String(cat.id), minPrice: undefined, maxPrice: undefined })}
                      className={filterBtnCls(String(cat.id) === categoryIdParam)}
                    >
                      {cat.name}
                    </a>
                  ))}
                </div>
              </div>

              {/* Price ranges */}
              <div>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#A0673A]">
                  Price
                </h3>
                <div className="space-y-0.5">
                  {[
                    { label: "Under ₹1,000",    min: undefined, max: "999"  },
                    { label: "₹1,000 – ₹2,500", min: "1000",    max: "2500" },
                    { label: "₹2,500 – ₹5,000", min: "2500",    max: "5000" },
                    { label: "₹5,000+",          min: "5000",    max: undefined },
                  ].map((range) => {
                    const isActive =
                      (minPrice ?? "") === (range.min ?? "") &&
                      (maxPrice ?? "") === (range.max ?? "");
                    const href = isActive
                      ? buildHref({ minPrice: undefined, maxPrice: undefined })
                      : buildHref({ minPrice: range.min, maxPrice: range.max });
                    return (
                      <a key={range.label} href={href} className={filterBtnCls(isActive)}>
                        {range.label}
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Clear filters */}
              {hasActiveFilters && (
                <a
                  href="/shop"
                  className="flex items-center gap-1.5 text-sm font-medium text-[#A0673A] hover:text-[#5C2E1A] transition-colors"
                >
                  <X className="h-3.5 w-3.5" /> Clear all filters
                </a>
              )}
            </div>
          </aside>

          {/* ── Product grid ─────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <ProductGridSkeleton count={20} />
            ) : products.length === 0 ? (
              <EmptyState
                icon={<Package className="h-12 w-12" />}
                title="No products found"
                description={
                  q
                    ? `No results for "${q}". Try a different search term.`
                    : "No products match your filters."
                }
                action={{ label: "Clear filters", href: "/shop" }}
              />
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
                  {products.map((p, i) => (
                    <ProductCard key={p.id} product={p} priority={i < 4} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-3">
                    <button
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="flex items-center gap-1 rounded-full border border-[#D6CCBF] bg-white px-4 py-2 text-sm text-[#5C2E1A] disabled:opacity-40 hover:border-[#C4956A] transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" /> Previous
                    </button>
                    <span className="px-4 text-sm text-[#A0673A]">
                      {page + 1} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                      disabled={page >= totalPages - 1}
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
