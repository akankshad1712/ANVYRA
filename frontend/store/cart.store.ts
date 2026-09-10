"use client";

import { create } from "zustand";
import type { Cart, AddToCartRequest } from "@/types";
import { cartService } from "@/services/cart.service";

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  isOpen: boolean;

  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  fetchCart: () => Promise<void>;
  addItem: (item: AddToCartRequest) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  reset: () => void;
}

export const useCartStore = create<CartState>()((set) => ({
  cart: null,
  isLoading: false,
  isOpen: false,

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const cart = await cartService.getCart();
      set({ cart });
    } catch {
      // Not authenticated or empty
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (item) => {
    set({ isLoading: true });
    try {
      const cart = await cartService.addItem(item);
      set({ cart, isOpen: true });
    } finally {
      set({ isLoading: false });
    }
  },

  updateQuantity: async (itemId, quantity) => {
    set({ isLoading: true });
    try {
      const cart = await cartService.updateQuantity(itemId, quantity);
      set({ cart });
    } finally {
      set({ isLoading: false });
    }
  },

  removeItem: async (itemId) => {
    set({ isLoading: true });
    try {
      const cart = await cartService.removeItem(itemId);
      set({ cart });
    } finally {
      set({ isLoading: false });
    }
  },

  clearCart: async () => {
    set({ isLoading: true });
    try {
      await cartService.clearCart();
      set({ cart: null });
    } finally {
      set({ isLoading: false });
    }
  },

  reset: () => set({ cart: null, isOpen: false }),
}));
