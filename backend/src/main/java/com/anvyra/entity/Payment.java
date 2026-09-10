package com.anvyra.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "payments",
    indexes = { @Index(name = "idx_payment_order", columnList = "order_id") }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PaymentMethod paymentMethod;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    // Gateway-specific transaction reference
    @Column(length = 255)
    private String transactionId;

    // Gateway: RAZORPAY, STRIPE, etc.
    @Column(length = 50)
    private String gateway;

    // Raw gateway response (JSON) for debugging/audit
    @Column(columnDefinition = "TEXT")
    private String gatewayResponse;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (paymentStatus == null) paymentStatus = PaymentStatus.PENDING;
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum PaymentMethod {
        CARD,
        UPI,
        NET_BANKING,
        COD,
        WALLET
    }

    public enum PaymentStatus {
        PENDING,
        INITIATED,
        SUCCESS,
        FAILED,
        REFUNDED,
        CANCELLED
    }
}
