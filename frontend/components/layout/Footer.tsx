"use client";

import Link from "next/link";
import { Globe, Share2, Rss } from "lucide-react";

const SHOP_LINKS = [
  { label: "Men", href: "/shop?category=men" },
  { label: "Women", href: "/shop?category=women" },
  { label: "Shoes", href: "/shop?category=shoes" },
  { label: "Accessories", href: "/shop?category=accessories" },
  { label: "New Arrivals", href: "/shop?sort=newest" },
  { label: "Best Sellers", href: "/shop?sort=popular" },
];

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Careers", href: "/careers" },
  { label: "Press", href: "/press" },
];

const SUPPORT_LINKS = [
  { label: "Shipping & Returns", href: "/shipping" },
  { label: "Size Guide", href: "/size-guide" },
  { label: "Track Order", href: "/orders" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold tracking-[0.3em] text-white"
            >
              ANVYRA
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-400">
              Built For Legacy. Premium fashion and lifestyle crafted for people
              who value timeless design, premium quality and enduring confidence.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="rounded-full p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
              >
                <Globe className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="rounded-full p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
              >
                <Share2 className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="rounded-full p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
              >
                <Rss className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-300">
              Shop
            </h3>
            <ul className="space-y-3">
              {SHOP_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-zinc-400 transition hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-300">
              Company
            </h3>
            <ul className="space-y-3">
              {COMPANY_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-zinc-400 transition hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support + Newsletter */}
          <div className="space-y-8">
            <div>
              <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-300">
                Support
              </h3>
              <ul className="space-y-3">
                {SUPPORT_LINKS.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-zinc-400 transition hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-300">
                Newsletter
              </h3>
              <p className="mb-3 text-xs text-zinc-500">
                Early access to new collections & exclusive offers.
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex gap-2"
              >
                <input
                  type="email"
                  placeholder="your@email.com"
                  aria-label="Email for newsletter"
                  className="flex-1 min-w-0 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200"
                >
                  Join
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-8 sm:flex-row">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} ANVYRA. All rights reserved.
          </p>
          <p className="text-xs text-zinc-600">
            Built For Legacy.
          </p>
        </div>
      </div>
    </footer>
  );
}
