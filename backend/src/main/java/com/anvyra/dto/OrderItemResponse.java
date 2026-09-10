package com.anvyra.dto;

import java.math.BigDecimal;

public record OrderItemResponse(
    Long id,
    Long productId,
    String productName,
    String productImage,
    Integer quantity,
    BigDecimal price,
    BigDecimal subtotal,
    String selectedSize,
    String selectedColor
) {}
