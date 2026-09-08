package com.student.service.dto;

import com.student.service.entity.StudentStatus;
import com.student.service.validation.ValidationPatterns;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentRequest {

    @NotBlank(message = "Student ID is required.")
    @Pattern(regexp = ValidationPatterns.STUDENT_ID_PATTERN, message = ValidationPatterns.STUDENT_ID_MESSAGE)
    private String studentId;

    @NotBlank(message = "First name is required.")
    @Pattern(regexp = ValidationPatterns.NAME_PATTERN, message = ValidationPatterns.NAME_MESSAGE)
    private String firstName;

    @NotBlank(message = "Last name is required.")
    @Pattern(regexp = ValidationPatterns.NAME_PATTERN, message = ValidationPatterns.NAME_MESSAGE)
    private String lastName;

    @NotBlank(message = "Please enter a valid email address.")
    @Email(message = "Please enter a valid email address.")
    private String email;

    @NotBlank(message = "Phone number is required.")
    @Pattern(regexp = ValidationPatterns.PHONE_PATTERN, message = ValidationPatterns.PHONE_MESSAGE)
    private String phoneNumber;

    @NotBlank(message = "Course is required.")
    private String course;

    @NotBlank(message = "Intake is required.")
    private String intake;

    @NotNull(message = "Registration date is required.")
    @PastOrPresent(message = "Registration date cannot be a future date.")
    private LocalDate registrationDate;

    @NotNull(message = "Status is required.")
    private StudentStatus status;
}
