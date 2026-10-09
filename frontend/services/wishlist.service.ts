import { api } from "@/lib/api-client";
import type { Product } from "@/types";

export const wishlistService = {
  getWishlist: () => api.get<Product[]>("/wishlist"),
  addToWishlist: (productId: number) => api.post<Product[]>(`/wishlist/${productId}`),
  removeFromWishlist: (productId: number) => api.delete<Product[]>(`/wishlist/${productId}`),
  checkInWishlist: (productId: number) =>
    api.get<{ inWishlist: boolean }>(`/wishlist/${productId}/check`),
};



