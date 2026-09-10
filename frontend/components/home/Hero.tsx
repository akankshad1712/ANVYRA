"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Background */}
      <Image
        src="/hero/hero-desktop.jpg"
        alt="ANVYRA — Built For Legacy"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xs font-semibold uppercase tracking-[0.4em] text-[#d4af37]"
            >
              Built For Legacy
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-4 font-[family-name:var(--font-space-grotesk)] text-6xl font-bold leading-none tracking-tight text-white sm:text-7xl lg:text-8xl"
            >
              ANVYRA
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-6 max-w-lg text-lg leading-relaxed text-white/80"
            >
              Luxury streetwear crafted for people who value timeless design,
              premium quality, and enduring confidence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link
                href="/shop"
                className="group flex items-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-black transition hover:bg-zinc-100"
              >
                Shop Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/shop?featured=true"
                className="rounded-full border border-white/70 px-8 py-4 font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
              >
                View Collections
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/20 to-transparent" />
    </section>
  );
}
