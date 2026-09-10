package com.anvyra.dto;

import com.anvyra.entity.Payment;
import jakarta.validation.constraints.NotNull;

public record OrderRequest(
    @NotNull Long shippingAddressId,
    @NotNull Payment.PaymentMethod paymentMethod,
    String notes
) {}
