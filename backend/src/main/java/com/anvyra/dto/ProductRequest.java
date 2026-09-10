package com.anvyra.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;

public record ProductRequest(
    @NotBlank(message = "Product name is required")
    @Size(min = 2, max = 200)
    String name,

    String description,

    @NotBlank(message = "Brand is required")
    String brand,

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false)
    BigDecimal price,

    BigDecimal discountPrice,

    @Min(0)
    Integer quantity,

    Boolean active,
    Boolean featured,

    List<String> images,
    List<String> sizes,
    List<String> colors,

    Long categoryId
) {}
