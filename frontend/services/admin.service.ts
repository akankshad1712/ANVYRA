import { api } from "@/lib/api-client";
import type {
  DashboardStats,
  PagedResponse,
  Product,
  ProductRequest,
  Category,
  CategoryRequest,
  Order,
  OrderStatus,
  User,
} from "@/types";

export const adminService = {
  // ── Dashboard ──────────────────────────────────────────────────────────────
  getDashboardStats: () =>
    api.get<DashboardStats>("/admin/dashboard/stats"),

  // ── Products (admin view — includes inactive) ──────────────────────────────
  listAllProducts: (params?: {
    active?: boolean;
    categoryId?: number;
    search?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: "asc" | "desc";
  }) =>
    api.get<PagedResponse<Product>>("/admin/products", {
      params: params as Record<string, string | number | boolean | undefined | null>,
    }),

  // ── Categories (reuses existing public + admin endpoints) ──────────────────
  listCategories: () => api.get<Category[]>("/categories"),

  createCategory: (data: CategoryRequest) =>
    api.post<Category>("/categories", data),

  updateCategory: (id: number, data: Partial<CategoryRequest>) =>
    api.put<Category>(`/categories/${id}`, data),

  deleteCategory: (id: number) => api.delete<void>(`/categories/${id}`),

  // ── Products CRUD (reuses existing admin-protected endpoints) ─────────────
  createProduct: (data: ProductRequest) =>
    api.post<Product>("/products", data),

  updateProduct: (id: number, data: Partial<ProductRequest>) =>
    api.put<Product>(`/products/${id}`, data),

  deleteProduct: (id: number) => api.delete<void>(`/products/${id}`),

  getProduct: (id: number) =>
    api.get<Product>(`/products/${id}`, { auth: false }),

  // ── Orders (admin) ────────────────────────────────────────────────────────
  listAllOrders: (page = 0, size = 20) =>
    api.get<PagedResponse<Order>>("/orders/admin/all", {
      params: { page, size },
    }),

  updateOrderStatus: (id: number, status: OrderStatus) =>
    api.patch<Order>(`/orders/${id}/status`, undefined, {
      params: { status },
    }),

  getOrderById: (id: number) =>
    api.get<Order>(`/admin/orders/${id}`),

  // ── Users ─────────────────────────────────────────────────────────────────
  listUsers: (params?: { search?: string; page?: number; size?: number }) =>
    api.get<PagedResponse<User>>("/admin/users", {
      params: params as Record<string, string | number | undefined | null>,
    }),
}; 