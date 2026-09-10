package com.anvyra.service;

import com.anvyra.dto.PagedResponse;
import com.anvyra.dto.ReviewRequest;
import com.anvyra.dto.ReviewResponse;
import org.springframework.data.domain.Pageable;

public interface ReviewService {
    ReviewResponse create(Long userId, ReviewRequest request);
    ReviewResponse update(Long userId, Long reviewId, ReviewRequest request);
    void delete(Long userId, Long reviewId);
    PagedResponse<ReviewResponse> getProductReviews(Long productId, Pageable pageable);
}
