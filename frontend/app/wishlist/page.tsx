"use client";

import { useWishlistStore } from "@/store/wishlist.store";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { useToast } from "@/providers/toast-provider";
import Container from "@/components/common/Container";
import EmptyState from "@/components/common/EmptyState";
import ProductCard from "@/components/product/ProductCard";
import { Heart, ShoppingBag } from "lucide-react";

export default function WishlistPage() {
  const { items, toggle: removeItem } = useWishlistStore();
  const { addItem }        = useCartStore();
  const { isAuthenticated }= useAuthStore();
  const { success, error: showError } = useToast();

  if (!isAuthenticated) {
    return (
      <main className="py-20 bg-[#F7F3EE]">
        <Container>
          <EmptyState
            icon={<Heart className="h-12 w-12" />}
            title="Sign in to view your wishlist"
            description="Save your favourite pieces and access them from any device."
            action={{ label: "Sign In", href: "/login" }}
          />
        </Container>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="py-20 bg-[#F7F3EE]">
        <Container>
          <EmptyState
            icon={<Heart className="h-12 w-12" />}
            title="Your wishlist is empty"
            description="Heart products you love to save them here."
            action={{ label: "Browse Products", href: "/shop" }}
          />
        </Container>
      </main>
    );
  }

  const handleMoveToCart = async (productId: number) => {
    try {
      await addItem({ productId, quantity: 1 });
      await removeItem(productId);
      success("Moved to cart!");
    } catch { showError("Failed to move to cart"); }
  };

  return (
    <main className="py-10 bg-[#F7F3EE]">
      <Container>
        <div className="mb-8">
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[#1C0A04]">
            Wishlist <span className="text-[#A0673A] font-normal text-xl">({items.length})</span>
          </h1>
          <p className="mt-1 text-[#A0673A]">Your saved pieces</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {items.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
              <button
                onClick={() => handleMoveToCart(product.id)}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full border border-[#D6CCBF] py-2 text-xs font-medium text-[#5C2E1A] hover:border-[#C4956A] hover:bg-[#EDE8E0] transition-colors"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                Move to Cart
              </button>
            </div>
          ))}
        </div>
      </Container>
    </main>
  );
}
