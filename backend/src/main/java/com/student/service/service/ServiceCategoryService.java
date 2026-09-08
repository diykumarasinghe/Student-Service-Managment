package com.student.service.service;

import com.student.service.dto.ServiceCategoryRequest;
import com.student.service.entity.ServiceCategory;
import com.student.service.exception.ResourceNotFoundException;
import com.student.service.repository.ServiceCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceCategoryService {

    private final ServiceCategoryRepository categoryRepository;

    public List<ServiceCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    public List<ServiceCategory> getActiveCategories() {
        return categoryRepository.findByActiveTrue();
    }

    public ServiceCategory getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service Category not found with ID: " + id));
    }

    public ServiceCategory createCategory(ServiceCategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException("Category name already exists.");
        }
        ServiceCategory category = ServiceCategory.builder()
                .name(request.getName())
                .description(request.getDescription())
                .active(request.isActive())
                .build();
        return categoryRepository.save(category);
    }

    public ServiceCategory updateCategory(Long id, ServiceCategoryRequest request) {
        ServiceCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service Category not found with ID: " + id));

        if (!category.getName().equalsIgnoreCase(request.getName()) && categoryRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException("Category name already exists.");
        }

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setActive(request.isActive());

        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        ServiceCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service Category not found with ID: " + id));
        categoryRepository.delete(category);
    }
}

