package com.anvyra.entity;

import java.math.BigDecimal;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    // Price snapshot at time of order
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    // Product name snapshot (in case product is deleted later)
    @Column(nullable = false, length = 200)
    private String productName;

    @Column(length = 500)
    private String productImage;

    @Column(length = 20)
    private String selectedSize;

    @Column(length = 50)
    private String selectedColor;

    @Transient
    public BigDecimal getSubtotal() {
        return price.multiply(BigDecimal.valueOf(quantity));
    }
}
