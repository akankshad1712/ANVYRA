package com.anvyra.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record ProductResponse(
    Long id,
    String name,
    String description,
    String brand,
    BigDecimal price,
    BigDecimal discountPrice,
    BigDecimal effectivePrice,
    Integer quantity,
    Boolean active,
    Boolean featured,
    List<String> images,
    List<String> sizes,
    List<String> colors,
    CategoryResponse category,
    Double averageRating,
    Integer totalReviews,
    LocalDateTime createdAt
) {}
