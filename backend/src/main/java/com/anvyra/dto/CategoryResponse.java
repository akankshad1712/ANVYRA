package com.anvyra.dto;

public record CategoryResponse(
    Long id,
    String name,
    String slug,
    String description,
    String imageUrl,
    Boolean active
) {}
