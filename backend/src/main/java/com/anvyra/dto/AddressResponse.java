package com.anvyra.dto;

public record AddressResponse(
    Long id,
    String fullName,
    String phone,
    String street,
    String street2,
    String city,
    String state,
    String postalCode,
    String country,
    Boolean isDefault
) {}
