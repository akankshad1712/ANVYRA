import { api } from "@/lib/api-client";
import type { Order, PagedResponse, PlaceOrderRequest } from "@/types";

export const ordersService = {
  placeOrder: (data: PlaceOrderRequest) =>
    api.post<Order>("/orders", data),

  getMyOrders: (page = 0, size = 10) =>
    api.get<PagedResponse<Order>>("/orders", { params: { page, size } }),

  getOrderById: (id: number) => api.get<Order>(`/orders/${id}`),

  getOrderByNumber: (orderNumber: string) =>
    api.get<Order>(`/orders/number/${orderNumber}`),

  cancelOrder: (id: number) => api.patch<Order>(`/orders/${id}/cancel`),
};
