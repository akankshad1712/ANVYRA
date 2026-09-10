package com.anvyra.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.anvyra.entity.Payment;
import com.anvyra.repository.PaymentRepository;
import com.anvyra.service.PaymentService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;


    @Override
    public Payment save(Payment payment) {
        return paymentRepository.save(payment);
    }


    @Override
    public Optional<Payment> getById(Long id) {
        return paymentRepository.findById(id);
    }


    @Override
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }


    @Override
    public void delete(Long id) {
        paymentRepository.deleteById(id);
    }
}