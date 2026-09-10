package com.anvyra.repository;

import com.anvyra.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

    @Query("SELECT c FROM Cart c LEFT JOIN FETCH c.items i LEFT JOIN FETCH i.product WHERE c.user.id = :userId")
    Optional<Cart> findByUserIdWithItems(Long userId);

    boolean existsByUserId(Long userId);
}
