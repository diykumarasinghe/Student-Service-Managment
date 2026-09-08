package com.student.service.dto;

import com.student.service.validation.ValidationPatterns;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ForgotPasswordRequest {

    @NotBlank(message = "Please enter a valid email address.")
    @Email(message = "Please enter a valid email address.")
    private String email;

    @NotBlank(message = "New password is required.")
    @Pattern(regexp = ValidationPatterns.PASSWORD_PATTERN, message = ValidationPatterns.PASSWORD_MESSAGE)
    private String newPassword;

    @NotBlank(message = "Confirm password is required.")
    private String confirmPassword;
}
