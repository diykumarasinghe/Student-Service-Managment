package com.student.service.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceRequestDto {

    @NotNull(message = "Category is required.")
    private Long categoryId;

    @NotBlank(message = "Subject is required.")
    @Size(max = 100, message = "Subject cannot exceed 100 characters.")
    @Pattern(regexp = "^[A-Za-z0-9 ]+$", message = "Subject allows letters, numbers, and spaces only.")
    private String subject;

    @NotBlank(message = "Description is required.")
    @Size(min = 10, max = 500, message = "Description must be between 10 and 500 characters.")
    private String description;

    @NotNull(message = "Request date is required.")
    @PastOrPresent(message = "Request date cannot be a future date.")
    private LocalDate requestDate;

    @NotNull(message = "Required date is required.")
    @FutureOrPresent(message = "Required date must be today or a future date.")
    private LocalDate requiredDate;
}
