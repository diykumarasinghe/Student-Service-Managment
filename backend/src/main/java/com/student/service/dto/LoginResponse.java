package com.student.service.dto;

import com.student.service.entity.Role;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private String token;
    private String email;
    private Role role;
    private String firstName;
    private String lastName;
    private Long studentId;
}

