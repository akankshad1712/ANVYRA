package com.anvyra.controller;

import com.anvyra.entity.Payment;
import com.anvyra.entity.User;
import com.anvyra.exception.ResourceNotFoundException;
import com.anvyra.exception.BadRequestException;
import com.anvyra.repository.OrderRepository;
import com.anvyra.repository.PaymentRepository;
import com.anvyra.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Payment controller — currently supports COD and records
 * payment status. A payment gateway integration (Razorpay/Stripe)
 * requires configuring the respective credentials via environment variables:
 *   RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
 *   or
 *   STRIPE_SECRET_KEY
 */
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    /** Get payment details for an order */
    @GetMapping("/order/{orderId}")
    public ResponseEntity<Map<String, Object>> getPaymentForOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long orderId) {

        User user = resolveUser(userDetails);

        var order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Order does not belong to you");
        }

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment for order", orderId));

        return ResponseEntity.ok(Map.of(
                "id", payment.getId(),
                "orderId", orderId,
                "amount", payment.getAmount(),
                "paymentMethod", payment.getPaymentMethod(),
                "paymentStatus", payment.getPaymentStatus(),
                "transactionId", payment.getTransactionId() != null ? payment.getTransactionId() : "",
                "createdAt", payment.getCreatedAt()
        ));
    }

    /**
     * Webhook/callback to update payment status after gateway confirmation.
     * In production, this should verify a webhook signature from your gateway.
     * Required env config: payment gateway credentials.
     */
    @PostMapping("/webhook/confirm")
    public ResponseEntity<Map<String, String>> confirmPayment(
            @RequestParam String transactionId,
            @RequestParam String orderId,
            @RequestParam String status) {

        Payment payment = paymentRepository.findByOrderId(Long.valueOf(orderId))
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "orderId", orderId));

        payment.setTransactionId(transactionId);
        try {
            payment.setPaymentStatus(Payment.PaymentStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid payment status: " + status);
        }

        paymentRepository.save(payment);

        // Update order status if payment succeeded
        if (payment.getPaymentStatus() == Payment.PaymentStatus.SUCCESS) {
            var order = payment.getOrder();
            order.setStatus(com.anvyra.entity.Order.OrderStatus.CONFIRMED);
            orderRepository.save(order);
        }

        return ResponseEntity.ok(Map.of("message", "Payment status updated"));
    }

    private User resolveUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userDetails.getUsername()));
    }
}
