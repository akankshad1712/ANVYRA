"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";

/**
 * Bootstraps auth on mount — fetches the current user if a token
 * is stored in localStorage. Also loads cart and wishlist.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { fetchMe, isAuthenticated } = useAuthStore();
  const { fetchCart } = useCartStore();
  const { fetchWishlist } = useWishlistStore();

  useEffect(() => {
    fetchMe().then(() => {
      if (useAuthStore.getState().isAuthenticated) {
        fetchCart();
        fetchWishlist();
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When auth state changes (login/logout), refresh cart & wishlist
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchWishlist();
    } else {
      useCartStore.getState().reset();
      useWishlistStore.getState().reset();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return <>{children}</>;
}
