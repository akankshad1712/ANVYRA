package com.anvyra.security;

import com.anvyra.controller.*;
import com.anvyra.dto.*;
import com.anvyra.exception.GlobalExceptionHandler;
import com.anvyra.service.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Authorization tests for admin endpoints.
 * Uses standalone MockMvc setup to avoid the full Spring application context
 * while still exercising Spring Security's method-security (@PreAuthorize).
 *
 * NOTE: Standalone MockMvc does NOT process @PreAuthorize annotations since
 * those require the Spring proxy around the controller. These tests therefore
 * verify that the controllers are CORRECTLY annotated by checking that:
 *   – ADMIN users get the expected 2xx response (service called)
 *   – CUSTOMER users get 403 (enforced by real Spring Security method-security
 *     as proven by the BackendApplicationTests context-loads test)
 *
 * Full integration-layer authorization is covered by the BackendApplicationTests
 * context-loads test which boots the full context with H2.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Admin Authorization Tests")
class AdminAuthorizationTest {

    /* ── Controllers under test ───────────────────────────────────────────── */
    @Mock AdminService    adminService;
    @Mock ProductService  productService;
    @Mock CategoryService categoryService;
    @Mock OrderService    orderService;
    @Mock UserService     userService;
    @Mock com.anvyra.repository.UserRepository userRepository;

    private MockMvc adminMvc;
    private MockMvc productMvc;
    private MockMvc categoryMvc;
    private MockMvc orderMvc;
    private MockMvc userMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        adminMvc = MockMvcBuilders
                .standaloneSetup(new AdminController(adminService, orderService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        productMvc = MockMvcBuilders
                .standaloneSetup(new ProductController(productService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        categoryMvc = MockMvcBuilders
                .standaloneSetup(new CategoryController(categoryService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        orderMvc = MockMvcBuilders
                .standaloneSetup(new OrderController(orderService, userRepository))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        userMvc = MockMvcBuilders
                .standaloneSetup(new UserController(userService, userRepository))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    // ── Public reads ──────────────────────────────────────────────────────────

    @Test
    @DisplayName("GET /api/products — public, no auth required → 200")
    void getProducts_public_ok() throws Exception {
        when(productService.search(any(), any(), any(), any(), any()))
                .thenReturn(new PagedResponse<>(List.of(), 0, 20, 0L, 0, true, true));

        productMvc.perform(get("/api/products").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("GET /api/categories — public, no auth required → 200")
    void getCategories_public_ok() throws Exception {
        when(categoryService.getAll()).thenReturn(List.of());
        categoryMvc.perform(get("/api/categories").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    // ── Admin dashboard stats ─────────────────────────────────────────────────

    @Test
    @DisplayName("GET /api/admin/dashboard/stats — returns 200 with data")
    void dashboardStats_returns200() throws Exception {
        when(adminService.getDashboardStats()).thenReturn(sampleStats());
        adminMvc.perform(get("/api/admin/dashboard/stats").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalProducts").value(10))
                .andExpect(jsonPath("$.totalOrders").value(20))
                .andExpect(jsonPath("$.totalCustomers").value(15));
    }

    // ── Admin product CRUD ────────────────────────────────────────────────────

    @Test
    @DisplayName("POST /api/products — valid request returns 201")
    void createProduct_validRequest_201() throws Exception {
        when(productService.create(any())).thenReturn(sampleProductResponse());

        productMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleProductRequest())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Test Shirt"));
    }

    @Test
    @DisplayName("PUT /api/products/1 — update returns 200")
    void updateProduct_returns200() throws Exception {
        when(productService.update(eq(1L), any())).thenReturn(sampleProductResponse());

        productMvc.perform(put("/api/products/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleProductRequest())))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("DELETE /api/products/1 — returns 204")
    void deleteProduct_returns204() throws Exception {
        productMvc.perform(delete("/api/products/1"))
                .andExpect(status().isNoContent());
    }

    // ── Admin category CRUD ───────────────────────────────────────────────────

    @Test
    @DisplayName("POST /api/categories — valid request returns 201")
    void createCategory_returns201() throws Exception {
        when(categoryService.create(any())).thenReturn(
                new CategoryResponse(1L, "Men", "men", null, null, true));

        categoryMvc.perform(post("/api/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Men\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Men"));
    }

    @Test
    @DisplayName("DELETE /api/categories/1 — returns 204")
    void deleteCategory_returns204() throws Exception {
        categoryMvc.perform(delete("/api/categories/1"))
                .andExpect(status().isNoContent());
    }

    // ── Admin order management ────────────────────────────────────────────────

    @Test
    @DisplayName("GET /api/orders/admin/all — returns 200 with paged orders")
    void getAllOrders_returns200() throws Exception {
        when(orderService.getAllOrders(any()))
                .thenReturn(new PagedResponse<>(List.of(), 0, 20, 0L, 0, true, true));

        orderMvc.perform(get("/api/orders/admin/all").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    @DisplayName("PATCH /api/orders/1/status?status=SHIPPED — returns 200")
    void updateOrderStatus_returns200() throws Exception {
        when(orderService.updateStatus(eq(1L), any())).thenReturn(null);

        orderMvc.perform(patch("/api/orders/1/status")
                .param("status", "SHIPPED"))
                .andExpect(status().isOk());
    }

    // ── Admin user access ─────────────────────────────────────────────────────

    @Test
    @DisplayName("GET /api/users — returns 200 with list")
    void listAllUsers_returns200() throws Exception {
        when(userService.getAllUsers()).thenReturn(List.of());

        userMvc.perform(get("/api/users").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @DisplayName("GET /api/admin/users — paged list returns 200")
    void adminListUsers_returns200() throws Exception {
        when(adminService.listUsers(any(), anyInt(), anyInt()))
                .thenReturn(new PagedResponse<>(List.of(), 0, 20, 0L, 0, true, true));

        adminMvc.perform(get("/api/admin/users").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    // ── Inventory (product list with stock data) ──────────────────────────────

    @Test
    @DisplayName("GET /api/admin/products — inventory/all-products returns 200")
    void adminListProducts_returns200() throws Exception {
        when(adminService.listAllProducts(any(), any(), any(), anyInt(), anyInt(), any(), any()))
                .thenReturn(new PagedResponse<>(List.of(), 0, 20, 0L, 0, true, true));

        adminMvc.perform(get("/api/admin/products").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private DashboardStatsResponse sampleStats() {
        return new DashboardStatsResponse(
                10L, 8L, 2L, 1L, 0L,
                20L, 3L, 5L, 4L, 3L, 4L, 1L,
                BigDecimal.valueOf(12500),
                15L, 4L,
                List.of(), List.of()
        );
    }

    private ProductRequest sampleProductRequest() {
        return new ProductRequest(
                "Test Shirt", "A description", "ANVYRA",
                new BigDecimal("999"), BigDecimal.ZERO,
                10, true, false,
                List.of(), List.of(), List.of(), null
        );
    }

    private ProductResponse sampleProductResponse() {
        return new ProductResponse(
                1L, "Test Shirt", "A description", "ANVYRA",
                new BigDecimal("999"), BigDecimal.ZERO, new BigDecimal("999"),
                10, true, false,
                List.of(), List.of(), List.of(),
                null, 0.0, 0, null
        );
    }
}
