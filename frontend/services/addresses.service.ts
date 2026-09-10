import { api } from "@/lib/api-client";
import type { Address, AddressRequest } from "@/types";

export const addressesService = {
  getAll: () => api.get<Address[]>("/addresses"),
  getById: (id: number) => api.get<Address>(`/addresses/${id}`),
  create: (data: AddressRequest) => api.post<Address>("/addresses", data),
  update: (id: number, data: Partial<AddressRequest>) =>
    api.put<Address>(`/addresses/${id}`, data),
  delete: (id: number) => api.delete<void>(`/addresses/${id}`),
  setDefault: (id: number) => api.patch<Address>(`/addresses/${id}/default`),
};
