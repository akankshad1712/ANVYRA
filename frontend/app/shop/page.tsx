import { Suspense } from "react";
import type { Metadata } from "next";
import ShopContent from "./ShopContent";
import { ProductGridSkeleton } from "@/components/common/Loading";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop ANVYRA's premium collection — jackets, oversized tees, shirts, trousers and jeans. Premium Indian fashion by Akanksha Deshmukh.",
};

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="py-10 bg-[#F7F3EE]">
          <div className="mx-auto max-w-7xl px-4">
            <ProductGridSkeleton count={20} />
          </div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
