package com.anvyra.service;

import java.util.List;
import java.util.Optional;

import com.anvyra.entity.Payment;

public interface PaymentService {

    Payment save(Payment payment);

    Optional<Payment> getById(Long id);

    List<Payment> getAllPayments();

    void delete(Long id);
}