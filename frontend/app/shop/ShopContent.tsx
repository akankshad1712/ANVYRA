"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { productsService } from "@/services/products.service";
import { categoriesService } from "@/services/categories.service";
import Container from "@/components/common/Container";
import ProductCard from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/common/Loading";
import EmptyState from "@/components/common/EmptyState";
import {
  Package, ChevronLeft, ChevronRight,
  SlidersHorizontal, X, Search, ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Price ranges ─────────────────────────────────────────────────────────────
const PRICE_RANGES = [
  { label: "Under ₹1,000",    min: undefined,  max: "999"  },
  { label: "₹1,000 – ₹2,500", min: "1000",     max: "2500" },
  { label: "₹2,500 – ₹5,000", min: "2500",     max: "5000" },
  { label: "₹5,000+",         min: "5000",     max: undefined },
];

const SORT_OPTIONS = [
  { value: "newest",     label: "Newest First"    },
  { value: "price-asc",  label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
];

export default function ShopContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const pathname     = usePathname();

  const [page,         setPage]         = useState(0);
  const [drawerOpen,   setDrawerOpen]   = useState(false);
  const [mounted,      setMounted]      = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // ── URL params ──────────────────────────────────────────────────────────────
  const categoryIdParam = searchParams.get("categoryId");
  const q               = searchParams.get("q");
  const minPrice        = searchParams.get("minPrice");
  const maxPrice        = searchParams.get("maxPrice");
  const sortParam       = searchParams.get("sort");

  useEffect(() => { setPage(0); }, [categoryIdParam, q, minPrice, maxPrice, sortParam]);

  // ── Data fetching ───────────────────────────────────────────────────────────
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesService.getAll,
    staleTime: 5 * 60 * 1000,
  });

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
      page, size: 20,
      categoryId: resolvedCategoryId,
      q:          q ?? undefined,
      minPrice:   minPrice ? Number(minPrice) : undefined,
      maxPrice:   maxPrice ? Number(maxPrice) : undefined,
      sortBy, sortDir,
    }),
  });

  const products      = data?.content ?? [];
  const totalPages    = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;
  const selectedCategory = categories.find((c) => c.id === resolvedCategoryId);
  const hasActiveFilters = !!(categoryIdParam || q || minPrice || maxPrice);
  const activeFilterCount = [categoryIdParam, minPrice || maxPrice].filter(Boolean).length;

  // ── URL helpers ─────────────────────────────────────────────────────────────
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

  // ── Sidebar content (shared between desktop + mobile drawer) ────────────────
  const SidebarContent = () => (
    <div className="space-y-8">

      {/* Categories */}
      <div>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#A0673A]">
          Category
        </p>
        <div className="space-y-0.5">
          <a
            href="/shop"
            onClick={() => setDrawerOpen(false)}
            className={cn(
              "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              !categoryIdParam
                ? "bg-[#1C0A04] text-[#F7F3EE]"
                : "text-[#5C2E1A] hover:bg-[#EDE8E0]"
            )}
          >
            <span>All Products</span>
            {!categoryIdParam && (
              <span className="text-xs text-[#C4956A]">{totalElements}</span>
            )}
          </a>
          {mounted && categories.map((cat) => (
            <a
              key={cat.id}
              href={buildHref({ categoryId: String(cat.id), minPrice: undefined, maxPrice: undefined })}
              onClick={() => setDrawerOpen(false)}
              className={cn(
                "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                String(cat.id) === categoryIdParam
                  ? "bg-[#1C0A04] text-[#F7F3EE]"
                  : "text-[#5C2E1A] hover:bg-[#EDE8E0]"
              )}
            >
              <span>{cat.name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#D6CCBF]" />

      {/* Price */}
      <div>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#A0673A]">
          Price Range
        </p>
        <div className="space-y-0.5">
          {PRICE_RANGES.map((range) => {
            const isActive =
              (minPrice ?? "") === (range.min ?? "") &&
              (maxPrice ?? "") === (range.max ?? "");
            const href = isActive
              ? buildHref({ minPrice: undefined, maxPrice: undefined })
              : buildHref({ minPrice: range.min, maxPrice: range.max });
            return (
              <a
                key={range.label}
                href={href}
                onClick={() => setDrawerOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  isActive
                    ? "bg-[#EDE8E0] font-semibold text-[#1C0A04]"
                    : "text-[#5C2E1A] hover:bg-[#EDE8E0]"
                )}
              >
                {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#C4956A]" />}
                {range.label}
              </a>
            );
          })}
        </div>
      </div>

      {/* Clear filters */}
      {hasActiveFilters && (
        <>
          <div className="h-px bg-[#D6CCBF]" />
          <a
            href="/shop"
            onClick={() => setDrawerOpen(false)}
            className="flex items-center gap-2 text-sm font-medium text-[#A0673A] hover:text-[#5C2E1A] transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            Clear all filters
          </a>
        </>
      )}
    </div>
  );

  return (
    <main className="min-h-screen bg-[#F7F3EE]">

      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <div className="border-b border-[#D6CCBF] bg-white">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-4 py-5">

            {/* Title + count */}
            <div>
              <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#1C0A04] sm:text-3xl">
                {q
                  ? `Results for "${q}"`
                  : selectedCategory?.name ?? "All Products"}
              </h1>
              {!isLoading && (
                <p className="mt-0.5 text-sm text-[#A0673A]">
                  {totalElements.toLocaleString()} product{totalElements !== 1 ? "s" : ""}
                </p>
              )}
            </div>

            {/* Controls row */}
            <div className="flex items-center gap-3">

              {/* Active filter pills */}
              {hasActiveFilters && (
                <div className="hidden items-center gap-2 sm:flex">
                  {categoryIdParam && selectedCategory && (
                    <span className="flex items-center gap-1.5 rounded-full border border-[#D6CCBF] bg-[#F7F3EE] px-3 py-1 text-xs font-medium text-[#5C2E1A]">
                      {selectedCategory.name}
                      <a href={buildHref({ categoryId: undefined })} className="text-[#A0673A] hover:text-[#5C2E1A]">
                        <X className="h-3 w-3" />
                      </a>
                    </span>
                  )}
                  {(minPrice || maxPrice) && (
                    <span className="flex items-center gap-1.5 rounded-full border border-[#D6CCBF] bg-[#F7F3EE] px-3 py-1 text-xs font-medium text-[#5C2E1A]">
                      {PRICE_RANGES.find(
                        (r) => (r.min ?? "") === (minPrice ?? "") && (r.max ?? "") === (maxPrice ?? "")
                      )?.label ?? "Price filter"}
                      <a href={buildHref({ minPrice: undefined, maxPrice: undefined })} className="text-[#A0673A] hover:text-[#5C2E1A]">
                        <X className="h-3 w-3" />
                      </a>
                    </span>
                  )}
                </div>
              )}

              {/* Sort dropdown */}
              <div className="relative">
                <select
                  value={sortParam ?? "newest"}
                  onChange={(e) => router.push(buildHref({ sort: e.target.value }))}
                  className="appearance-none rounded-xl border border-[#D6CCBF] bg-white py-2 pl-3 pr-8 text-sm text-[#5C2E1A] focus:border-[#C4956A] focus:outline-none cursor-pointer"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#A0673A]" />
              </div>

              {/* Filter button (mobile) */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-[#D6CCBF] bg-white px-3 py-2 text-sm font-medium text-[#5C2E1A] hover:border-[#C4956A] transition-colors lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1C0A04] text-[10px] font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </Container>
      </div>

      <Container>
        <div className="flex gap-8 py-8">

          {/* ── Desktop sidebar ─────────────────────────────────────────────── */}
          <aside className="hidden w-56 flex-shrink-0 lg:block">
            <div className="sticky top-24 rounded-2xl border border-[#D6CCBF] bg-white p-5">
              <SidebarContent />
            </div>
          </aside>

          {/* ── Product grid ─────────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Error banner */}
            {isError && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                Failed to load products. Please check your connection and try again.
              </div>
            )}

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
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                  {products.map((p, i) => (
                    <ProductCard key={p.id} product={p} priority={i < 4} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="flex items-center gap-1 rounded-full border border-[#D6CCBF] bg-white px-4 py-2 text-sm text-[#5C2E1A] disabled:opacity-40 hover:border-[#C4956A] transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" /> Prev
                    </button>

                    {/* Page numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                            p === page
                              ? "bg-[#1C0A04] text-[#F7F3EE]"
                              : "border border-[#D6CCBF] bg-white text-[#5C2E1A] hover:border-[#C4956A]"
                          )}
                        >
                          {p + 1}
                        </button>
                      ))}
                    </div>

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

      {/* ── Mobile filter drawer ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-[#1C0A04]/50 backdrop-blur-sm"
              onClick={() => setDrawerOpen(false)}
            />

            {/* Drawer panel */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-white shadow-2xl"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between border-b border-[#D6CCBF] px-5 py-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-[#C4956A]" />
                  <span className="font-semibold text-[#1C0A04]">Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="rounded-full bg-[#1C0A04] px-2 py-0.5 text-[10px] font-bold text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-lg p-1.5 text-[#A0673A] hover:bg-[#EDE8E0] hover:text-[#5C2E1A] transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer content */}
              <div className="p-5">
                <SidebarContent />
              </div>

              {/* Drawer footer */}
              <div className="border-t border-[#D6CCBF] p-4">
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-full rounded-full bg-[#1C0A04] py-3 text-sm font-semibold text-[#F7F3EE] transition hover:bg-[#3D1A0A]"
                >
                  Show {totalElements} Results
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
