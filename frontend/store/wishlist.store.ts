"use client";

import { create } from "zustand";
import type { Product } from "@/types";
import { wishlistService } from "@/services/wishlist.service";

interface WishlistState {
  items: Product[];
  isLoading: boolean;

  fetchWishlist: () => Promise<void>;
  toggle: (productId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
  reset: () => void;
}

export const useWishlistStore = create<WishlistState>()((set, get) => ({
  items: [],
  isLoading: false,

  fetchWishlist: async () => {
    set({ isLoading: true });
    try {
      const items = await wishlistService.getWishlist();
      set({ items });
    } catch {
      // Not authenticated
    } finally {
      set({ isLoading: false });
    }
  },

  toggle: async (productId) => {
    const inList = get().isInWishlist(productId);
    try {
      if (inList) {
        const items = await wishlistService.removeFromWishlist(productId);
        set({ items });
      } else {
        const items = await wishlistService.addToWishlist(productId);
        set({ items });
      }
    } catch {
      // handle silently
    }
  },

  isInWishlist: (productId) =>
    get().items.some((p) => p.id === productId),

  reset: () => set({ items: [] }),
}));
