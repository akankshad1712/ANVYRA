package com.anvyra.service;

import com.anvyra.dto.PagedResponse;
import com.anvyra.dto.ProductRequest;
import com.anvyra.dto.ProductResponse;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;

public interface ProductService {
    ProductResponse create(ProductRequest request);
    ProductResponse update(Long id, ProductRequest request);
    ProductResponse getById(Long id);
    void delete(Long id);
    PagedResponse<ProductResponse> getAll(Pageable pageable);
    PagedResponse<ProductResponse> search(Long categoryId, BigDecimal minPrice, BigDecimal maxPrice, String q, Pageable pageable);
    PagedResponse<ProductResponse> getFeatured(Pageable pageable);
    PagedResponse<ProductResponse> getNewArrivals(Pageable pageable);
    PagedResponse<ProductResponse> getBestSellers(Pageable pageable);
    PagedResponse<ProductResponse> getByCategory(Long categoryId, Pageable pageable);
}
