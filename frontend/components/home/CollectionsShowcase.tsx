"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── All real local images mapped per category ───────────────────────────────
const COLLECTIONS = [
  {
    id: "jackets",
    name: "Jackets",
    label: "Outerwear",
    tagline: "Built for the bold",
    description: "Structured silhouettes. Refined cuts. Jackets that command any room.",
    href: "/shop?category=jackets",
    accent: "#1C0A04",
    featured: "/collections/Jackets/black.png",
    variants: [
      { color: "Obsidian", src: "/collections/Jackets/black.png" },
      { color: "Cobalt",   src: "/collections/Jackets/blue.png" },
      { color: "Ivory",    src: "/collections/Jackets/white.png" },
    ],
    span: "col-span-2 row-span-2", // large hero card
  },
  {
    id: "oversize",
    name: "Oversized",
    label: "Streetwear",
    tagline: "Ease in every thread",
    description: "Relaxed fits with premium weight. Comfort that doesn't compromise.",
    href: "/shop?category=oversized",
    accent: "#3D1A0A",
    featured: "/collections/oversize/oversize_grey.png",
    variants: [
      { color: "Onyx",   src: "/collections/oversize/oversize_black.png" },
      { color: "Ash",    src: "/collections/oversize/oversize_grey.png" },
      { color: "Cloud",  src: "/collections/oversize/oversize_white.png" },
    ],
    span: "col-span-1 row-span-1",
  },
  {
    id: "shirts",
    name: "Shirts",
    label: "Essentials",
    tagline: "The foundation of every outfit",
    description: "Crisp wovens and soft jerseys for effortless everyday wear.",
    href: "/shop?category=shirts",
    accent: "#5C2E1A",
    featured: "/collections/shirt/shirt_black.png",
    variants: [
      { color: "Midnight", src: "/collections/shirt/shirt_black.png" },
      { color: "Sky",      src: "/collections/shirt/shirt_b.png" },
      { color: "Pearl",    src: "/collections/shirt/shirt_white.png" },
    ],
    span: "col-span-1 row-span-1",
  },
  {
    id: "trousers",
    name: "Trousers",
    label: "Bottoms",
    tagline: "Move with precision",
    description: "Tailored drape meets all-day wearability. Every occasion covered.",
    href: "/shop?category=trousers",
    accent: "#7A3F20",
    featured: "/collections/trousers/trouser_blue.png",
    variants: [
      { color: "Coal",  src: "/collections/trousers/trouser_black.png" },
      { color: "Slate", src: "/collections/trousers/trouser_blue.png" },
      { color: "Blush", src: "/collections/trousers/trouser_pink.png" },
      { color: "White", src: "/collections/trousers/trouser_white.png" },
    ],
    span: "col-span-1 row-span-2",
  },
  {
    id: "jeans",
    name: "Straight-fit Jeans",
    label: "Denim",
    tagline: "Classic. Uncompromised.",
    description: "Straight-cut denim with premium weight fabric for a clean, timeless look.",
    href: "/shop?category=jeans",
    accent: "#2C4A6E",
    featured: "/collections/Straight-fit%20Jeans/Straight-fit%20Jeans_blue.png",
    variants: [
      { color: "Raw",   src: "/collections/Straight-fit%20Jeans/Straight-fit%20Jeans_blue.png" },
      { color: "Faded", src: "/collections/Straight-fit%20Jeans/Straight-fit%20Jeans_black.png" },
    ],
    span: "col-span-1 row-span-1",
  },
] as const;

// ─── Individual Collection Card ───────────────────────────────────────────────
function CollectionCard({
  collection,
  index,
  isHero = false,
}: {
  collection: (typeof COLLECTIONS)[number];
  index: number;
  isHero?: boolean;
}) {
  const [activeVariant, setActiveVariant] = useState(0);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={cn("relative group rounded-[2rem] overflow-hidden cursor-pointer", collection.span)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={collection.href} className="block w-full h-full">
        {/* Base image */}
        <div className={cn("relative w-full overflow-hidden bg-[#EDE8E0]", isHero ? "h-full min-h-[540px]" : "h-[320px] sm:h-[380px]")}>
          <motion.div
            animate={{ scale: hovered ? 1.06 : 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={collection.variants[activeVariant].src}
              alt={`${collection.name} – ${collection.variants[activeVariant].color}`}
              fill
              className="object-cover object-center"
              sizes={isHero ? "(max-width:768px) 100vw, 50vw" : "(max-width:768px) 100vw, 33vw"}
              priority={index < 2}
            />
          </motion.div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0403]/85 via-[#1C0A04]/30 to-transparent" />

          {/* Top badge */}
          <div className="absolute top-5 left-5 z-10">
            <span className="inline-block rounded-full bg-[#F7F3EE]/15 backdrop-blur-md border border-[#F7F3EE]/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#F7F3EE]">
              {collection.label}
            </span>
          </div>

          {/* Arrow icon top-right */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 8, y: hovered ? 0 : -8 }}
            transition={{ duration: 0.3 }}
            className="absolute top-5 right-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#C4956A] text-[#1C0A04]"
          >
            <ArrowUpRight className="h-5 w-5" />
          </motion.div>

          {/* Bottom content */}
          <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
            {/* Tagline */}
            <motion.p
              animate={{ opacity: hovered ? 1 : 0.7, y: hovered ? 0 : 4 }}
              transition={{ duration: 0.35 }}
              className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C4956A] mb-1"
            >
              {collection.tagline}
            </motion.p>

            {/* Name */}
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#F7F3EE] leading-tight">
              {collection.name}
            </h3>

            {/* Description — visible on hover */}
            <motion.p
              animate={{ opacity: hovered ? 1 : 0, height: hovered ? "auto" : 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="mt-2 text-sm text-[#F7F3EE]/75 leading-relaxed overflow-hidden"
            >
              {collection.description}
            </motion.p>

            {/* Color swatches + CTA row */}
            <div className="mt-4 flex items-center justify-between">
              {/* Color dots */}
              <div className="flex items-center gap-2">
                {collection.variants.map((v, vi) => (
                  <button
                    key={v.color}
                    onClick={(e) => { e.preventDefault(); setActiveVariant(vi); }}
                    aria-label={v.color}
                    className={cn(
                      "h-5 w-5 rounded-full border-2 transition-all duration-200 overflow-hidden relative",
                      vi === activeVariant ? "border-[#C4956A] scale-110" : "border-[#F7F3EE]/40 hover:border-[#F7F3EE]/80"
                    )}
                  >
                    <Image src={v.src} alt={v.color} fill className="object-cover" sizes="20px" />
                  </button>
                ))}
                <span className="ml-1 text-xs text-[#F7F3EE]/60">
                  {collection.variants[activeVariant].color}
                </span>
              </div>

              {/* Shop link */}
              <motion.span
                animate={{ opacity: hovered ? 1 : 0.6 }}
                className="flex items-center gap-1 text-xs font-semibold text-[#C4956A]"
              >
                Shop <ArrowRight className="h-3 w-3" />
              </motion.span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Horizontal strip for small "all colours" row ────────────────────────────
function ColorStrip() {
  const allVariants = COLLECTIONS.flatMap((c) => c.variants.map((v) => ({ ...v, cat: c.name })));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-8 flex flex-wrap gap-3 justify-center"
    >
      {allVariants.map((v, i) => (
        <div
          key={i}
          className="group relative h-14 w-10 rounded-xl overflow-hidden border border-[#EDE8E0] hover:border-[#C4956A] transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#C4956A]/20"
          title={`${v.cat} — ${v.color}`}
        >
          <Image src={v.src} alt={`${v.cat} ${v.color}`} fill className="object-cover" sizes="40px" />
          {/* Tooltip */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block whitespace-nowrap rounded-md bg-[#1C0A04] px-2 py-1 text-[9px] text-[#F7F3EE] z-20">
            {v.color}
          </div>
        </div>
      ))}
    </motion.div>
  );
}

// ─── Parallax number ticker ───────────────────────────────────────────────────
function StatTicker({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold text-[#1C0A04]">{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#A0673A]">{label}</p>
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────
export default function CollectionsShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-36 overflow-hidden bg-[#F7F3EE]">

      {/* Subtle background grain texture layer */}
      <motion.div
        style={{ y: bgY }}
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        aria-hidden
      >
        <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')] bg-repeat" />
      </motion.div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="mb-16 flex flex-col items-center text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#A0673A]"
          >
            The Collection
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 font-[family-name:var(--font-space-grotesk)] text-5xl font-bold tracking-tight text-[#1C0A04] sm:text-6xl lg:text-7xl"
          >
            Dress the
            <br />
            <span className="text-[#C4956A]">Story.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 max-w-md text-base leading-relaxed text-[#7A4A2A]"
          >
            Six categories. Endless expression. Every piece designed for the
            person who knows exactly who they are.
          </motion.p>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 h-px w-24 bg-gradient-to-r from-transparent via-[#C4956A] to-transparent"
          />
        </div>

        {/* ── Bento Grid ──────────────────────────────────────────────────── */}
        {/* Row 1: Hero jacket (2×2) + oversized + shirts */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 auto-rows-auto">

          {/* Hero card — Jackets (2 cols × 2 rows on lg) */}
          <div className="sm:col-span-2 lg:col-span-2 lg:row-span-2">
            <CollectionCard collection={COLLECTIONS[0]} index={0} isHero />
          </div>

          {/* Oversized */}
          <div className="lg:col-span-1 lg:row-span-1">
            <CollectionCard collection={COLLECTIONS[1]} index={1} />
          </div>

          {/* Shirts */}
          <div className="lg:col-span-1 lg:row-span-1">
            <CollectionCard collection={COLLECTIONS[2]} index={2} />
          </div>

          {/* Trousers — tall card (1 col × 2 rows) */}
          <div className="lg:col-span-1 lg:row-span-2 sm:col-span-1">
            <CollectionCard collection={COLLECTIONS[3]} index={3} />
          </div>

          {/* Jeans */}
          <div className="lg:col-span-1 lg:row-span-1">
            <CollectionCard collection={COLLECTIONS[4]} index={4} />
          </div>
        </div>

        {/* ── All Colours Strip ────────────────────────────────────────────── */}
        <div className="mt-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-[10px] font-bold uppercase tracking-[0.35em] text-[#A0673A] mb-4"
          >
            Every colour in the collection
          </motion.p>
          <ColorStrip />
        </div>

        {/* ── Stats Row ────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-20 grid grid-cols-2 gap-8 border-t border-[#D4C9BC] pt-10 sm:grid-cols-4"
        >
          <StatTicker value="6" label="Collections" />
          <StatTicker value="16+" label="Colourways" />
          <StatTicker value="100%" label="Premium Quality" />
          <StatTicker value="∞" label="Your Style" />
        </motion.div>

        {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-14 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link
            href="/shop"
            className="group flex items-center gap-2 rounded-full bg-[#1C0A04] px-10 py-4 text-sm font-bold text-[#F7F3EE] transition-all duration-300 hover:bg-[#3D1A0A] hover:shadow-xl hover:shadow-[#1C0A04]/20 hover:-translate-y-0.5"
          >
            Shop All Collections
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/shop?featured=true"
            className="flex items-center gap-2 rounded-full border border-[#C4956A]/60 px-10 py-4 text-sm font-bold text-[#5C2E1A] transition-all duration-300 hover:border-[#C4956A] hover:bg-[#C4956A]/10"
          >
            View Featured Picks
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
