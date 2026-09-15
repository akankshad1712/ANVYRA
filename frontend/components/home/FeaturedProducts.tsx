"use client";

import { useQuery } from "@tanstack/react-query";
import { productsService } from "@/services/products.service";
import Container from "@/components/common/Container";
import SectionTitle from "@/components/common/SectionTitle";
import ProductCard from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/common/Loading";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FeaturedProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => productsService.getFeatured(0, 8),
  });

  const products = data?.content ?? [];

  return (
    <section className="py-20 lg:py-28 bg-[#F7F3EE]">
      <Container>
        <SectionTitle
          eyebrow="Curated Selection"
          title="Featured Products"
          subtitle="Handpicked pieces that define premium style"
          className="mb-12"
        />

        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} priority={i < 4} />
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-[#5C2E1A] px-8 py-4 font-semibold text-[#F7F3EE] transition hover:bg-[#3D1A0A]"
              >
                View All Products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </>
        )}
      </Container>
    </section>
  );
}
