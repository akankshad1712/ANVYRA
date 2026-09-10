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
        AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%'))
             OR LOWER(p.brand) LIKE LOWER(CONCAT('%', :search, '%'))
             OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))
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
}
