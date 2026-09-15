package com.anvyra.controller;

import com.anvyra.dto.DashboardStatsResponse;
import com.anvyra.dto.OrderResponse;
import com.anvyra.dto.PagedResponse;
import com.anvyra.exception.GlobalExceptionHandler;
import com.anvyra.service.AdminService;
import com.anvyra.service.OrderService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AdminController Unit Tests")
class AdminControllerTest {

    @Mock AdminService  adminService;
    @Mock OrderService  orderService;
    @InjectMocks AdminController adminController;

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(adminController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    private DashboardStatsResponse sampleStats() {
        return new DashboardStatsResponse(
                10L, 8L, 2L, 1L, 0L,
                20L, 3L, 5L, 4L, 3L, 4L, 1L,
                BigDecimal.valueOf(12500),
                15L, 4L,
                List.of(), List.of()
        );
    }

    @Test
    @DisplayName("GET /api/admin/dashboard/stats — 200 with stats")
    void getDashboardStats_returns200() throws Exception {
        when(adminService.getDashboardStats()).thenReturn(sampleStats());

        mockMvc.perform(get("/api/admin/dashboard/stats")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalProducts").value(10))
                .andExpect(jsonPath("$.totalOrders").value(20))
                .andExpect(jsonPath("$.totalCustomers").value(15));
    }

    @Test
    @DisplayName("GET /api/admin/products — 200 with paged response")
    void listProducts_returns200() throws Exception {
        PagedResponse<com.anvyra.dto.ProductResponse> emptyPage =
                new PagedResponse<>(List.of(), 0, 20, 0L, 0, true, true);
        when(adminService.listAllProducts(any(), any(), any(), anyInt(), anyInt(), any(), any()))
                .thenReturn(emptyPage);

        mockMvc.perform(get("/api/admin/products")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    @DisplayName("GET /api/admin/users — 200 with paged response")
    void listUsers_returns200() throws Exception {
        PagedResponse<com.anvyra.dto.UserResponse> emptyPage =
                new PagedResponse<>(List.of(), 0, 20, 0L, 0, true, true);
        when(adminService.listUsers(any(), anyInt(), anyInt()))
                .thenReturn(emptyPage);

        mockMvc.perform(get("/api/admin/users")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    @DisplayName("GET /api/admin/orders/{id} — 200 with order (no ownership check)")
    void getOrderById_admin_returns200() throws Exception {
        when(orderService.getOrderByIdAdmin(1L)).thenReturn(null);

        mockMvc.perform(get("/api/admin/orders/1")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}
