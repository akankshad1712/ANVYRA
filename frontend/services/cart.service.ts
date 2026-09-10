import { api } from "@/lib/api-client";
import type { AddToCartRequest, Cart } from "@/types";

export const cartService = {
  getCart: () => api.get<Cart>("/cart"),

  addItem: (data: AddToCartRequest) => api.post<Cart>("/cart/items", data),

  updateQuantity: (itemId: number, quantity: number) =>
    api.patch<Cart>(`/cart/items/${itemId}`, undefined, {
      params: { quantity },
    }),

  removeItem: (itemId: number) => api.delete<Cart>(`/cart/items/${itemId}`),

  clearCart: () => api.delete<void>("/cart"),
};
