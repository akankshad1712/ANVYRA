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
  const [selectedImage,  setSelectedImage]  = useState(0);
  const [selectedSize,   setSelectedSize]   = useState<string>("");
  const [selectedColor,  setSelectedColor]  = useState<string>("");
  const [quantity,       setQuantity]       = useState(1);
  const [addingToCart,   setAddingToCart]   = useState(false);

  const { addItem }             = useCartStore();
  const { isInWishlist, toggle: toggleWishlist } = useWishlistStore();
  const { isAuthenticated }     = useAuthStore();
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
    <main className="py-20 text-center bg-[#F7F3EE]">
      <h1 className="text-2xl font-bold text-[#1C0A04]">Product not found</h1>
      <Link href="/shop" className="mt-4 inline-block text-[#A0673A] underline">Back to shop</Link>
    </main>
  );

  const images     = product.images?.length ? product.images : ["/placeholder-product.jpg"];
  const inWishlist = isInWishlist(product.id);
  const hasDiscount= product.discountPrice > 0 && product.discountPrice < product.price;
  const discountPct= hasDiscount
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

  const sizeBtn = (size: string) => cn(
    "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
    selectedSize === size
      ? "border-[#5C2E1A] bg-[#5C2E1A] text-[#F7F3EE]"
      : "border-[#D6CCBF] text-[#5C2E1A] hover:border-[#C4956A]"
  );

  const colorBtn = (color: string) => cn(
    "rounded-full border px-4 py-1.5 text-sm transition-colors",
    selectedColor === color
      ? "border-[#5C2E1A] bg-[#5C2E1A] text-[#F7F3EE]"
      : "border-[#D6CCBF] text-[#5C2E1A] hover:border-[#C4956A]"
  );

  return (
    <main className="py-10 bg-[#F7F3EE]">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#EDE8E0]">
              <Image src={images[selectedImage]} alt={product.name} fill priority className="object-cover" />
              {hasDiscount && (
                <span className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1 text-sm font-bold text-white">
                  -{discountPct}%
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={cn(
                      "relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition",
                      i === selectedImage ? "border-[#C4956A]" : "border-transparent"
                    )}>
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-[#A0673A]">{product.brand}</p>
              <h1 className="mt-2 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[#1C0A04]">
                {product.name}
              </h1>
              {product.totalReviews > 0 && (
                <div className="mt-2 flex items-center gap-2 text-sm text-[#A0673A]">
                  <div className="flex">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} className={cn("h-4 w-4", s <= Math.round(product.averageRating) ? "fill-amber-500 text-amber-500" : "text-[#D6CCBF]")} />
                    ))}
                  </div>
                  <span>{product.averageRating.toFixed(1)}</span>
                  <span>({product.totalReviews} reviews)</span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-[#1C0A04]">₹{product.effectivePrice.toLocaleString()}</span>
              {hasDiscount && (
                <span className="text-xl text-[#A0673A]/60 line-through">₹{product.price.toLocaleString()}</span>
              )}
            </div>

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-[#5C2E1A]">
                  Size {selectedSize && <span className="text-[#A0673A] font-normal">— {selectedSize}</span>}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button key={size} onClick={() => setSelectedSize(size)} className={sizeBtn(size)}>{size}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-[#5C2E1A]">
                  Color {selectedColor && <span className="text-[#A0673A] font-normal">— {selectedColor}</span>}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button key={color} onClick={() => setSelectedColor(color)} className={colorBtn(color)}>{color}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-full border border-[#D6CCBF] p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#5C2E1A] hover:bg-[#EDE8E0] transition-colors"
                >−</button>
                <span className="w-8 text-center text-sm font-medium text-[#3D1A0A]">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#5C2E1A] hover:bg-[#EDE8E0] transition-colors"
                >+</button>
              </div>
              <p className="text-sm text-[#A0673A]">
                {product.quantity > 0 ? `${product.quantity} in stock` : "Out of stock"}
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.quantity === 0}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#5C2E1A] py-4 font-semibold text-[#F7F3EE] hover:bg-[#3D1A0A] disabled:opacity-50 transition-colors"
              >
                <ShoppingBag className="h-5 w-5" />
                {product.quantity === 0 ? "Out of Stock" : addingToCart ? "Adding…" : "Add to Cart"}
              </button>
              <button
                onClick={handleWishlist}
                className={cn(
                  "rounded-full border p-4 transition-colors",
                  inWishlist
                    ? "border-red-300 bg-red-50 text-red-600"
                    : "border-[#D6CCBF] text-[#5C2E1A] hover:border-[#C4956A] hover:bg-[#EDE8E0]"
                )}
              >
                <Heart className={cn("h-5 w-5", inWishlist && "fill-current")} />
              </button>
            </div>

            {/* Info pills */}
            <div className="grid grid-cols-3 gap-4 rounded-xl border border-[#D6CCBF] bg-white p-4">
              {[
                { Icon: Truck,      text: "Free shipping over ₹999" },
                { Icon: RotateCcw,  text: "30-day returns"           },
                { Icon: Shield,     text: "Authentic guarantee"      },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-1.5 text-center">
                  <Icon className="h-5 w-5 text-[#C4956A]" />
                  <p className="text-xs text-[#A0673A]">{text}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="font-semibold text-[#1C0A04]">About this product</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5C2E1A]">{product.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <section className="mt-20">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#1C0A04]">
              Reviews ({product.totalReviews})
            </h2>
            <div className="mt-8 space-y-6">
              {reviews.map((r) => (
                <div key={r.id} className="border-b border-[#D6CCBF] pb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EDE8E0] font-semibold text-[#5C2E1A]">
                      {r.userFirstName[0]}
                    </div>
                    <div>
                      <p className="font-medium text-[#3D1A0A]">{r.userFirstName} {r.userLastName}</p>
                      <div className="flex">
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} className={cn("h-3.5 w-3.5", s <= r.rating ? "fill-amber-500 text-amber-500" : "text-[#D6CCBF]")} />
                        ))}
                      </div>
                    </div>
                  </div>
                  {r.title   && <h4 className="mt-3 font-medium text-[#3D1A0A]">{r.title}</h4>}
                  {r.comment && <p className="mt-1 text-sm text-[#5C2E1A]">{r.comment}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </Container>
    </main>
  );
}
