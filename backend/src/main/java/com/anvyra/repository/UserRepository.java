package com.anvyra.repository;

import java.util.Optional;

import com.anvyra.entity.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.jpa.repository.JpaRepository;

import com.anvyra.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    long countByRole(UserRole role);

    @Query("SELECT u FROM User u WHERE u.role = com.anvyra.entity.UserRole.CUSTOMER AND (:search IS NULL OR LOWER(u.email) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) OR LOWER(u.firstName) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) OR LOWER(u.lastName) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')))")
    Page<User> findCustomers(@org.springframework.data.repository.query.Param("search") String search, Pageable pageable);

    @Query("SELECT u FROM User u ORDER BY u.createdAt DESC")
    java.util.List<User> findRecentUsers(Pageable pageable);
}