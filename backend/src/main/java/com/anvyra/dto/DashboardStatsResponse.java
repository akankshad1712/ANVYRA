package com.anvyra.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * Response DTO for admin dashboard stats.
 * All counts come from real DB queries — no invented data.
 */
public record DashboardStatsResponse(
        // Products
        long totalProducts,
        long activeProducts,
        long featuredProducts,
        long lowStockProducts,      // quantity > 0 && quantity <= lowStockThreshold
        long outOfStockProducts,    // quantity == 0

        // Orders
        long totalOrders,
        long pendingOrders,
        long confirmedOrders,
        long processingOrders,
        long shippedOrders,
        long deliveredOrders,
        long cancelledOrders,

        // Revenue (sum of totalAmount for DELIVERED + SHIPPED orders only)
        BigDecimal totalRevenue,

        // Users
        long totalCustomers,

        // Categories
        long totalCategories,

        // Recent activity
        List<OrderResponse> recentOrders,
        List<UserResponse> recentUsers
) {}
