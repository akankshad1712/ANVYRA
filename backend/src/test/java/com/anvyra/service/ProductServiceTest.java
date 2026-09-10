package com.anvyra.service;

import com.anvyra.dto.PagedResponse;
import com.anvyra.dto.ProductRequest;
import com.anvyra.dto.ProductResponse;
import com.anvyra.entity.Category;
import com.anvyra.entity.Product;
import com.anvyra.exception.ResourceNotFoundException;
import com.anvyra.mapper.EntityMapper;
import com.anvyra.repository.CategoryRepository;
import com.anvyra.repository.ProductRepository;
import com.anvyra.service.impl.ProductServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ProductService Unit Tests")
class ProductServiceTest {

    @Mock ProductRepository productRepository;
    @Mock CategoryRepository categoryRepository;
    @Mock EntityMapper mapper;

    @InjectMocks
    ProductServiceImpl productService;

    private Product product;
    private ProductResponse productResponse;
    private Category category;

    @BeforeEach
    void setUp() {
        category = Category.builder().id(1L).name("Men").slug("men").active(true).build();
        product = Product.builder()
                .id(1L)
                .name("Test Shirt")
                .brand("ANVYRA")
                .price(new BigDecimal("999"))
                .discountPrice(BigDecimal.ZERO)
                .quantity(10)
                .active(true)
                .featured(false)
                .averageRating(0.0)
                .totalReviews(0)
                .category(category)
                .build();
        productResponse = new ProductResponse(
                1L, "Test Shirt", null, "ANVYRA",
                new BigDecimal("999"), BigDecimal.ZERO, new BigDecimal("999"),
                10, true, false, List.of(), List.of(), List.of(),
                null, 0.0, 0, null
        );
    }

    @Test
    @DisplayName("getById: returns product when found")
    void getById_found() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(mapper.toProductResponse(product)).thenReturn(productResponse);

        ProductResponse result = productService.getById(1L);

        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(1L);
        assertThat(result.name()).isEqualTo("Test Shirt");
    }

    @Test
    @DisplayName("getById: throws ResourceNotFoundException when not found")
    void getById_notFound() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.getById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    @DisplayName("create: saves and returns product")
    void create_success() {
        ProductRequest request = new ProductRequest(
                "Test Shirt", null, "ANVYRA", new BigDecimal("999"),
                null, 10, true, false, List.of(), List.of(), List.of(), 1L
        );
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(mapper.toProduct(request, category)).thenReturn(product);
        when(productRepository.save(product)).thenReturn(product);
        when(mapper.toProductResponse(product)).thenReturn(productResponse);

        ProductResponse result = productService.create(request);

        assertThat(result).isNotNull();
        verify(productRepository).save(product);
    }

    @Test
    @DisplayName("delete: throws when product doesn't exist")
    void delete_notFound() {
        when(productRepository.existsById(999L)).thenReturn(false);

        assertThatThrownBy(() -> productService.delete(999L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("getAll: returns paged response")
    void getAll_paged() {
        Page<Product> page = new PageImpl<>(List.of(product), PageRequest.of(0, 20), 1);
        when(productRepository.findByActiveTrue(any())).thenReturn(page);
        when(mapper.toProductResponse(product)).thenReturn(productResponse);

        PagedResponse<ProductResponse> result = productService.getAll(PageRequest.of(0, 20));

        assertThat(result).isNotNull();
        assertThat(result.content()).hasSize(1);
        assertThat(result.totalElements()).isEqualTo(1);
    }
}
