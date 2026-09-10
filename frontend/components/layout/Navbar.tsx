"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Search, Heart, ShoppingBag, User, Menu, X, ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  {
    label: "Men",
    href: "/shop?category=men",
    sub: ["T-Shirts", "Hoodies", "Trousers", "Jackets"],
  },
  {
    label: "Women",
    href: "/shop?category=women",
    sub: ["Tops", "Dresses", "Trousers", "Outerwear"],
  },
  { label: "Shoes", href: "/shop?category=shoes", sub: [] },
  { label: "Oversized", href: "/shop?category=oversized", sub: [] },
  { label: "Accessories", href: "/shop?category=accessories", sub: [] },
  { label: "Collections", href: "/shop", sub: [] },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthenticated, user, logout } = useAuthStore();
  const { cart, toggleCart } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();

  const cartCount = cart?.totalItems ?? 0;
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQ.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQ.trim())}`);
      setSearchOpen(false);
      setSearchQ("");
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const isHomePage = pathname === "/";
  const transparent = isHomePage && !scrolled && !mobileOpen;

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          transparent
            ? "bg-black/80 backdrop-blur-md"
            : "border-b border-zinc-200 bg-white shadow-sm"
        )}
      >
        {/* Search bar overlay */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "absolute inset-x-0 top-full border-b py-4 px-6 z-50",
                transparent
                  ? "bg-black/95 border-zinc-800"
                  : "bg-white border-zinc-200"
              )}
            >
              <form onSubmit={handleSearch} className="mx-auto flex max-w-2xl items-center gap-3">
                <Search className={cn("h-5 w-5 shrink-0", transparent ? "text-zinc-400" : "text-zinc-500")} />
                <input
                  ref={searchRef}
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder="Search products, brands…"
                  className={cn(
                    "flex-1 bg-transparent text-base outline-none placeholder:text-zinc-400",
                    transparent ? "text-white" : "text-zinc-900"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className={transparent ? "text-zinc-400 hover:text-white" : "text-zinc-400 hover:text-zinc-900"}
                >
                  <X className="h-5 w-5" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 py-4">
          {/* Logo */}
          <Link
            href="/"
            className={cn(
              "font-[family-name:var(--font-space-grotesk)] text-2xl font-bold tracking-[0.3em] transition-colors",
              transparent ? "text-white" : "text-zinc-950"
            )}
          >
            ANVYRA
          </Link>

          {/* Desktop menu */}
          <div className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.sub.length > 0 && setActiveMenu(link.label)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium transition-colors",
                    transparent
                      ? "text-white/90 hover:text-white"
                      : "text-zinc-700 hover:text-zinc-950"
                  )}
                >
                  {link.label}
                  {link.sub.length > 0 && (
                    <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                  )}
                </Link>

                {/* Mega-mini dropdown */}
                <AnimatePresence>
                  {activeMenu === link.label && link.sub.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full mt-2 min-w-[160px] rounded-xl border border-zinc-200 bg-white p-2 shadow-xl"
                    >
                      {link.sub.map((sub) => (
                        <Link
                          key={sub}
                          href={`${link.href}&subcategory=${sub.toLowerCase()}`}
                          className="block rounded-lg px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
                        >
                          {sub}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
              className={cn(
                "rounded-full p-2 transition-colors",
                transparent
                  ? "text-white hover:bg-white/10"
                  : "text-zinc-700 hover:bg-zinc-100"
              )}
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              aria-label={`Wishlist (${wishlistCount})`}
              className={cn(
                "relative rounded-full p-2 transition-colors",
                transparent
                  ? "text-white hover:bg-white/10"
                  : "text-zinc-700 hover:bg-zinc-100"
              )}
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* Account */}
            {isAuthenticated ? (
              <div className="relative group">
                <button
                  aria-label="Account"
                  className={cn(
                    "rounded-full p-2 transition-colors",
                    transparent
                      ? "text-white hover:bg-white/10"
                      : "text-zinc-700 hover:bg-zinc-100"
                  )}
                >
                  <User className="h-5 w-5" />
                </button>
                <div className="absolute right-0 top-full mt-1 hidden w-48 rounded-xl border border-zinc-200 bg-white p-2 shadow-xl group-hover:block">
                  <p className="px-3 py-1.5 text-xs text-zinc-400 truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <hr className="my-1 border-zinc-100" />
                  <Link href="/account" className="block rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50">My Account</Link>
                  <Link href="/orders" className="block rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50">Orders</Link>
                  <Link href="/wishlist" className="block rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50">Wishlist</Link>
                  <hr className="my-1 border-zinc-100" />
                  <button
                    onClick={handleLogout}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                aria-label="Sign in"
                className={cn(
                  "rounded-full p-2 transition-colors",
                  transparent
                    ? "text-white hover:bg-white/10"
                    : "text-zinc-700 hover:bg-zinc-100"
                )}
              >
                <User className="h-5 w-5" />
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={toggleCart}
              aria-label={`Cart (${cartCount})`}
              className={cn(
                "relative rounded-full p-2 transition-colors",
                transparent
                  ? "text-white hover:bg-white/10"
                  : "text-zinc-700 hover:bg-zinc-100"
              )}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className={cn(
                "rounded-full p-2 transition-colors lg:hidden",
                transparent
                  ? "text-white hover:bg-white/10"
                  : "text-zinc-700 hover:bg-zinc-100"
              )}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-zinc-800 bg-black lg:hidden"
            >
              <div className="px-6 py-6 space-y-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="block rounded-lg px-4 py-3 text-base font-medium text-white hover:bg-white/10 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-zinc-800 space-y-1">
                  {isAuthenticated ? (
                    <>
                      <Link href="/account" className="block rounded-lg px-4 py-3 text-base text-white hover:bg-white/10">My Account</Link>
                      <Link href="/orders" className="block rounded-lg px-4 py-3 text-base text-white hover:bg-white/10">Orders</Link>
                      <button onClick={handleLogout} className="block w-full rounded-lg px-4 py-3 text-left text-base text-red-400 hover:bg-white/10">Sign out</button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="block rounded-lg px-4 py-3 text-base text-white hover:bg-white/10">Sign in</Link>
                      <Link href="/register" className="block rounded-lg px-4 py-3 text-base text-white hover:bg-white/10">Create account</Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
