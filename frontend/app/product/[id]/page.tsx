"use client";

import { use, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { productsService } from "@/services/products.service";
import { reviewsService } from "@/services/reviews.service";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { useAuthStore } from "@/store/auth.store";
import { useToast } from "@/providers/toast-provider";
import Container from "@/components/common/Container";
import { PageLoader } from "@/components/common/Loading";
import { Heart, ShoppingBag, Star, Truck, RotateCcw, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  const { addItem } = useCartStore();
  const { isInWishlist, toggle: toggleWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const { success, error: showError } = useToast();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productsService.getById(Number(id)),
  });

  const { data: reviewData } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => reviewsService.getProductReviews(Number(id), 0, 5),
    enabled: !!id,
  });

  if (isLoading) return <PageLoader />;
  if (!product) return (
    <main className="py-20 text-center">
      <h1 className="text-2xl font-bold">Product not found</h1>
      <Link href="/shop" className="mt-4 inline-block underline">Back to shop</Link>
    </main>
  );

  const images = product.images?.length ? product.images : ["/placeholder-product.jpg"];
  const inWishlist = isInWishlist(product.id);
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;
  const reviews = reviewData?.content ?? [];

  const handleAddToCart = async () => {
    if (!isAuthenticated) { showError("Please sign in to add to cart"); return; }
    if (product.sizes?.length > 0 && !selectedSize) { showError("Please select a size"); return; }
    setAddingToCart(true);
    try {
      await addItem({ productId: product.id, quantity, selectedSize, selectedColor });
      success("Added to cart!");
    } catch (err: any) {
      showError(err.message ?? "Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) { showError("Please sign in"); return; }
    await toggleWishlist(product.id);
    success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <main className="py-10">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-100">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                priority
                className="object-cover"
              />
              {hasDiscount && (
                <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white">
                  -{discountPct}%
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      "relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition",
                      i === selectedImage ? "border-black" : "border-transparent"
                    )}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-zinc-500">
                {product.brand}
              </p>
              <h1 className="mt-2 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold">
                {product.name}
              </h1>
              {product.totalReviews > 0 && (
                <div className="mt-2 flex items-center gap-2 text-sm text-zinc-600">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={cn("h-4 w-4", s <= Math.round(product.averageRating) ? "fill-amber-400 text-amber-400" : "text-zinc-300")}
                      />
                    ))}
                  </div>
                  <span>{product.averageRating.toFixed(1)}</span>
                  <span>({product.totalReviews} reviews)</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">₹{product.effectivePrice.toLocaleString()}</span>
              {hasDiscount && (
                <span className="text-xl text-zinc-400 line-through">₹{product.price.toLocaleString()}</span>
              )}
            </div>

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium">
                  Size {selectedSize && <span className="text-zinc-500">— {selectedSize}</span>}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "rounded-lg border px-4 py-2 text-sm font-medium transition",
                        selectedSize === size
                          ? "border-black bg-black text-white"
                          : "border-zinc-300 hover:border-zinc-500"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium">Color {selectedColor && <span className="text-zinc-500">— {selectedColor}</span>}</p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "rounded-full border px-4 py-1.5 text-sm transition",
                        selectedColor === color ? "border-black bg-black text-white" : "border-zinc-300"
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-full border border-zinc-300 p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-zinc-100"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-zinc-100"
                >
                  +
                </button>
              </div>
              <p className="text-sm text-zinc-500">
                {product.quantity > 0 ? `${product.quantity} in stock` : "Out of stock"}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.quantity === 0}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-black py-4 font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
              >
                <ShoppingBag className="h-5 w-5" />
                {product.quantity === 0 ? "Out of Stock" : addingToCart ? "Adding…" : "Add to Cart"}
              </button>
              <button
                onClick={handleWishlist}
                className={cn(
                  "rounded-full border p-4 transition",
                  inWishlist ? "border-red-200 bg-red-50 text-red-500" : "border-zinc-300 hover:border-zinc-500"
                )}
              >
                <Heart className={cn("h-5 w-5", inWishlist && "fill-current")} />
              </button>
            </div>

            {/* Info pills */}
            <div className="grid grid-cols-3 gap-4 rounded-xl border border-zinc-100 p-4">
              <div className="flex flex-col items-center gap-1.5 text-center">
                <Truck className="h-5 w-5 text-zinc-500" />
                <p className="text-xs text-zinc-500">Free shipping over ₹999</p>
              </div>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <RotateCcw className="h-5 w-5 text-zinc-500" />
                <p className="text-xs text-zinc-500">30-day returns</p>
              </div>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <Shield className="h-5 w-5 text-zinc-500" />
                <p className="text-xs text-zinc-500">Authentic guarantee</p>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="font-semibold">About this product</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{product.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <section className="mt-20">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold">Reviews ({product.totalReviews})</h2>
            <div className="mt-8 space-y-6">
              {reviews.map((r) => (
                <div key={r.id} className="border-b border-zinc-100 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 font-semibold text-zinc-700">
                      {r.userFirstName[0]}
                    </div>
                    <div>
                      <p className="font-medium">{r.userFirstName} {r.userLastName}</p>
                      <div className="flex">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className={cn("h-3.5 w-3.5", s <= r.rating ? "fill-amber-400 text-amber-400" : "text-zinc-300")} />
                        ))}
                      </div>
                    </div>
                  </div>
                  {r.title && <h4 className="mt-3 font-medium">{r.title}</h4>}
                  {r.comment && <p className="mt-1 text-sm text-zinc-600">{r.comment}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </Container>
    </main>
  );
}
