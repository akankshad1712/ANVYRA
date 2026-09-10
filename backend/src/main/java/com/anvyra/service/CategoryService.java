package com.anvyra.service;

import com.anvyra.dto.CategoryRequest;
import com.anvyra.dto.CategoryResponse;

import java.util.List;

public interface CategoryService {
    CategoryResponse create(CategoryRequest request);
    CategoryResponse update(Long id, CategoryRequest request);
    CategoryResponse getById(Long id);
    List<CategoryResponse> getAll();
    void delete(Long id);
}
