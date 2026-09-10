package com.anvyra.service.impl;

import com.anvyra.dto.PagedResponse;
import com.anvyra.dto.ReviewRequest;
import com.anvyra.dto.ReviewResponse;
import com.anvyra.entity.Product;
import com.anvyra.entity.Review;
import com.anvyra.entity.User;
import com.anvyra.exception.BadRequestException;
import com.anvyra.exception.ResourceNotFoundException;
import com.anvyra.exception.UnauthorizedException;
import com.anvyra.mapper.EntityMapper;
import com.anvyra.repository.ProductRepository;
import com.anvyra.repository.ReviewRepository;
import com.anvyra.repository.UserRepository;
import com.anvyra.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final EntityMapper mapper;

    @Override
    public ReviewResponse create(Long userId, ReviewRequest request) {
        if (reviewRepository.existsByUserIdAndProductId(userId, request.productId())) {
            throw new BadRequestException("You have already reviewed this product");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", request.productId()));

        Review review = Review.builder()
                .user(user)
                .product(product)
                .rating(request.rating())
                .title(request.title())
                .comment(request.comment())
                .verified(false)
                .build();

        Review saved = reviewRepository.save(review);
        updateProductRating(product);
        return mapper.toReviewResponse(saved);
    }

    @Override
    public ReviewResponse update(Long userId, Long reviewId, ReviewRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", reviewId));
        if (!review.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You can only edit your own reviews");
        }
        if (request.rating() != null) review.setRating(request.rating());
        if (request.title() != null) review.setTitle(request.title());
        if (request.comment() != null) review.setComment(request.comment());

        Review saved = reviewRepository.save(review);
        updateProductRating(review.getProduct());
        return mapper.toReviewResponse(saved);
    }

    @Override
    public void delete(Long userId, Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", reviewId));
        if (!review.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You can only delete your own reviews");
        }
        Product product = review.getProduct();
        reviewRepository.delete(review);
        updateProductRating(product);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ReviewResponse> getProductReviews(Long productId, Pageable pageable) {
        Page<Review> page = reviewRepository.findByProductId(productId, pageable);
        return new PagedResponse<>(
                page.getContent().stream().map(mapper::toReviewResponse).toList(),
                page.getNumber(), page.getSize(), page.getTotalElements(),
                page.getTotalPages(), page.isLast(), page.isFirst()
        );
    }

    private void updateProductRating(Product product) {
        Double avg = reviewRepository.averageRatingByProductId(product.getId());
        long count = reviewRepository.countByProductId(product.getId());
        product.setAverageRating(avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0);
        product.setTotalReviews((int) count);
        productRepository.save(product);
    }
}
