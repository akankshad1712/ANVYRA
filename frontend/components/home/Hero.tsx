"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Background image */}
      <Image
        src="/hero/hero-desktop.png"
        alt="ANVYRA — Dress the Story"
        fill
        priority
        className="object-cover"
      />
      {/* Warm dark overlay — deep brown, not cold black */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1C0A04]/80 via-[#3D1A0A]/55 to-transparent" />

      {/* Hero content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">

            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xs font-semibold uppercase tracking-[0.4em] text-[#C4956A]"
            >
              Dress the Story
            </motion.p>

            {/* Logo wordmark */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-5"
            >
              <Image
                src="/logos/anvyra-logo-white.png"
                alt="ANVYRA"
                width={280}
                height={88}
                className="h-16 w-auto object-contain sm:h-20 lg:h-24"
                priority
              />
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#C4956A]/80"
            >
              Founded by Akanksha Deshmukh · Pune, 2025
            </motion.p>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.52 }}
              className="mt-5 max-w-lg text-lg leading-relaxed text-[#F7F3EE]/80"
            >
              Premium Indian fashion crafted for those who wear their identity
              with intention. Every piece built for legacy.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link
                href="/shop"
                className="group flex items-center gap-2 rounded-full bg-[#C4956A] px-8 py-4 font-semibold text-[#1C0A04] transition hover:bg-[#D4AF8C] hover:shadow-lg hover:shadow-[#C4956A]/30 hover:-translate-y-0.5"
              >
                Shop Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/about"
                className="rounded-full border border-[#C4956A]/70 px-8 py-4 font-semibold text-[#F7F3EE] backdrop-blur-sm transition hover:border-[#C4956A] hover:bg-[#3D1A0A]/40"
              >
                Our Story
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom fade to cream */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F7F3EE]/30 to-transparent" />
    </section>
  );
}
