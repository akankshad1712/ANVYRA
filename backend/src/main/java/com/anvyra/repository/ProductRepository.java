package com.anvyra.repository;

import com.anvyra.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByActiveTrue(Pageable pageable);

    Page<Product> findByCategoryIdAndActiveTrue(Long categoryId, Pageable pageable);

    Page<Product> findByFeaturedTrueAndActiveTrue(Pageable pageable);

    @Query("""
        SELECT p FROM Product p
        WHERE p.active = true
        AND (:categoryId IS NULL OR p.category.id = :categoryId)
        AND (:minPrice IS NULL OR p.price >= :minPrice)
        AND (:maxPrice IS NULL OR p.price <= :maxPrice)
        AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%'))
             OR LOWER(p.brand) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%'))
             OR LOWER(p.description) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')))
        """)
    Page<Product> searchProducts(
            @Param("categoryId") Long categoryId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("search") String search,
            Pageable pageable
    );

    @Query("SELECT p FROM Product p WHERE p.active = true ORDER BY p.createdAt DESC")
    Page<Product> findNewArrivals(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.featured = true AND p.active = true ORDER BY p.averageRating DESC")
    Page<Product> findBestSellers(Pageable pageable);

    // ─── Admin helpers ────────────────────────────────────────────────────────

    /** All products regardless of active status — for admin */
    @Query("""
        SELECT p FROM Product p
        WHERE (:active IS NULL OR p.active = :active)
        AND (:categoryId IS NULL OR p.category.id = :categoryId)
        AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%'))
             OR LOWER(p.brand) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')))
        """)
    Page<Product> findAllAdmin(
            @Param("active") Boolean active,
            @Param("categoryId") Long categoryId,
            @Param("search") String search,
            Pageable pageable
    );

    long countByActiveTrue();
    long countByFeaturedTrueAndActiveTrue();

    @Query("SELECT COUNT(p) FROM Product p WHERE p.quantity = 0")
    long countOutOfStock();

    @Query("SELECT COUNT(p) FROM Product p WHERE p.quantity > 0 AND p.quantity <= :threshold")
    long countLowStock(@Param("threshold") int threshold);
}
