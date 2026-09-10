package com.anvyra.controller;

import com.anvyra.dto.PagedResponse;
import com.anvyra.dto.ReviewRequest;
import com.anvyra.dto.ReviewResponse;
import com.anvyra.entity.User;
import com.anvyra.exception.ResourceNotFoundException;
import com.anvyra.repository.UserRepository;
import com.anvyra.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final UserRepository userRepository;

    @GetMapping("/product/{productId}")
    public ResponseEntity<PagedResponse<ReviewResponse>> getProductReviews(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(reviewService.getProductReviews(productId,
                PageRequest.of(page, size, Sort.by("createdAt").descending())));
    }

    @PostMapping
    public ResponseEntity<ReviewResponse> create(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ReviewRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reviewService.create(resolveUserId(userDetails), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReviewResponse> update(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(reviewService.update(resolveUserId(userDetails), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        reviewService.delete(resolveUserId(userDetails), id);
        return ResponseEntity.noContent().build();
    }

    private Long resolveUserId(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userDetails.getUsername()));
        return user.getId();
    }
}
