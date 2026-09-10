package com.anvyra.service.impl;

import com.anvyra.dto.CategoryRequest;
import com.anvyra.dto.CategoryResponse;
import com.anvyra.entity.Category;
import com.anvyra.exception.DuplicateResourceException;
import com.anvyra.exception.ResourceNotFoundException;
import com.anvyra.mapper.EntityMapper;
import com.anvyra.repository.CategoryRepository;
import com.anvyra.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final EntityMapper mapper;

    @Override
    @CacheEvict(value = "categories", allEntries = true)
    public CategoryResponse create(CategoryRequest request) {
        if (categoryRepository.existsByName(request.name())) {
            throw new DuplicateResourceException("Category", "name", request.name());
        }
        Category category = Category.builder()
                .name(request.name())
                .description(request.description())
                .imageUrl(request.imageUrl())
                .slug(request.slug())
                .active(true)
                .build();
        return mapper.toCategoryResponse(categoryRepository.save(category));
    }

    @Override
    @CacheEvict(value = "categories", allEntries = true)
    public CategoryResponse update(Long id, CategoryRequest request) {
        Category category = findOrThrow(id);
        if (request.name() != null) category.setName(request.name());
        if (request.description() != null) category.setDescription(request.description());
        if (request.imageUrl() != null) category.setImageUrl(request.imageUrl());
        if (request.slug() != null) category.setSlug(request.slug());
        return mapper.toCategoryResponse(categoryRepository.save(category));
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getById(Long id) {
        return mapper.toCategoryResponse(findOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "categories", key = "'all'")
    public List<CategoryResponse> getAll() {
        return categoryRepository.findAll().stream()
                .map(mapper::toCategoryResponse)
                .toList();
    }

    @Override
    @CacheEvict(value = "categories", allEntries = true)
    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) throw new ResourceNotFoundException("Category", id);
        categoryRepository.deleteById(id);
    }

    private Category findOrThrow(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", id));
    }
}
