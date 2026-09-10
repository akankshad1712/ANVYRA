"use client";

import { useQuery } from "@tanstack/react-query";
import { categoriesService } from "@/services/categories.service";
import Container from "@/components/common/Container";
import SectionTitle from "@/components/common/SectionTitle";
import Link from "next/link";
import { motion } from "framer-motion";
import FadeIn from "@/components/animation/FadeIn";

export default function CategoryGrid() {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesService.getAll,
  });

  const featured = categories.slice(0, 6);

  return (
    <section className="py-20 lg:py-28">
      <Container>
        <SectionTitle
          eyebrow="Explore"
          title="Shop by Category"
          subtitle="Find exactly what you're looking for"
          className="mb-12"
        />

        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
          {featured.map((cat, i) => (
            <FadeIn key={cat.id} delay={i * 0.1}>
              <Link
                href={`/shop?categoryId=${cat.id}`}
                className="group relative block aspect-square overflow-hidden rounded-2xl bg-zinc-100"
              >
                {cat.imageUrl && (
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-white">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="mt-1 text-sm text-white/80 line-clamp-2">
                      {cat.description}
                    </p>
                  )}
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
