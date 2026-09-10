package com.anvyra.service;

import com.anvyra.dto.CartItemRequest;
import com.anvyra.dto.CartResponse;

public interface CartService {
    CartResponse getCart(Long userId);
    CartResponse addItem(Long userId, CartItemRequest request);
    CartResponse updateItemQuantity(Long userId, Long itemId, int quantity);
    CartResponse removeItem(Long userId, Long itemId);
    void clearCart(Long userId);
}
