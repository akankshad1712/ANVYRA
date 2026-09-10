import { api } from "@/lib/api-client";
import type { PagedResponse, Review, ReviewRequest } from "@/types";

export const reviewsService = {
  getProductReviews: (productId: number, page = 0, size = 10) =>
    api.get<PagedResponse<Review>>(`/reviews/product/${productId}`, {
      auth: false,
      params: { page, size },
    }),

  create: (data: ReviewRequest) => api.post<Review>("/reviews", data),

  update: (id: number, data: Partial<ReviewRequest>) =>
    api.put<Review>(`/reviews/${id}`, data),

  delete: (id: number) => api.delete<void>(`/reviews/${id}`),
};
