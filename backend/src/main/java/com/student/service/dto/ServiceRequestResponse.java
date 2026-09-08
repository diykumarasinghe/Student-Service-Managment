package com.student.service.dto;

import com.student.service.entity.RequestStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceRequestResponse {
    private Long id;
    private String requestId;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private Long categoryId;
    private String categoryName;
    private String subject;
    private String description;
    private LocalDate requestDate;
    private LocalDate requiredDate;
    private RequestStatus status;
    private String adminNote;
    private LocalDateTime createdAt;
}
