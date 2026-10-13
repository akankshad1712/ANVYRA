import { cn } from "@/lib/utils";
import Image from "next/image";

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner({ className, size = "md" }: LoadingProps) {
  const sizeClass = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-10 w-10" }[size];
  return (
    <svg
      className={cn("animate-spin text-current", sizeClass, className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
    </svg>
  );
}

// ── Product card skeleton ─────────────────────────────────────────────────────
export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="aspect-product w-full rounded-2xl skeleton" />
      <div className="space-y-2 px-0.5">
        <div className="h-2.5 w-16 rounded skeleton" />
        <div className="h-4 w-full rounded skeleton" />
        <div className="h-4 w-3/4 rounded skeleton" />
        <div className="h-4 w-1/3 rounded skeleton" />
      </div>
    </div>
  );
}

// ── Product grid skeleton ─────────────────────────────────────────────────────
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ── Page loader ───────────────────────────────────────────────────────────────
export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
      {/* Animated logo mark */}
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 rounded-full border-2 border-[#EDE8E0]" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#C4956A]" />
        <div className="absolute inset-2 flex items-center justify-center rounded-full bg-[#F7F3EE]">
          <Image
            src="/logos/anvyra-badge.png"
            alt="ANVYRA"
            width={28}
            height={28}
            className="h-7 w-7 object-contain opacity-80"
          />
        </div>
      </div>
      <div className="text-center">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-[#C4956A]">
          Loading
        </p>
      </div>
    </div>
  );
}

// ── Inline content skeleton ───────────────────────────────────────────────────
export function TextSkeleton({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded skeleton"
          style={{ width: i === lines - 1 ? "60%" : "100%" }}
        />
      ))}
    </div>
  );
}
