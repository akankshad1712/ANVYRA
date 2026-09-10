import { api } from "@/lib/api-client";
import type { PagedResponse, Product, ProductFilters } from "@/types";

export const productsService = {
  getAll: (filters: ProductFilters = {}) => {
    const { page = 0, size = 20, sortBy = "createdAt", sortDir = "desc", ...rest } = filters;
    return api.get<PagedResponse<Product>>("/products", {
      auth: false,
      params: { page, size, sortBy, sortDir, ...rest },
    });
  },

  getById: (id: number) =>
    api.get<Product>(`/products/${id}`, { auth: false }),

  getFeatured: (page = 0, size = 12) =>
    api.get<PagedResponse<Product>>("/products/featured", {
      auth: false,
      params: { page, size },
    }),

  getNewArrivals: (page = 0, size = 12) =>
    api.get<PagedResponse<Product>>("/products/new-arrivals", {
      auth: false,
      params: { page, size },
    }),

  getBestSellers: (page = 0, size = 12) =>
    api.get<PagedResponse<Product>>("/products/best-sellers", {
      auth: false,
      params: { page, size },
    }),

  getByCategory: (categoryId: number, page = 0, size = 20) =>
    api.get<PagedResponse<Product>>(`/products/category/${categoryId}`, {
      auth: false,
      params: { page, size },
    }),
};
