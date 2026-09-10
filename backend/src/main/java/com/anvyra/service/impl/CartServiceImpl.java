package com.anvyra.service.impl;

import com.anvyra.dto.CartItemRequest;
import com.anvyra.dto.CartResponse;
import com.anvyra.entity.*;
import com.anvyra.exception.BadRequestException;
import com.anvyra.exception.ResourceNotFoundException;
import com.anvyra.exception.UnauthorizedException;
import com.anvyra.mapper.EntityMapper;
import com.anvyra.repository.*;
import com.anvyra.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final EntityMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public CartResponse getCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return mapper.toCartResponse(cart);
    }

    @Override
    public CartResponse addItem(Long userId, CartItemRequest request) {
        Cart cart = getOrCreateCart(userId);
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", request.productId()));

        if (!product.getActive()) throw new BadRequestException("Product is not available");
        if (product.getQuantity() < request.quantity()) {
            throw new BadRequestException("Insufficient stock. Available: " + product.getQuantity());
        }

        // Check if item already in cart (same product + size + color)
        cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId())
                .ifPresentOrElse(
                        existing -> {
                            int newQty = existing.getQuantity() + request.quantity();
                            if (newQty > product.getQuantity()) {
                                throw new BadRequestException("Insufficient stock. Available: " + product.getQuantity());
                            }
                            existing.setQuantity(newQty);
                            cartItemRepository.save(existing);
                        },
                        () -> {
                            CartItem item = CartItem.builder()
                                    .cart(cart)
                                    .product(product)
                                    .quantity(request.quantity())
                                    .price(product.getEffectivePrice())
                                    .selectedSize(request.selectedSize())
                                    .selectedColor(request.selectedColor())
                                    .build();
                            cart.getItems().add(item);
                        }
                );

        Cart saved = cartRepository.save(cart);
        return mapper.toCartResponse(saved);
    }

    @Override
    public CartResponse updateItemQuantity(Long userId, Long itemId, int quantity) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item", itemId));

        if (item.getCart().getUser() == null || !item.getCart().getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Not your cart item");
        }

        if (quantity <= 0) {
            cart.getItems().remove(item);
        } else {
            if (quantity > item.getProduct().getQuantity()) {
                throw new BadRequestException("Insufficient stock. Available: " + item.getProduct().getQuantity());
            }
            item.setQuantity(quantity);
        }

        return mapper.toCartResponse(cartRepository.save(cart));
    }

    @Override
    public CartResponse removeItem(Long userId, Long itemId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().removeIf(i -> i.getId().equals(itemId));
        return mapper.toCartResponse(cartRepository.save(cart));
    }

    @Override
    public void clearCart(Long userId) {
        cartRepository.findByUserIdWithItems(userId).ifPresent(cart -> {
            cart.getItems().clear();
            cartRepository.save(cart);
        });
    }

    private Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserIdWithItems(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", userId));
            Cart newCart = Cart.builder().user(user).build();
            return cartRepository.save(newCart);
        });
    }
}
