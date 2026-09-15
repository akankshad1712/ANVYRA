package com.anvyra.repository;

import com.anvyra.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    boolean existsByName(String name);

    Optional<Category> findBySlug(String slug);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(p) FROM Product p WHERE p.category.id = :categoryId")
    long countProductsByCategoryId(@org.springframework.data.repository.query.Param("categoryId") Long categoryId);
}
