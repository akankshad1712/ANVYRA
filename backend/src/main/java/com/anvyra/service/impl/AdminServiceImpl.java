package com.anvyra.service.impl;

import com.anvyra.dto.DashboardStatsResponse;
import com.anvyra.dto.OrderResponse;
import com.anvyra.dto.PagedResponse;
import com.anvyra.dto.ProductResponse;
import com.anvyra.dto.UserResponse;
import com.anvyra.entity.Order.OrderStatus;
import com.anvyra.entity.UserRole;
import com.anvyra.mapper.EntityMapper;
import com.anvyra.repository.CategoryRepository;
import com.anvyra.repository.OrderRepository;
import com.anvyra.repository.ProductRepository;
import com.anvyra.repository.UserRepository;
import com.anvyra.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminServiceImpl implements AdminService {

    private static final int LOW_STOCK_THRESHOLD = 5;

    private final ProductRepository  productRepository;
    private final OrderRepository    orderRepository;
    private final UserRepository     userRepository;
    private final CategoryRepository categoryRepository;
    private final EntityMapper       mapper;

    @Override
    public DashboardStatsResponse getDashboardStats() {
        // ── Products ──────────────────────────────────────────────────────────
        long totalProducts    = productRepository.count();
        long activeProducts   = productRepository.countByActiveTrue();
        long featuredProducts = productRepository.countByFeaturedTrueAndActiveTrue();
        long lowStock         = productRepository.countLowStock(LOW_STOCK_THRESHOLD);
        long outOfStock       = productRepository.countOutOfStock();

        // ── Orders ────────────────────────────────────────────────────────────
        long totalOrders      = orderRepository.count();
        long pendingOrders    = orderRepository.countByStatus(OrderStatus.PENDING);
        long confirmedOrders  = orderRepository.countByStatus(OrderStatus.CONFIRMED);
        long processingOrders = orderRepository.countByStatus(OrderStatus.PROCESSING);
        long shippedOrders    = orderRepository.countByStatus(OrderStatus.SHIPPED);
        long deliveredOrders  = orderRepository.countByStatus(OrderStatus.DELIVERED);
        long cancelledOrders  = orderRepository.countByStatus(OrderStatus.CANCELLED);
        java.math.BigDecimal totalRevenue = orderRepository.sumRevenueDelivered();

        // ── Users ─────────────────────────────────────────────────────────────
        long totalCustomers = userRepository.countByRole(UserRole.CUSTOMER);

        // ── Categories ────────────────────────────────────────────────────────
        long totalCategories = categoryRepository.count();

        // ── Recent activity ───────────────────────────────────────────────────
        List<OrderResponse> recentOrders = orderRepository
                .findRecentOrders(PageRequest.of(0, 10))
                .stream()
                .map(mapper::toOrderResponse)
                .toList();

        List<UserResponse> recentUsers = userRepository
                .findRecentUsers(PageRequest.of(0, 10))
                .stream()
                .map(mapper::toUserResponse)
                .toList();

        return new DashboardStatsResponse(
                totalProducts, activeProducts, featuredProducts, lowStock, outOfStock,
                totalOrders, pendingOrders, confirmedOrders, processingOrders,
                shippedOrders, deliveredOrders, cancelledOrders, totalRevenue,
                totalCustomers, totalCategories,
                recentOrders, recentUsers
        );
    }

    @Override
    public PagedResponse<ProductResponse> listAllProducts(
            Boolean active, Long categoryId, String search,
            int page, int size, String sortBy, String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, Math.min(size, 100), sort);

        Page<com.anvyra.entity.Product> result = productRepository.findAllAdmin(
                active,
                categoryId,
                (search != null && search.isBlank()) ? null : search,
                pageable
        );

        return new PagedResponse<>(
                result.getContent().stream().map(mapper::toProductResponse).toList(),
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages(),
                result.isLast(),
                result.isFirst()
        );
    }

    @Override
    public PagedResponse<UserResponse> listUsers(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, Math.min(size, 100),
                Sort.by("createdAt").descending());

        String searchParam = (search != null && search.isBlank()) ? null : search;
        Page<com.anvyra.entity.User> result = userRepository.findCustomers(searchParam, pageable);

        return new PagedResponse<>(
                result.getContent().stream().map(mapper::toUserResponse).toList(),
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages(),
                result.isLast(),
                result.isFirst()
        );
    }
}
