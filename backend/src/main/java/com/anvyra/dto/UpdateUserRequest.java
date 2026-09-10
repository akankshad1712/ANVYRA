package com.anvyra.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateUserRequest(
    @Size(min = 2, max = 50) String firstName,
    @Size(min = 2, max = 50) String lastName,
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be exactly 10 digits") String phoneNumber,
    String profileImage
) {}
