package com.anvyra.dto;

import com.anvyra.entity.UserRole;
import java.time.LocalDateTime;

public record UserResponse(
    Long id,
    String firstName,
    String lastName,
    String email,
    String phoneNumber,
    String profileImage,
    UserRole role,
    Boolean enabled,
    LocalDateTime createdAt
) {}
