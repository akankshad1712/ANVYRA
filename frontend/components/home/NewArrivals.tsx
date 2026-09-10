"use client";

import { useQuery } from "@tanstack/react-query";
import { productsService } from "@/services/products.service";
import Container from "@/components/common/Container";
import SectionTitle from "@/components/common/SectionTitle";
import ProductCard from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/common/Loading";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NewArrivals() {
  const { data, isLoading } = useQuery({
    queryKey: ["products", "new-arrivals"],
    queryFn: () => productsService.getNewArrivals(0, 4),
  });

  const products = data?.content ?? [];

  return (
    <section className="bg-zinc-50 py-20 lg:py-28">
      <Container>
        <div className="flex items-end justify-between mb-12">
          <SectionTitle
            eyebrow="Just Landed"
            title="New Arrivals"
            align="left"
          />
          <Link
            href="/shop?sort=newest"
            className="hidden items-center gap-2 text-sm font-semibold text-zinc-700 hover:text-zinc-950 transition sm:flex"
          >
            See all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
