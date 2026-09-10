package com.anvyra.controller;

import com.anvyra.dto.ProductResponse;
import com.anvyra.entity.User;
import com.anvyra.exception.ResourceNotFoundException;
import com.anvyra.repository.UserRepository;
import com.anvyra.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getWishlist(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(wishlistService.getWishlist(resolveUserId(userDetails)));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<List<ProductResponse>> add(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long productId) {
        return ResponseEntity.ok(wishlistService.addToWishlist(resolveUserId(userDetails), productId));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<List<ProductResponse>> remove(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long productId) {
        return ResponseEntity.ok(wishlistService.removeFromWishlist(resolveUserId(userDetails), productId));
    }

    @GetMapping("/{productId}/check")
    public ResponseEntity<Map<String, Boolean>> check(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long productId) {
        boolean inWishlist = wishlistService.isInWishlist(resolveUserId(userDetails), productId);
        return ResponseEntity.ok(Map.of("inWishlist", inWishlist));
    }

    private Long resolveUserId(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userDetails.getUsername()));
        return user.getId();
    }
}
