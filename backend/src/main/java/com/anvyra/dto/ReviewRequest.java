package com.anvyra.dto;

import jakarta.validation.constraints.*;

public record ReviewRequest(
    @NotNull Long productId,
    @Min(1) @Max(5) @NotNull Integer rating,
    @Size(max = 200) String title,
    @Size(max = 1000) String comment
) {}
