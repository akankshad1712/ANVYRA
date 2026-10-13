"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Star, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useWishlistStore } from "@/store/wishlist.store";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { useToast } from "@/providers/toast-provider";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";
import { resolveProductImage, resolveProductGallery } from "@/lib/product-images";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const [imageLoaded,   setImageLoaded]   = useState(false);
  const [imgIndex,      setImgIndex]      = useState(0);
  const [isHovered,     setIsHovered]     = useState(false);

  const { isInWishlist, toggle: toggleWishlist } = useWishlistStore();
  const { addItem }         = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { success, error: showError } = useToast();

  const inWishlist  = isInWishlist(product.id);
  const gallery     = resolveProductGallery(
    product.images, product.name, product.category?.name, product.colors
  );
  const mainImage   = gallery[imgIndex] ?? gallery[0];
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;
  const isNew       = (() => {
    const created = new Date(product.createdAt);
    const days    = (Date.now() - created.getTime()) / 86400000;
    return days < 30;
  })();

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { showError("Sign in to save wishlist"); return; }
    await toggleWishlist(product.id);
    success(inWishlist ? "Removed from wishlist" : "Saved to wishlist ♥");
  };

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { showError("Sign in to add to cart"); return; }
    try {
      await addItem({ productId: product.id, quantity: 1 });
      success("Added to cart!");
    } catch { showError("Failed to add to cart"); }
  };

  // Hover: cycle to second image if available
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (gallery.length > 1) setImgIndex(1);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
    setImgIndex(0);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link href={`/product/${product.id}`} className="block">

        {/* ── Image container ──────────────────────────────────────────────── */}
        <div
          className="relative aspect-product overflow-hidden rounded-2xl bg-[#EDE8E0]"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Main image */}
          <Image
            src={mainImage}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={cn(
              "object-cover transition-all duration-700",
              isHovered ? "scale-[1.07]" : "scale-100",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Skeleton while loading */}
          {!imageLoaded && <div className="absolute inset-0 skeleton" />}

          {/* ── Badges top-left ──────────────────────────────────────────── */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
            {hasDiscount && (
              <span className="badge-discount shadow-sm">
                -{discountPct}%
              </span>
            )}
            {isNew && !hasDiscount && (
              <span className="badge-new shadow-sm">
                NEW
              </span>
            )}
            {product.featured && (
              <span className="badge-featured shadow-sm">
                ✦ PICK
              </span>
            )}
          </div>

          {/* ── Hover actions top-right ──────────────────────────────────── */}
          <div className="absolute right-3 top-3 z-10 flex flex-col gap-2 transition-all duration-300"
            style={{ opacity: isHovered ? 1 : 0, transform: isHovered ? "translateX(0)" : "translateX(8px)" }}
          >
            {/* Wishlist */}
            <button
              onClick={handleWishlist}
              aria-label={inWishlist ? "Remove from wishlist" : "Save to wishlist"}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition-all duration-200",
                inWishlist
                  ? "bg-red-500 text-white scale-110"
                  : "glass text-[#5C2E1A] hover:bg-red-500 hover:text-white hover:scale-110"
              )}
            >
              <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
            </button>

            {/* Quick add */}
            <button
              onClick={handleQuickAdd}
              aria-label="Add to cart"
              className="flex h-9 w-9 items-center justify-center rounded-full glass text-[#5C2E1A] shadow-sm transition-all duration-200 hover:bg-[#5C2E1A] hover:text-[#F7F3EE] hover:scale-110"
            >
              <ShoppingBag className="h-4 w-4" />
            </button>

            {/* Quick view */}
            <button
              aria-label="Quick view"
              className="flex h-9 w-9 items-center justify-center rounded-full glass text-[#5C2E1A] shadow-sm transition-all duration-200 hover:bg-[#1C0A04] hover:text-[#F7F3EE] hover:scale-110"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>

          {/* ── Bottom overlay bar (hover) ───────────────────────────────── */}
          <div
            className="absolute inset-x-0 bottom-0 z-10 p-3 transition-all duration-300"
            style={{ opacity: isHovered ? 1 : 0, transform: isHovered ? "translateY(0)" : "translateY(6px)" }}
          >
            <div className="glass rounded-xl px-3 py-2 text-center">
              <p className="font-display text-xs font-semibold text-[#1C0A04]">
                {product.quantity === 0 ? "Out of Stock" : "View Details →"}
              </p>
            </div>
          </div>

          {/* ── Out of stock overlay ─────────────────────────────────────── */}
          {product.quantity === 0 && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#1C0A04]/55 backdrop-blur-[2px]">
              <span className="glass rounded-full px-4 py-2 font-display text-sm font-semibold text-[#1C0A04]">
                Out of Stock
              </span>
            </div>
          )}

          {/* ── Image dot indicators (multi-image) ──────────────────────── */}
          {gallery.length > 1 && (
            <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 gap-1">
              {gallery.slice(0, 3).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1 rounded-full transition-all duration-300",
                    i === imgIndex ? "w-4 bg-[#C4956A]" : "w-1 bg-white/60"
                  )}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Product info ─────────────────────────────────────────────────── */}
        <div className="mt-3 space-y-1 px-0.5">

          {/* Brand */}
          <p className="eyebrow truncate">{product.brand}</p>

          {/* Name */}
          <h3 className="font-display text-sm font-semibold leading-snug text-[#1C0A04] line-clamp-2 transition-colors group-hover:text-[#5C2E1A]">
            {product.name}
          </h3>

          {/* Price row */}
          <div className="flex items-center gap-2 pt-0.5">
            <span className="font-display text-base font-bold text-[#1C0A04]">
              ₹{product.effectivePrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="font-sans text-xs text-[#A0673A]/60 line-through">
                ₹{product.price.toLocaleString()}
              </span>
            )}
            {hasDiscount && (
              <span className="rounded-full bg-green-100 px-1.5 py-0.5 font-display text-[10px] font-bold text-green-700">
                {discountPct}% off
              </span>
            )}
          </div>

          {/* Rating */}
          {product.totalReviews > 0 && (
            <div className="flex items-center gap-1.5 pt-0.5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={cn(
                      "h-3 w-3",
                      s <= Math.round(product.averageRating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-[#D6CCBF]"
                    )}
                  />
                ))}
              </div>
              <span className="font-sans text-[11px] text-[#A0673A]">
                ({product.totalReviews})
              </span>
            </div>
          )}

          {/* Size chips — show first 3 */}
          {product.sizes?.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-0.5">
              {product.sizes.slice(0, 4).map((s) => (
                <span
                  key={s}
                  className="rounded border border-[#D6CCBF] px-1.5 py-0.5 font-sans text-[10px] text-[#5C2E1A]"
                >
                  {s}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="rounded border border-[#D6CCBF] px-1.5 py-0.5 font-sans text-[10px] text-[#A0673A]">
                  +{product.sizes.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );
}
