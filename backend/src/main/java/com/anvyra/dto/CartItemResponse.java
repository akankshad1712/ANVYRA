package com.anvyra.dto;

import java.math.BigDecimal;

public record CartItemResponse(
    Long id,
    Long productId,
    String productName,
    String productImage,
    BigDecimal price,
    Integer quantity,
    BigDecimal subtotal,
    String selectedSize,
    String selectedColor
) {}
