import { api } from "@/lib/api-client";
import type { Category } from "@/types";

export const categoriesService = {
  getAll: () => api.get<Category[]>("/categories", { auth: false }),
  getById: (id: number) => api.get<Category>(`/categories/${id}`, { auth: false }),
};
