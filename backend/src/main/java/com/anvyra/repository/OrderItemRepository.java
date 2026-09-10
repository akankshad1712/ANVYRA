package com.anvyra.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.anvyra.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

}