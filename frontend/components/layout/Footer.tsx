"use client";

import Link from "next/link";
import Image from "next/image";
import { Globe, Share2, Rss } from "lucide-react";

const SHOP_LINKS = [
  { label: "Men",          href: "/shop?category=men" },
  { label: "Women",        href: "/shop?category=women" },
  { label: "Shoes",        href: "/shop?category=shoes" },
  { label: "Accessories",  href: "/shop?category=accessories" },
  { label: "New Arrivals", href: "/shop?sort=newest" },
  { label: "Best Sellers", href: "/shop?sort=popular" },
];

const COMPANY_LINKS = [
  { label: "About",   href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Careers", href: "/careers" },
  { label: "Press",   href: "/press" },
];

const SUPPORT_LINKS = [
  { label: "Shipping & Returns", href: "/shipping" },
  { label: "Size Guide",         href: "/size-guide" },
  { label: "Track Order",        href: "/orders" },
  { label: "Privacy Policy",     href: "/privacy" },
  { label: "Terms of Service",   href: "/terms" },
];

export default function Footer() {
  return (
    /* Warm dark espresso — NOT cold zinc/black */
    <footer className="border-t border-[#5C2E1A]/40 bg-[#1C0A04] text-[#F7F3EE]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-5">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" aria-label="ANVYRA – home">
              <Image
                src="/logos/anvyra-logo-white.png"
                alt="ANVYRA"
                width={140}
                height={44}
                className="h-10 w-auto object-contain"
              />
            </Link>
            {/* Tagline */}
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#C4956A]">
              Style Meets You
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#C4956A]/70">
              Premium fashion and lifestyle crafted for people who value timeless
              design, quality, and enduring confidence.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { href: "https://instagram.com", label: "Instagram", icon: <Globe  className="h-4 w-4" /> },
                { href: "https://twitter.com",   label: "Twitter",   icon: <Share2 className="h-4 w-4" /> },
                { href: "https://youtube.com",   label: "YouTube",   icon: <Rss    className="h-4 w-4" /> },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#5C2E1A] text-[#C4956A] transition hover:border-[#C4956A] hover:bg-[#3D1A0A] hover:text-[#F7F3EE]"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#C4956A]">
              Shop
            </h3>
            <ul className="space-y-3">
              {SHOP_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-[#D4AF8C] transition hover:text-[#F7F3EE]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#C4956A]">
              Company
            </h3>
            <ul className="space-y-3">
              {COMPANY_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-[#D4AF8C] transition hover:text-[#F7F3EE]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support + Newsletter */}
          <div className="space-y-8">
            <div>
              <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#C4956A]">
                Support
              </h3>
              <ul className="space-y-3">
                {SUPPORT_LINKS.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-[#D4AF8C] transition hover:text-[#F7F3EE]">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#C4956A]">
                Newsletter
              </h3>
              <p className="mb-3 text-xs text-[#A0673A]">
                Early access to new collections &amp; exclusive offers.
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  aria-label="Email for newsletter"
                  className="flex-1 min-w-0 rounded-lg border border-[#5C2E1A] bg-[#3D1A0A] px-3 py-2 text-sm text-[#F7F3EE] placeholder:text-[#A0673A] focus:border-[#C4956A] focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-[#C4956A] px-4 py-2 text-sm font-semibold text-[#1C0A04] transition hover:bg-[#D4AF8C]"
                >
                  Join
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[#5C2E1A]/40 pt-8 sm:flex-row">
          <p className="text-xs text-[#A0673A]">
            © {new Date().getFullYear()} ANVYRA. All rights reserved.
          </p>
          <p className="text-xs tracking-[0.2em] text-[#C4956A] uppercase">
            Style Meets You
          </p>
        </div>
      </div>
    </footer>
  );
}
