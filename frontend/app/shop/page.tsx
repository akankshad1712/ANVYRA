import { Suspense } from "react";
import ShopContent from "./ShopContent";
import { ProductGridSkeleton } from "@/components/common/Loading";

export const metadata = {
  title: "Shop",
  description: "Browse ANVYRA's premium fashion and lifestyle collection.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="py-10"><div className="mx-auto max-w-7xl px-4"><ProductGridSkeleton count={20} /></div></div>}>
      <ShopContent />
    </Suspense>
  );
}
