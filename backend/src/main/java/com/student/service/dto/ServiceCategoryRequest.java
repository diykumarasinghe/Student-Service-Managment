package com.student.service.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceCategoryRequest {

    @NotBlank(message = "Category name is required.")
    private String name;

    private String description;

    @Builder.Default
    private boolean active = true;
}
