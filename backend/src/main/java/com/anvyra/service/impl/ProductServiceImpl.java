package com.anvyra.service.impl;

import com.anvyra.dto.PagedResponse;
import com.anvyra.dto.ProductRequest;
import com.anvyra.dto.ProductResponse;
import com.anvyra.entity.Category;
import com.anvyra.entity.Product;
import com.anvyra.exception.ResourceNotFoundException;
import com.anvyra.mapper.EntityMapper;
import com.anvyra.repository.CategoryRepository;
import com.anvyra.repository.ProductRepository;
import com.anvyra.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final EntityMapper mapper;

    @Override
    @CacheEvict(value = "products", allEntries = true)
    public ProductResponse create(ProductRequest request) {
        Category category = resolveCategory(request.categoryId());
        Product product = mapper.toProduct(request, category);
        return mapper.toProductResponse(productRepository.save(product));
    }

    @Override
    @CacheEvict(value = "products", allEntries = true)
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = findOrThrow(id);
        if (request.name() != null) product.setName(request.name());
        if (request.description() != null) product.setDescription(request.description());
        if (request.brand() != null) product.setBrand(request.brand());
        if (request.price() != null) product.setPrice(request.price());
        if (request.discountPrice() != null) product.setDiscountPrice(request.discountPrice());
        if (request.quantity() != null) product.setQuantity(request.quantity());
        if (request.active() != null) product.setActive(request.active());
        if (request.featured() != null) product.setFeatured(request.featured());
        if (request.images() != null) product.setImages(request.images());
        if (request.sizes() != null) product.setSizes(request.sizes());
        if (request.colors() != null) product.setColors(request.colors());
        if (request.categoryId() != null) product.setCategory(resolveCategory(request.categoryId()));
        return mapper.toProductResponse(productRepository.save(product));
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "products", key = "#id")
    public ProductResponse getById(Long id) {
        return mapper.toProductResponse(findOrThrow(id));
    }

    @Override
    @CacheEvict(value = "products", allEntries = true)
    public void delete(Long id) {
        if (!productRepository.existsById(id)) throw new ResourceNotFoundException("Product", id);
        productRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "products", key = "'all-' + #pageable.pageNumber + '-' + #pageable.pageSize")
    public PagedResponse<ProductResponse> getAll(Pageable pageable) {
        return toPagedResponse(productRepository.findByActiveTrue(pageable));
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ProductResponse> search(Long categoryId, BigDecimal minPrice, BigDecimal maxPrice, String q, Pageable pageable) {
        return toPagedResponse(productRepository.searchProducts(categoryId, minPrice, maxPrice, q, pageable));
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "products", key = "'featured-' + #pageable.pageNumber")
    public PagedResponse<ProductResponse> getFeatured(Pageable pageable) {
        return toPagedResponse(productRepository.findByFeaturedTrueAndActiveTrue(pageable));
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "products", key = "'new-arrivals-' + #pageable.pageNumber")
    public PagedResponse<ProductResponse> getNewArrivals(Pageable pageable) {
        return toPagedResponse(productRepository.findNewArrivals(pageable));
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "products", key = "'best-sellers-' + #pageable.pageNumber")
    public PagedResponse<ProductResponse> getBestSellers(Pageable pageable) {
        return toPagedResponse(productRepository.findBestSellers(pageable));
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ProductResponse> getByCategory(Long categoryId, Pageable pageable) {
        return toPagedResponse(productRepository.findByCategoryIdAndActiveTrue(categoryId, pageable));
    }

    private Product findOrThrow(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
    }

    private Category resolveCategory(Long categoryId) {
        if (categoryId == null) return null;
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", categoryId));
    }

    private PagedResponse<ProductResponse> toPagedResponse(Page<Product> page) {
        return new PagedResponse<>(
                page.getContent().stream().map(mapper::toProductResponse).toList(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast(),
                page.isFirst()
        );
    }
}
