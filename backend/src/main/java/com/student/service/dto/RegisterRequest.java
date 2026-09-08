package com.student.service.dto;

import com.student.service.validation.ValidationPatterns;
import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "First name is required.")
    @Pattern(regexp = ValidationPatterns.NAME_PATTERN, message = ValidationPatterns.NAME_MESSAGE)
    private String firstName;

    @NotBlank(message = "Last name is required.")
    @Pattern(regexp = ValidationPatterns.NAME_PATTERN, message = ValidationPatterns.NAME_MESSAGE)
    private String lastName;

    @NotBlank(message = "Please enter a valid email address.")
    @Email(message = "Please enter a valid email address.")
    private String email;

    @NotBlank(message = "Password is required.")
    @Pattern(regexp = ValidationPatterns.PASSWORD_PATTERN, message = ValidationPatterns.PASSWORD_MESSAGE)
    private String password;

    @NotBlank(message = "Confirm password is required.")
    private String confirmPassword;

    @NotBlank(message = "Phone number is required.")
    @Pattern(regexp = ValidationPatterns.PHONE_PATTERN, message = ValidationPatterns.PHONE_MESSAGE)
    private String phoneNumber;

    @NotBlank(message = "Student ID is required.")
    @Pattern(regexp = ValidationPatterns.STUDENT_ID_PATTERN, message = ValidationPatterns.STUDENT_ID_MESSAGE)
    private String studentId;

    @NotBlank(message = "Course is required.")
    private String course;

    @NotBlank(message = "Intake is required.")
    private String intake;
}
