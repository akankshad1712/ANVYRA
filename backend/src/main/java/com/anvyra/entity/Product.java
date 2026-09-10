package com.anvyra.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "products",
    indexes = {
        @Index(name = "idx_product_category", columnList = "category_id"),
        @Index(name = "idx_product_active", columnList = "active"),
        @Index(name = "idx_product_featured", columnList = "featured")
    }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Product name is required")
    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotBlank(message = "Brand is required")
    @Column(nullable = false)
    private String brand;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Builder.Default
    @Column(precision = 10, scale = 2)
    private BigDecimal discountPrice = BigDecimal.ZERO;

    @Builder.Default
    @Min(0)
    private Integer quantity = 0;

    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true;

    @Builder.Default
    @Column(nullable = false)
    private Boolean featured = false;

    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url", length = 500)
    @Builder.Default
    private List<String> images = new ArrayList<>();

    // Sizes available: XS, S, M, L, XL, XXL
    @ElementCollection
    @CollectionTable(name = "product_sizes", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "size", length = 10)
    @Builder.Default
    private List<String> sizes = new ArrayList<>();

    // Colors: stored as hex or color name
    @ElementCollection
    @CollectionTable(name = "product_colors", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "color", length = 50)
    @Builder.Default
    private List<String> colors = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Builder.Default
    @Column(nullable = false)
    private Double averageRating = 0.0;

    @Builder.Default
    @Column(nullable = false)
    private Integer totalReviews = 0;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (active == null) active = true;
        if (featured == null) featured = false;
        if (discountPrice == null) discountPrice = BigDecimal.ZERO;
        if (quantity == null) quantity = 0;
        if (averageRating == null) averageRating = 0.0;
        if (totalReviews == null) totalReviews = 0;
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Convenience: effective price (discounted if set)
    @Transient
    public BigDecimal getEffectivePrice() {
        if (discountPrice != null && discountPrice.compareTo(BigDecimal.ZERO) > 0) {
            return discountPrice;
        }
        return price;
    }
}
