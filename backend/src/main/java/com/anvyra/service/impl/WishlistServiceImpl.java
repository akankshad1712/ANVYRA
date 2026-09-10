package com.anvyra.service.impl;

import com.anvyra.dto.ProductResponse;
import com.anvyra.entity.Product;
import com.anvyra.entity.User;
import com.anvyra.entity.Wishlist;
import com.anvyra.exception.ResourceNotFoundException;
import com.anvyra.mapper.EntityMapper;
import com.anvyra.repository.ProductRepository;
import com.anvyra.repository.UserRepository;
import com.anvyra.repository.WishlistRepository;
import com.anvyra.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final EntityMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getWishlist(Long userId) {
        return getOrCreate(userId).getProducts().stream()
                .map(mapper::toProductResponse)
                .toList();
    }

    @Override
    public List<ProductResponse> addToWishlist(Long userId, Long productId) {
        Wishlist wishlist = getOrCreate(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));

        boolean alreadyAdded = wishlist.getProducts().stream()
                .anyMatch(p -> p.getId().equals(productId));
        if (!alreadyAdded) {
            wishlist.getProducts().add(product);
            wishlistRepository.save(wishlist);
        }
        return wishlist.getProducts().stream().map(mapper::toProductResponse).toList();
    }

    @Override
    public List<ProductResponse> removeFromWishlist(Long userId, Long productId) {
        Wishlist wishlist = getOrCreate(userId);
        wishlist.getProducts().removeIf(p -> p.getId().equals(productId));
        return wishlistRepository.save(wishlist).getProducts().stream()
                .map(mapper::toProductResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isInWishlist(Long userId, Long productId) {
        return wishlistRepository.findByUserIdWithProducts(userId)
                .map(w -> w.getProducts().stream().anyMatch(p -> p.getId().equals(productId)))
                .orElse(false);
    }

    private Wishlist getOrCreate(Long userId) {
        return wishlistRepository.findByUserIdWithProducts(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", userId));
            return wishlistRepository.save(Wishlist.builder().user(user).build());
        });
    }
}
