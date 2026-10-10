import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "ANVYRA FASHION — Founded by Akanksha Deshmukh in Pune, 2025. Learn the story behind the brand built for legacy.",
};

const values = [
  {
    title: "Premium Quality",
    description:
      "Every piece is crafted with intention. We use premium fabrics, precise cuts, and finishing that speaks before you do.",
    icon: "✦",
  },
  {
    title: "Timeless Design",
    description:
      "ANVYRA doesn't chase trends. We build pieces that belong in your wardrobe for years — not just one season.",
    icon: "◈",
  },
  {
    title: "Built for Legacy",
    description:
      "This brand was built to last. Every collection, every stitch, every pixel — designed with the long game in mind.",
    icon: "◉",
  },
  {
    title: "Founder-Built",
    description:
      "ANVYRA was not built by a committee. One founder, one vision — Akanksha Deshmukh — designed, engineered, and launched this from zero.",
    icon: "▸",
  },
];

const collections = [
  { name: "Jackets",             desc: "Premium outerwear for every season",        href: "/shop?categoryId=1" },
  { name: "Oversized T-Shirts",  desc: "Relaxed heavyweight streetwear essentials", href: "/shop?categoryId=2" },
  { name: "Shirts",              desc: "Crisp wovens and soft jerseys",             href: "/shop?categoryId=3" },
  { name: "Trousers",            desc: "Tailored drape meets all-day wearability",  href: "/shop?categoryId=4" },
  { name: "Straight-fit Jeans",  desc: "Classic denim, uncompromised",             href: "/shop?categoryId=5" },
];

export default function AboutPage() {
  return (
    <main className="bg-[#F7F3EE]">

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#1C0A04] py-32 text-center">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/logos/Gold_on_Black.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="relative mx-auto max-w-3xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#C4956A]">
            Est. 2025 · Pune, India
          </p>
          <h1 className="mt-6 font-[family-name:var(--font-space-grotesk)] text-5xl font-bold text-[#F7F3EE] sm:text-6xl">
            Dress the Story
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[#C4956A]/80">
            ANVYRA is not just a fashion brand. It is a statement —
            built for those who wear their identity with intention.
          </p>
        </div>
      </section>

      {/* ── Brand Story ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-6 py-24">
        <div className="grid gap-16 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#A0673A]">
              The Story
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[#1C0A04]">
              One founder.<br />One vision.<br />One brand.
            </h2>
            <p className="mt-6 leading-relaxed text-[#5C2E1A]">
              ANVYRA was founded in 2025 by <strong>Akanksha Deshmukh</strong> in Pune,
              Maharashtra. What started as a belief — that Indian fashion deserves
              to compete at the highest level — became a full-stack e-commerce platform,
              a product catalog, and a brand identity built entirely from scratch.
            </p>
            <p className="mt-4 leading-relaxed text-[#5C2E1A]">
              Every line of code, every product, every design decision was made by
              one person with one goal: build something that lasts.
            </p>
            <p className="mt-4 font-semibold text-[#1C0A04] italic">
              "Built For Legacy."
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-72 w-72 overflow-hidden rounded-2xl bg-[#1C0A04] p-8 shadow-2xl">
              <Image
                src="/logos/anvyra-logo-gold.png"
                alt="ANVYRA"
                fill
                className="object-contain p-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────────────── */}
      <section className="bg-[#1C0A04] py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C4956A]">
              What We Stand For
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[#F7F3EE]">
              Our Values
            </h2>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-[#5C2E1A] p-6">
                <span className="text-2xl text-[#C4956A]">{v.icon}</span>
                <h3 className="mt-4 font-semibold text-[#F7F3EE]">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#A0673A]">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Collections ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-6 py-24">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#A0673A]">
            What We Make
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[#1C0A04]">
            Our Collections
          </h2>
        </div>
        <div className="mt-12 divide-y divide-[#D6CCBF]">
          {collections.map((c) => (
            <Link
              key={c.name}
              href={c.href}
              className="group flex items-center justify-between py-5 transition-colors hover:text-[#C4956A]"
            >
              <div>
                <h3 className="font-semibold text-[#1C0A04] group-hover:text-[#C4956A] transition-colors">
                  {c.name}
                </h3>
                <p className="text-sm text-[#A0673A]">{c.desc}</p>
              </div>
              <span className="text-[#C4956A] opacity-0 transition-opacity group-hover:opacity-100">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Founder ───────────────────────────────────────────────── */}
      <section className="bg-[#EDE8E0] py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#A0673A]">
            The Founder
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[#1C0A04]">
            Akanksha Deshmukh
          </h2>
          <p className="mt-2 text-sm font-medium uppercase tracking-wider text-[#A0673A]">
            Founder · Brand Architect · Full Stack Engineer
          </p>
          <p className="mt-6 leading-relaxed text-[#5C2E1A]">
            Akanksha designed the brand identity, built the entire frontend and
            backend from scratch, configured the cloud infrastructure, and
            launched ANVYRA as a production platform — all independently, from
            Pune, Maharashtra.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="https://www.linkedin.com/in/akanksha-deshmukh-26210b244/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#0A66C2] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0A66C2]/90"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/akankshad1712"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#181717] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#181717]/90"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="py-24 text-center">
        <div className="mx-auto max-w-xl px-6">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[#1C0A04]">
            Ready to Dress the Story?
          </h2>
          <p className="mt-4 text-[#5C2E1A]">
            Explore our latest collections — premium fashion crafted for those
            who move with intention.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-block rounded-full bg-[#5C2E1A] px-10 py-4 font-semibold text-[#F7F3EE] transition hover:bg-[#3D1A0A]"
          >
            Shop Now
          </Link>
        </div>
      </section>

    </main>
  );
}
