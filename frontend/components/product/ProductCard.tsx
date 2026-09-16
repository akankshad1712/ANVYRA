"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
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
  const [imageLoaded, setImageLoaded] = useState(false);
  const { isInWishlist, toggle: toggleWishlist } = useWishlistStore();
  const { addItem }        = useCartStore();
  const { isAuthenticated }= useAuthStore();
  const { success, error: showError } = useToast();

  const inWishlist = isInWishlist(product.id);
  const mainImage  = resolveProductImage(
    product.images,
    product.name,
    product.category?.name,
    product.colors
  );
  const hasDiscount= product.discountPrice > 0 && product.discountPrice < product.price;
  const discountPct= hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { showError("Please sign in to add to wishlist"); return; }
    await toggleWishlist(product.id);
    success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
  };

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { showError("Please sign in to add to cart"); return; }
    try {
      await addItem({ productId: product.id, quantity: 1 });
      success("Added to cart");
    } catch { showError("Failed to add to cart"); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
    >
      <Link href={`/product/${product.id}`} className="group block">
        {/* Image container */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#EDE8E0]">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            priority={priority}
            className={cn(
              "object-cover transition-all duration-500 group-hover:scale-105",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {hasDiscount && (
              <span className="rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white">
                -{discountPct}%
              </span>
            )}
            {product.featured && (
              <span className="rounded-full bg-[#C4956A] px-2.5 py-1 text-xs font-bold text-[#1C0A04]">
                FEATURED
              </span>
            )}
          </div>

          {/* Hover actions */}
          <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button
              onClick={handleWishlist}
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              className={cn(
                "rounded-full p-2.5 backdrop-blur-md transition-all",
                inWishlist
                  ? "bg-red-500 text-white"
                  : "bg-[#F7F3EE]/90 text-[#5C2E1A] hover:bg-red-500 hover:text-white"
              )}
            >
              <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
            </button>
            <button
              onClick={handleQuickAdd}
              aria-label="Quick add to cart"
              className="rounded-full bg-[#F7F3EE]/90 p-2.5 text-[#5C2E1A] backdrop-blur-md transition-all hover:bg-[#5C2E1A] hover:text-[#F7F3EE]"
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
          </div>

          {/* Out of stock overlay */}
          {product.quantity === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#1C0A04]/60 backdrop-blur-sm">
              <span className="rounded-full bg-[#F7F3EE] px-4 py-2 text-sm font-semibold text-[#5C2E1A]">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Text info */}
        <div className="mt-3 space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-[#A0673A]">
            {product.brand}
          </p>
          <h3 className="font-medium text-[#3D1A0A] line-clamp-2 group-hover:text-[#5C2E1A] transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#3D1A0A]">
              ₹{product.effectivePrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-sm text-[#A0673A]/60 line-through">
                ₹{product.price.toLocaleString()}
              </span>
            )}
          </div>
          {product.totalReviews > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-[#A0673A]">
              <span>⭐ {product.averageRating.toFixed(1)}</span>
              <span>·</span>
              <span>{product.totalReviews} reviews</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
