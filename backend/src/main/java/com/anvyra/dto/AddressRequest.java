package com.anvyra.dto;

import jakarta.validation.constraints.NotBlank;

public record AddressRequest(
    @NotBlank String fullName,
    @NotBlank String phone,
    @NotBlank String street,
    String street2,
    @NotBlank String city,
    @NotBlank String state,
    @NotBlank String postalCode,
    @NotBlank String country,
    Boolean isDefault
) {}
