package com.anvyra.dto;

import com.anvyra.entity.Order.OrderStatus;
import com.anvyra.entity.Payment;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
    Long id,
    String orderNumber,
    List<OrderItemResponse> items,
    AddressResponse shippingAddress,
    OrderStatus status,
    BigDecimal subtotal,
    BigDecimal shippingCost,
    BigDecimal discount,
    BigDecimal totalAmount,
    Payment.PaymentMethod paymentMethod,
    Payment.PaymentStatus paymentStatus,
    String transactionId,
    String notes,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
