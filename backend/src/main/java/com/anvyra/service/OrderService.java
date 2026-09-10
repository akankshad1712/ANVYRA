package com.anvyra.service;

import com.anvyra.dto.OrderRequest;
import com.anvyra.dto.OrderResponse;
import com.anvyra.dto.PagedResponse;
import com.anvyra.entity.Order.OrderStatus;
import org.springframework.data.domain.Pageable;

public interface OrderService {
    OrderResponse placeOrder(Long userId, OrderRequest request);
    OrderResponse getOrderById(Long id, Long userId);
    OrderResponse getOrderByNumber(String orderNumber, Long userId);
    PagedResponse<OrderResponse> getUserOrders(Long userId, Pageable pageable);
    OrderResponse updateStatus(Long id, OrderStatus status);
    OrderResponse cancelOrder(Long id, Long userId);
    PagedResponse<OrderResponse> getAllOrders(Pageable pageable);
}
