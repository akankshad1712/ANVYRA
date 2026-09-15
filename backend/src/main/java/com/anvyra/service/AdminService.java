package com.anvyra.service;

import com.anvyra.dto.DashboardStatsResponse;
import com.anvyra.dto.PagedResponse;
import com.anvyra.dto.ProductResponse;
import com.anvyra.dto.UserResponse;

import java.util.List;

public interface AdminService {

    DashboardStatsResponse getDashboardStats();

    /** Admin product listing — includes inactive products, supports all filters */
    PagedResponse<ProductResponse> listAllProducts(
            Boolean active,
            Long categoryId,
            String search,
            int page,
            int size,
            String sortBy,
            String sortDir
    );

    /** Admin user listing with optional search */
    PagedResponse<UserResponse> listUsers(String search, int page, int size);
}
