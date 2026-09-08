package com.student.service.dto;

import com.student.service.entity.RequestStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatusUpdateRequest {

    @NotNull(message = "Status is required for ADMIN update.")
    private RequestStatus status;

    private String adminNote;
}

