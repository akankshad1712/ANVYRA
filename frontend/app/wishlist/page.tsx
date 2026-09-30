"use client";

import { motion } from "framer-motion";
import { useWishlistStore } from "@/store/wishlist.store";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { useToast } from "@/providers/toast-provider";
import Container from "@/components/common/Container";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
import { Heart, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";

export default function WishlistPage() {
  const { items, toggle: removeItem } = useWishlistStore();
  const { addItem }                   = useCartStore();
  const { isAuthenticated }           = useAuthStore();
  const { success, error: showError } = useToast();

  /* ── Unauthenticated state ─────────────────────────────── */
  if (!isAuthenticated) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#F7F3EE] px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-sm"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#EDE8E0]">
            <Heart className="h-10 w-10 text-[#C4956A]" />
          </div>
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#1C0A04]">
            Your wishlist awaits
          </h1>
          <p className="mt-3 text-[#A0673A] leading-relaxed">
            Sign in to save your favourite pieces and access them from any device.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="rounded-full bg-[#1C0A04] px-8 py-3 font-semibold text-[#F7F3EE] hover:bg-[#3D1A0A] transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-full border border-[#D6CCBF] px-8 py-3 font-semibold text-[#5C2E1A] hover:border-[#C4956A] hover:bg-[#EDE8E0] transition-colors"
            >
              Create Account
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  /* ── Empty wishlist ────────────────────────────────────── */
  if (items.length === 0) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#F7F3EE] px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-sm"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#EDE8E0]">
            <Heart className="h-10 w-10 text-[#C4956A]/50" />
          </div>
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#1C0A04]">
            Nothing saved yet
          </h1>
          <p className="mt-3 text-[#A0673A]">
            Heart the pieces you love to save them here.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#1C0A04] px-8 py-3 font-semibold text-[#F7F3EE] hover:bg-[#3D1A0A] transition-colors group"
          >
            Browse Products
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </main>
    );
  }

  const handleMoveToCart = async (productId: number) => {
    try {
      await addItem({ productId, quantity: 1 });
      await removeItem(productId);
      success("Moved to cart!");
    } catch {
      showError("Failed to move to cart");
    }
  };

  const handleMoveAllToCart = async () => {
    let moved = 0;
    for (const product of items) {
      try {
        await addItem({ productId: product.id, quantity: 1 });
        await removeItem(product.id);
        moved++;
      } catch {
        // continue
      }
    }
    if (moved > 0) success(`${moved} item${moved !== 1 ? "s" : ""} moved to cart!`);
  };

  return (
    <main className="min-h-screen bg-[#F7F3EE] py-8 lg:py-12">
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#A0673A]">Saved</p>
            <h1 className="mt-2 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[#1C0A04] lg:text-4xl">
              Wishlist
              <span className="ml-3 text-xl font-normal text-[#A0673A]">({items.length})</span>
            </h1>
          </div>

          {items.length > 1 && (
            <button
              onClick={handleMoveAllToCart}
              className="flex items-center gap-2 rounded-full bg-[#5C2E1A] px-6 py-2.5 text-sm font-semibold text-[#F7F3EE] hover:bg-[#3D1A0A] transition-colors"
            >
              <ShoppingBag className="h-4 w-4" />
              Move all to cart
            </button>
          )}
        </motion.div>

        {/* Personalised tip */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8 flex items-center gap-3 rounded-xl border border-[#D6CCBF] bg-white px-4 py-3"
        >
          <Sparkles className="h-4 w-4 text-[#C4956A] flex-shrink-0" />
          <p className="text-sm text-[#5C2E1A]">
            You have <span className="font-semibold">{items.length} saved piece{items.length !== 1 ? "s" : ""}</span>.
            {" "}Items sell out fast — add them to your cart before they&apos;re gone.
          </p>
        </motion.div>

        {/* Product grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {items.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <ProductCard product={product} />
              <button
                onClick={() => handleMoveToCart(product.id)}
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-full border border-[#D6CCBF] py-2 text-xs font-semibold text-[#5C2E1A] hover:border-[#C4956A] hover:bg-[#EDE8E0] transition-all duration-200"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                Move to Cart
              </button>
            </motion.div>
          ))}
        </div>

        {/* Continue shopping */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#A0673A] hover:text-[#5C2E1A] transition-colors group"
          >
            Continue browsing
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </Container>
    </main>
  );
}
