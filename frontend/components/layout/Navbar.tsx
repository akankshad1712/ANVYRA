"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { categoriesService } from "@/services/categories.service";
import { cn } from "@/lib/utils";

// Static nav structure — category links built dynamically from DB below
const STATIC_NAV = [
  { label: "Collections", href: "/shop", sub: [] as string[] },
];

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ]       = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mounted, setMounted]       = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const router    = useRouter();
  const pathname  = usePathname();

  const { isAuthenticated, user, logout } = useAuthStore();
  const { cart, toggleCart }              = useCartStore();
  const { items: wishlistItems }          = useWishlistStore();

  const cartCount     = mounted ? (cart?.totalItems ?? 0) : 0;
  const wishlistCount = mounted ? wishlistItems.length : 0;

  // Load real categories from API so links use correct ?categoryId=
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesService.getAll,
    staleTime: 5 * 60 * 1000, // 5 min cache
  });

  // Build nav links: real DB categories first, then static
  // Only after mount to avoid hydration mismatch (categories come from API)
  const navLinks = mounted
    ? [
        ...categories.map((cat) => ({
          label: cat.name,
          href: `/shop?categoryId=${cat.id}`,
          sub: [] as string[],
        })),
        ...STATIC_NAV,
      ]
    : STATIC_NAV;

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setSearchOpen(false); }, [pathname]);
  useEffect(() => { if (searchOpen) searchRef.current?.focus(); }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQ.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQ.trim())}`);
      setSearchOpen(false);
      setSearchQ("");
    }
  };

  const handleLogout = async () => { await logout(); router.push("/"); };

  const isHomePage  = pathname === "/";
  const transparent = isHomePage && !scrolled && !mobileOpen;

  const iconCls = transparent
    ? "text-white/90 hover:text-white hover:bg-white/10"
    : "text-[#5C2E1A] hover:text-[#3D1A0A] hover:bg-[#EDE8E0]";

  const linkCls = cn(
    "flex items-center gap-1 text-sm font-medium transition-colors",
    transparent ? "text-white/90 hover:text-white" : "text-[#5C2E1A] hover:text-[#3D1A0A]"
  );

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          transparent
            ? "bg-[#1C0A04]/85 backdrop-blur-md"
            : "border-b border-[#D6CCBF] bg-[#F7F3EE] shadow-sm"
        )}
      >
        {/* ── Search overlay ─────────────────────────────── */}
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
                  ? "bg-[#1C0A04]/95 border-[#5C2E1A]/40"
                  : "bg-[#F7F3EE] border-[#D6CCBF]"
              )}
            >
              <form onSubmit={handleSearch} className="mx-auto flex max-w-2xl items-center gap-3">
                <Search className={cn("h-5 w-5 shrink-0", transparent ? "text-[#C4956A]" : "text-[#A0673A]")} />
                <input
                  ref={searchRef}
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder="Search products, brands…"
                  className={cn(
                    "flex-1 bg-transparent text-base outline-none placeholder:text-[#A0673A]/60",
                    transparent ? "text-[#F7F3EE]" : "text-[#3D1A0A]"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className={transparent ? "text-[#C4956A] hover:text-white" : "text-[#A0673A] hover:text-[#3D1A0A]"}
                >
                  <X className="h-5 w-5" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Main nav row ───────────────────────────────── */}
        <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 py-4">

          {/* Logo */}
          <Link href="/" aria-label="ANVYRA – home">
            <Image
              src={transparent ? "/logos/anvyra-logo-white.png" : "/logos/anvyra-logo-black.png"}
              alt="ANVYRA"
              width={130}
              height={40}
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>

          {/* ── Desktop links ──────────────────────────── */}
          <div className="hidden items-center gap-6 lg:flex overflow-x-auto max-w-2xl">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative flex-shrink-0"
                onMouseEnter={() => link.sub.length > 0 && setActiveMenu(link.label)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Link href={link.href} className={linkCls}>
                  {link.label}
                  {link.sub.length > 0 && <ChevronDown className="h-3.5 w-3.5 opacity-60" />}
                </Link>

                <AnimatePresence>
                  {activeMenu === link.label && link.sub.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full mt-2 min-w-[160px] rounded-xl border border-[#D6CCBF] bg-[#F7F3EE] p-2 shadow-xl"
                    >
                      {link.sub.map((sub) => (
                        <Link
                          key={sub}
                          href={`${link.href}&q=${sub.toLowerCase()}`}
                          className="block rounded-lg px-4 py-2 text-sm text-[#5C2E1A] hover:bg-[#EDE8E0] hover:text-[#3D1A0A] transition-colors"
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

          {/* ── Icon row ───────────────────────────────── */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
              className={cn("rounded-full p-2 transition-colors", iconCls)}
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              aria-label={`Wishlist (${wishlistCount})`}
              className={cn("relative rounded-full p-2 transition-colors", iconCls)}
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* Account */}
            {mounted && isAuthenticated ? (
              <div className="relative group">
                <button aria-label="Account" className={cn("rounded-full p-2 transition-colors", iconCls)}>
                  <User className="h-5 w-5" />
                </button>
                <div className="absolute right-0 top-full mt-1 hidden w-52 rounded-xl border border-[#D6CCBF] bg-[#F7F3EE] p-2 shadow-xl group-hover:block z-50">
                  <div className="px-3 py-2 border-b border-[#EDE8E0] mb-1">
                    <p className="text-xs font-semibold text-[#3D1A0A] truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-[10px] text-[#A0673A] truncate">{user?.email}</p>
                  </div>
                  <Link href="/account"  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#5C2E1A] hover:bg-[#EDE8E0] transition-colors">
                    <User className="h-3.5 w-3.5" /> My Account
                  </Link>
                  <Link href="/orders"   className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#5C2E1A] hover:bg-[#EDE8E0] transition-colors">
                    <ShoppingBag className="h-3.5 w-3.5" /> Orders
                  </Link>
                  <Link href="/wishlist" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#5C2E1A] hover:bg-[#EDE8E0] transition-colors">
                    <Heart className="h-3.5 w-3.5" /> Wishlist
                  </Link>
                  <hr className="my-1 border-[#E6DFD5]" />
                  <button
                    onClick={handleLogout}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" aria-label="Sign in" className={cn("rounded-full p-2 transition-colors", iconCls)}>
                <User className="h-5 w-5" />
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={toggleCart}
              aria-label={`Cart (${cartCount})`}
              className={cn("relative rounded-full p-2 transition-colors", iconCls)}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#5C2E1A] text-[10px] font-bold text-[#F7F3EE]">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className={cn("rounded-full p-2 transition-colors lg:hidden", iconCls)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* ── Mobile nav drawer ──────────────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-[#5C2E1A]/30 bg-[#1C0A04] lg:hidden"
            >
              <div className="px-6 py-6 space-y-1">
                <div className="pb-4 flex justify-center">
                  <Image src="/logos/anvyra-logo-white.png" alt="ANVYRA" width={110} height={34} className="h-8 w-auto object-contain" />
                </div>

                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="block rounded-lg px-4 py-3 text-base font-medium text-[#F7F3EE] hover:bg-[#3D1A0A] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="pt-4 border-t border-[#5C2E1A]/40 space-y-1">
                  {mounted && isAuthenticated ? (
                    <>
                      <Link href="/account" className="block rounded-lg px-4 py-3 text-base text-[#F7F3EE] hover:bg-[#3D1A0A] transition-colors">My Account</Link>
                      <Link href="/orders"  className="block rounded-lg px-4 py-3 text-base text-[#F7F3EE] hover:bg-[#3D1A0A] transition-colors">Orders</Link>
                      <button onClick={handleLogout} className="block w-full rounded-lg px-4 py-3 text-left text-base text-red-400 hover:bg-[#3D1A0A] transition-colors">Sign out</button>
                    </>
                  ) : (
                    <>
                      <Link href="/login"    className="block rounded-lg px-4 py-3 text-base font-semibold text-[#C4956A] hover:bg-[#3D1A0A] transition-colors">Sign in</Link>
                      <Link href="/register" className="block rounded-lg px-4 py-3 text-base text-[#F7F3EE] hover:bg-[#3D1A0A] transition-colors">Create account</Link>
                    </>
                  )}
                </div>

                <p className="pt-6 text-center text-xs tracking-[0.2em] text-[#C4956A] uppercase">
                  Style Meets You
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
