package com.anvyra.service;

import com.anvyra.dto.ProductResponse;

import java.util.List;

public interface WishlistService {
    List<ProductResponse> getWishlist(Long userId);
    List<ProductResponse> addToWishlist(Long userId, Long productId);
    List<ProductResponse> removeFromWishlist(Long userId, Long productId);
    boolean isInWishlist(Long userId, Long productId);
}
