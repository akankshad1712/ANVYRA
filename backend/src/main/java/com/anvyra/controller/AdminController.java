package com.anvyra.controller;

import com.anvyra.dto.DashboardStatsResponse;
import com.anvyra.dto.OrderResponse;
import com.anvyra.dto.PagedResponse;
import com.anvyra.dto.ProductResponse;
import com.anvyra.dto.UserResponse;
import com.anvyra.service.AdminService;
import com.anvyra.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Admin-only REST endpoints.
 * All methods are protected by @PreAuthorize("hasRole('ADMIN')") — access is
 * enforced at the Spring Security method-security layer (not just the URL
 * filter), so even if a request bypasses the URL matcher it will be rejected.
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final OrderService orderService;

    // ── Dashboard ─────────────────────────────────────────────────────────────

    /**
     * GET /api/admin/dashboard/stats
     * Returns real counts from the DB — no invented data.
     */
    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    // ── Products (admin view — includes inactive) ─────────────────────────────

    /**
     * GET /api/admin/products
     * Lists all products including inactive ones.
     * Supports: active, categoryId, search, page, size, sortBy, sortDir
     */
    @GetMapping("/products")
    public ResponseEntity<PagedResponse<ProductResponse>> listProducts(
            @RequestParam(required = false)            Boolean active,
            @RequestParam(required = false)            Long    categoryId,
            @RequestParam(required = false)            String  search,
            @RequestParam(defaultValue = "0")          int     page,
            @RequestParam(defaultValue = "20")         int     size,
            @RequestParam(defaultValue = "createdAt")  String  sortBy,
            @RequestParam(defaultValue = "desc")       String  sortDir) {

        return ResponseEntity.ok(
                adminService.listAllProducts(active, categoryId, search, page, size, sortBy, sortDir));
    }

    // ── Users ─────────────────────────────────────────────────────────────────

    /**
     * GET /api/admin/users
     * Paginates customer users with optional search by name / email.
     * Does NOT return passwords, hashes, tokens, or other credentials.
     */
    @GetMapping("/users")
    public ResponseEntity<PagedResponse<UserResponse>> listUsers(
            @RequestParam(required = false)    String search,
            @RequestParam(defaultValue = "0")  int    page,
            @RequestParam(defaultValue = "20") int    size) {

        return ResponseEntity.ok(adminService.listUsers(search, page, size));
    }

    // ── Orders (admin — no ownership check) ──────────────────────────────────

    /**
     * GET /api/admin/orders/{id}
     * Retrieves any order by ID without ownership enforcement.
     */
    @GetMapping("/orders/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderByIdAdmin(id));
    }
}
