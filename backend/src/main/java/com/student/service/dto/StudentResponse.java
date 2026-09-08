package com.student.service.dto;

import com.student.service.entity.StudentStatus;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentResponse {
    private Long id;
    private String studentId;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String course;
    private String intake;
    private LocalDate registrationDate;
    private StudentStatus status;
}

