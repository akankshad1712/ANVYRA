package com.anvyra.dto;

import java.time.LocalDateTime;

public record ReviewResponse(
    Long id,
    Long productId,
    Long userId,
    String userFirstName,
    String userLastName,
    Integer rating,
    String title,
    String comment,
    Boolean verified,
    LocalDateTime createdAt
) {}
