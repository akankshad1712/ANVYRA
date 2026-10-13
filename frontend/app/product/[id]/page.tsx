"use client";

import { use, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { productsService } from "@/services/products.service";
import { reviewsService } from "@/services/reviews.service";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { useAuthStore } from "@/store/auth.store";
import { useToast } from "@/providers/toast-provider";
import Container from "@/components/common/Container";
import { PageLoader, Spinner } from "@/components/common/Loading";
import ProductCard from "@/components/product/ProductCard";
import {
  Heart, ShoppingBag, Star, Truck, RotateCcw, Shield,
  ChevronRight, Zap, MapPin, CheckCircle, AlertCircle,
  MessageSquare, ThumbsUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { resolveProductGallery } from "@/lib/product-images";
import { motion, AnimatePresence } from "framer-motion";

// ─── Indian states for delivery estimate ────────────────────────────────────
const METRO_PINCODES = ["400", "110", "560", "600", "500", "700", "411", "380"];

function estimateDelivery(pincode: string): string {
  if (!pincode || pincode.length < 6) return "";
  const prefix = pincode.substring(0, 3);
  if (METRO_PINCODES.includes(prefix)) return "Delivery by Tomorrow";
  return "Delivery in 3-5 business days";
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }   = use(params);
  const router   = useRouter();
  const qc       = useQueryClient();

  const [selectedImage,  setSelectedImage]  = useState(0);
  const [selectedSize,   setSelectedSize]   = useState<string>("");
  const [selectedColor,  setSelectedColor]  = useState<string>("");
  const [quantity,       setQuantity]       = useState(1);
  const [addingToCart,   setAddingToCart]   = useState(false);
  const [buyingNow,      setBuyingNow]      = useState(false);

  // Pincode checker
  const [pincode,        setPincode]        = useState("");
  const [pincodeResult,  setPincodeResult]  = useState<string | null>(null);
  const [pincodeChecked, setPincodeChecked] = useState(false);

  // Review form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating,   setReviewRating]   = useState(0);
  const [reviewHover,    setReviewHover]    = useState(0);
  const [reviewTitle,    setReviewTitle]    = useState("");
  const [reviewComment,  setReviewComment]  = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addItem }                         = useCartStore();
  const { isInWishlist, toggle: toggleWishlist } = useWishlistStore();
  const { isAuthenticated }                 = useAuthStore();
  const { success, error: showError }       = useToast();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productsService.getById(Number(id)),
  });

  const { data: reviewData, refetch: refetchReviews } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => reviewsService.getProductReviews(Number(id), 0, 10),
    enabled: !!id,
  });

  const { data: relatedData } = useQuery({
    queryKey: ["products", "related", product?.category?.id, id],
    queryFn: () => productsService.getAll({
      categoryId: product!.category!.id,
      size: 5,
      sortBy: "createdAt",
      sortDir: "desc",
    }),
    enabled: !!product?.category?.id,
  });

  if (isLoading) return <PageLoader />;
  if (!product) return (
    <main className="py-20 text-center bg-[#F7F3EE]">
      <h1 className="text-2xl font-bold text-[#1C0A04]">Product not found</h1>
      <Link href="/shop" className="mt-4 inline-block text-[#A0673A] underline">Back to shop</Link>
    </main>
  );

  const images          = resolveProductGallery(product.images, product.name, product.category?.name, product.colors);
  const inWishlist      = isInWishlist(product.id);
  const hasDiscount     = product.discountPrice > 0 && product.discountPrice < product.price;
  const discountPct     = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
  const reviews         = reviewData?.content ?? [];
  const relatedProducts = (relatedData?.content ?? []).filter((p) => p.id !== product.id).slice(0, 4);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const validateSelection = () => {
    if (!isAuthenticated) { showError("Please sign in to continue"); return false; }
    if (product.sizes?.length > 0 && !selectedSize) { showError("Please select a size"); return false; }
    return true;
  };

  const handleAddToCart = async () => {
    if (!validateSelection()) return;
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

  const handleBuyNow = async () => {
    if (!validateSelection()) return;
    setBuyingNow(true);
    try {
      await addItem({ productId: product.id, quantity, selectedSize, selectedColor });
      router.push("/checkout");
    } catch (err: any) {
      showError(err.message ?? "Failed to proceed");
      setBuyingNow(false);
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) { showError("Please sign in"); return; }
    await toggleWishlist(product.id);
    success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
  };

  const handleCheckPincode = () => {
    if (pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
      showError("Please enter a valid 6-digit pincode");
      return;
    }
    const result = estimateDelivery(pincode);
    setPincodeResult(result);
    setPincodeChecked(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { showError("Please sign in to write a review"); return; }
    if (reviewRating === 0) { showError("Please select a rating"); return; }
    setSubmittingReview(true);
    try {
      await reviewsService.create({
        productId: product.id,
        rating: reviewRating,
        title: reviewTitle || undefined,
        comment: reviewComment || undefined,
      });
      success("Review submitted! Thank you.");
      setShowReviewForm(false);
      setReviewRating(0);
      setReviewTitle("");
      setReviewComment("");
      refetchReviews();
      qc.invalidateQueries({ queryKey: ["product", id] });
    } catch (err: any) {
      showError(err.message ?? "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const sizeBtn = (size: string) => cn(
    "rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all",
    selectedSize === size
      ? "border-[#5C2E1A] bg-[#5C2E1A] text-[#F7F3EE] shadow-sm"
      : "border-[#D6CCBF] text-[#5C2E1A] hover:border-[#C4956A]"
  );

  const colorBtn = (color: string) => cn(
    "rounded-full border-2 px-4 py-1.5 text-sm transition-all",
    selectedColor === color
      ? "border-[#5C2E1A] bg-[#5C2E1A] text-[#F7F3EE]"
      : "border-[#D6CCBF] text-[#5C2E1A] hover:border-[#C4956A]"
  );

  return (
    <main className="min-h-screen bg-[#F7F3EE] py-8">
      <Container>

        {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
        <nav className="mb-6 flex items-center gap-1.5 text-xs text-[#A0673A]">
          <Link href="/" className="hover:text-[#5C2E1A] transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/shop" className="hover:text-[#5C2E1A] transition-colors">Shop</Link>
          {product.category && (
            <>
              <ChevronRight className="h-3 w-3" />
              <Link href={`/shop?categoryId=${product.category.id}`} className="hover:text-[#5C2E1A] transition-colors">
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="h-3 w-3" />
          <span className="text-[#3D1A0A] font-medium line-clamp-1 max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">

          {/* ── Gallery ──────────────────────────────────────────────────────── */}
          <div className="space-y-3">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#EDE8E0] shadow-sm">
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0"
              >
                <Image src={images[selectedImage]} alt={product.name} fill priority className="object-cover" />
              </motion.div>
              {hasDiscount && (
                <span className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1 text-sm font-bold text-white shadow">
                  -{discountPct}% OFF
                </span>
              )}
              {product.quantity === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#1C0A04]/60 backdrop-blur-sm rounded-2xl">
                  <span className="rounded-full bg-white px-6 py-2 font-semibold text-[#1C0A04]">Out of Stock</span>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      "relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                      i === selectedImage ? "border-[#C4956A] shadow-sm" : "border-transparent opacity-70 hover:opacity-100"
                    )}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ─────────────────────────────────────────────────── */}
          <div className="space-y-5">

            {/* Brand + name */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#A0673A]">{product.brand}</p>
              <h1 className="mt-2 font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#1C0A04] sm:text-3xl">
                {product.name}
              </h1>

              {/* Rating row */}
              {product.totalReviews > 0 ? (
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                  <div className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-2.5 py-0.5 text-white text-xs font-bold">
                    <span>{product.averageRating.toFixed(1)}</span>
                    <Star className="h-3 w-3 fill-current" />
                  </div>
                  <button
                    onClick={() => document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" })}
                    className="text-[#A0673A] hover:text-[#5C2E1A] transition-colors underline underline-offset-2"
                  >
                    {product.totalReviews} ratings
                  </button>
                </div>
              ) : (
                <p className="mt-2 text-sm text-[#A0673A]">No reviews yet — be the first!</p>
              )}
            </div>

            {/* Price */}
            <div className="rounded-xl bg-white border border-[#D6CCBF] p-4">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-bold text-[#1C0A04]">₹{product.effectivePrice.toLocaleString()}</span>
                {hasDiscount && (
                  <>
                    <span className="text-lg text-[#A0673A]/60 line-through">₹{product.price.toLocaleString()}</span>
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                      {discountPct}% off
                    </span>
                  </>
                )}
              </div>
              {product.effectivePrice >= 999 && (
                <p className="mt-1.5 text-xs text-emerald-700 font-medium flex items-center gap-1">
                  <Truck className="h-3 w-3" /> Free delivery on this order
                </p>
              )}
            </div>

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-[#3D1A0A]">
                    Size {selectedSize && <span className="text-[#C4956A]">— {selectedSize}</span>}
                  </p>
                  <button className="text-xs text-[#A0673A] underline hover:text-[#5C2E1A] transition-colors">
                    Size guide
                  </button>
                </div>
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
                <p className="mb-2 text-sm font-semibold text-[#3D1A0A]">
                  Color {selectedColor && <span className="text-[#C4956A]">— {selectedColor}</span>}
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
              <p className="text-sm font-semibold text-[#3D1A0A]">Qty:</p>
              <div className="flex items-center gap-1 rounded-xl border-2 border-[#D6CCBF] p-0.5">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#5C2E1A] hover:bg-[#EDE8E0] transition-colors font-bold text-lg"
                >−</button>
                <span className="w-8 text-center text-sm font-semibold text-[#1C0A04]">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(q + 1, product.quantity))}
                  disabled={quantity >= product.quantity}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#5C2E1A] hover:bg-[#EDE8E0] transition-colors disabled:opacity-40 font-bold text-lg"
                >+</button>
              </div>
              <p className="text-xs text-[#A0673A]">
                {product.quantity > 0
                  ? product.quantity <= 5
                    ? <span className="text-red-600 font-semibold">Only {product.quantity} left!</span>
                    : `${product.quantity} in stock`
                  : <span className="text-red-600 font-semibold">Out of stock</span>}
              </p>
            </div>

            {/* ── CTAs — Amazon/Flipkart style ─────────────────────── */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.quantity === 0}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-[#5C2E1A] bg-white py-3.5 font-bold text-[#5C2E1A] hover:bg-[#EDE8E0] disabled:opacity-50 transition-all"
              >
                {addingToCart ? <Spinner size="sm" className="text-[#5C2E1A]" /> : <ShoppingBag className="h-5 w-5" />}
                {product.quantity === 0 ? "Out of Stock" : addingToCart ? "Adding…" : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={buyingNow || product.quantity === 0}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#C4956A] py-3.5 font-bold text-[#1C0A04] hover:bg-[#D4AF8C] hover:shadow-lg hover:shadow-[#C4956A]/30 disabled:opacity-50 transition-all hover:-translate-y-0.5"
              >
                {buyingNow ? <Spinner size="sm" className="text-[#1C0A04]" /> : <Zap className="h-5 w-5" />}
                {buyingNow ? "Processing…" : "Buy Now"}
              </button>
              <button
                onClick={handleWishlist}
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                className={cn(
                  "flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all",
                  inWishlist
                    ? "border-red-300 bg-red-50 text-red-500 shadow-sm"
                    : "border-[#D6CCBF] text-[#5C2E1A] hover:border-red-300 hover:bg-red-50 hover:text-red-500"
                )}
              >
                <Heart className={cn("h-5 w-5", inWishlist && "fill-current")} />
              </button>
            </div>

            {/* ── Delivery / Pincode checker ────────────────────────── */}
            <div className="rounded-xl border border-[#D6CCBF] bg-white p-4 space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#C4956A]" />
                <p className="text-sm font-semibold text-[#1C0A04]">Check Delivery</p>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value.replace(/\D/g, "").slice(0, 6));
                    setPincodeChecked(false);
                    setPincodeResult(null);
                  }}
                  placeholder="Enter 6-digit pincode"
                  maxLength={6}
                  className="flex-1 rounded-lg border border-[#D6CCBF] px-3 py-2 text-sm text-[#1C0A04] placeholder:text-[#A0673A]/40 focus:border-[#C4956A] focus:outline-none transition"
                />
                <button
                  onClick={handleCheckPincode}
                  className="rounded-lg bg-[#5C2E1A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3D1A0A] transition-colors"
                >
                  Check
                </button>
              </div>
              <AnimatePresence>
                {pincodeChecked && pincodeResult && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-sm text-emerald-700 font-medium"
                  >
                    <CheckCircle className="h-4 w-4" />
                    {pincodeResult} · Free Delivery
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Trust strip */}
            <div className="grid grid-cols-3 gap-3 rounded-xl border border-[#D6CCBF] bg-white p-4">
              {[
                { Icon: Truck,     text: "Free Shipping", sub: "Over ₹999" },
                { Icon: RotateCcw, text: "30-Day Returns", sub: "Easy returns" },
                { Icon: Shield,    text: "Authentic",      sub: "100% genuine" },
              ].map(({ Icon, text, sub }) => (
                <div key={text} className="flex flex-col items-center gap-1 text-center">
                  <Icon className="h-5 w-5 text-[#C4956A]" />
                  <p className="text-xs font-semibold text-[#3D1A0A]">{text}</p>
                  <p className="text-[10px] text-[#A0673A]">{sub}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            {product.description && (
              <div className="rounded-xl border border-[#D6CCBF] bg-white p-4">
                <h3 className="font-semibold text-[#1C0A04] mb-2">About this product</h3>
                <p className="text-sm leading-relaxed text-[#5C2E1A]">{product.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Reviews section ───────────────────────────────────────────────── */}
        <section id="reviews-section" className="mt-20 border-t border-[#D6CCBF] pt-16">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#A0673A]">Customer Reviews</p>
              <h2 className="mt-2 font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#1C0A04]">
                Ratings & Reviews
              </h2>
            </div>
            {isAuthenticated && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="flex items-center gap-2 rounded-full border-2 border-[#5C2E1A] px-5 py-2.5 text-sm font-semibold text-[#5C2E1A] hover:bg-[#5C2E1A] hover:text-[#F7F3EE] transition-all"
              >
                <MessageSquare className="h-4 w-4" />
                Write a Review
              </button>
            )}
          </div>

          {/* Rating summary */}
          {product.totalReviews > 0 && (
            <div className="mb-8 flex items-center gap-6 rounded-2xl border border-[#D6CCBF] bg-white p-6">
              <div className="text-center flex-shrink-0">
                <p className="text-5xl font-bold text-[#1C0A04]">{product.averageRating.toFixed(1)}</p>
                <div className="mt-1 flex justify-center">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className={cn("h-4 w-4", s <= Math.round(product.averageRating) ? "fill-amber-400 text-amber-400" : "text-[#D6CCBF]")} />
                  ))}
                </div>
                <p className="mt-1 text-xs text-[#A0673A]">{product.totalReviews} ratings</p>
              </div>
              <div className="flex-1 space-y-1.5">
                {[5,4,3,2,1].map((star) => {
                  const count = reviews.filter((r) => r.rating === star).length;
                  const pct   = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 text-xs">
                      <span className="w-3 text-right text-[#A0673A]">{star}</span>
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <div className="flex-1 h-1.5 rounded-full bg-[#EDE8E0]">
                        <div className="h-1.5 rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[#A0673A] w-4">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Review form */}
          <AnimatePresence>
            {showReviewForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden"
              >
                <form
                  onSubmit={handleSubmitReview}
                  className="rounded-2xl border-2 border-[#C4956A] bg-white p-6 space-y-4"
                >
                  <h3 className="font-semibold text-[#1C0A04] text-lg">Your Review</h3>

                  {/* Star rating picker */}
                  <div>
                    <p className="text-sm font-medium text-[#5C2E1A] mb-2">Overall Rating *</p>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setReviewRating(s)}
                          onMouseEnter={() => setReviewHover(s)}
                          onMouseLeave={() => setReviewHover(0)}
                          className="transition-transform hover:scale-110"
                        >
                          <Star className={cn(
                            "h-8 w-8 transition-colors",
                            s <= (reviewHover || reviewRating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-[#D6CCBF]"
                          )} />
                        </button>
                      ))}
                      {reviewRating > 0 && (
                        <span className="ml-2 self-center text-sm text-[#A0673A]">
                          {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][reviewRating]}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-[#3D1A0A] mb-1.5">Review Title</label>
                    <input
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="Summarise your experience"
                      className="w-full rounded-xl border border-[#D6CCBF] px-4 py-2.5 text-sm text-[#1C0A04] focus:border-[#C4956A] focus:outline-none transition"
                    />
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-sm font-semibold text-[#3D1A0A] mb-1.5">Detailed Review</label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="What did you like or dislike? How was the fit and quality?"
                      rows={4}
                      className="w-full resize-none rounded-xl border border-[#D6CCBF] px-4 py-2.5 text-sm text-[#1C0A04] focus:border-[#C4956A] focus:outline-none transition"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={submittingReview || reviewRating === 0}
                      className="rounded-full bg-[#1C0A04] px-8 py-3 font-semibold text-[#F7F3EE] hover:bg-[#3D1A0A] disabled:opacity-50 transition-colors flex items-center gap-2"
                    >
                      {submittingReview ? <><Spinner size="sm" className="text-[#F7F3EE]" /> Submitting…</> : "Submit Review"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="rounded-full border border-[#D6CCBF] px-6 py-3 text-sm font-semibold text-[#5C2E1A] hover:bg-[#EDE8E0] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Review list */}
          {reviews.length > 0 ? (
            <div className="space-y-5">
              {reviews.map((r) => (
                <div key={r.id} className="rounded-2xl border border-[#D6CCBF] bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#C4956A] to-[#5C2E1A] font-bold text-[#F7F3EE]">
                        {r.userFirstName[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[#3D1A0A]">{r.userFirstName} {r.userLastName}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          {[1,2,3,4,5].map((s) => (
                            <Star key={s} className={cn("h-3 w-3", s <= r.rating ? "fill-amber-400 text-amber-400" : "text-[#D6CCBF]")} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-[#A0673A] flex-shrink-0">
                      {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  {r.title   && <h4 className="mt-3 font-semibold text-[#1C0A04]">{r.title}</h4>}
                  {r.comment && <p className="mt-1 text-sm leading-relaxed text-[#5C2E1A]">{r.comment}</p>}
                  {r.verified && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                      <CheckCircle className="h-3 w-3" /> Verified Purchase
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-[#D6CCBF] p-10 text-center">
              <ThumbsUp className="mx-auto h-10 w-10 text-[#C4956A]/40 mb-3" />
              <p className="font-semibold text-[#5C2E1A]">No reviews yet</p>
              <p className="mt-1 text-sm text-[#A0673A]">Be the first to review this product.</p>
              {!isAuthenticated && (
                <Link href="/login" className="mt-4 inline-block rounded-full bg-[#5C2E1A] px-6 py-2.5 text-sm font-semibold text-[#F7F3EE] hover:bg-[#3D1A0A] transition-colors">
                  Sign in to review
                </Link>
              )}
            </div>
          )}
        </section>

        {/* ── Related products ──────────────────────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 border-t border-[#D6CCBF] pt-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#A0673A]">{product.category?.name}</p>
                <h2 className="mt-2 font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#1C0A04]">
                  You May Also Like
                </h2>
              </div>
              {product.category && (
                <Link
                  href={`/shop?categoryId=${product.category.id}`}
                  className="hidden items-center gap-1.5 text-sm font-semibold text-[#5C2E1A] hover:text-[#3D1A0A] transition-colors sm:flex"
                >
                  View all <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
              {relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </Container>
    </main>
  );
}
