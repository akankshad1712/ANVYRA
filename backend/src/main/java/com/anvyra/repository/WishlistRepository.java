package com.anvyra.repository;

import com.anvyra.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    @Query("SELECT w FROM Wishlist w LEFT JOIN FETCH w.products WHERE w.user.id = :userId")
    Optional<Wishlist> findByUserIdWithProducts(Long userId);

    boolean existsByUserId(Long userId);
}
