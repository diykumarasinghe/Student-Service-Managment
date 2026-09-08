package com.student.service.controller;

import com.student.service.dto.ServiceRequestDto;
import com.student.service.dto.ServiceRequestResponse;
import com.student.service.dto.StatusUpdateRequest;
import com.student.service.entity.RequestStatus;
import com.student.service.entity.Role;
import com.student.service.service.ServiceRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class ServiceRequestController {

    private final ServiceRequestService requestService;

    private Role getUserRole(Authentication authentication) {
        if (authentication == null) return Role.STUDENT;
        boolean isAdmin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(auth -> auth.equals("ROLE_ADMIN"));
        return isAdmin ? Role.ADMIN : Role.STUDENT;
    }

    @GetMapping
    public ResponseEntity<List<ServiceRequestResponse>> getAllRequests(Authentication authentication) {
        Role role = getUserRole(authentication);
        return ResponseEntity.ok(requestService.getAllRequests(authentication.getName(), role));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceRequestResponse> getRequestById(@PathVariable Long id, Authentication authentication) {
        Role role = getUserRole(authentication);
        return ResponseEntity.ok(requestService.getRequestById(id, authentication.getName(), role));
    }

    @PostMapping
    public ResponseEntity<ServiceRequestResponse> createRequest(@Valid @RequestBody ServiceRequestDto dto, Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED).body(requestService.createRequest(authentication.getName(), dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceRequestResponse> updateRequest(@PathVariable Long id, @Valid @RequestBody ServiceRequestDto dto, Authentication authentication) {
        Role role = getUserRole(authentication);
        return ResponseEntity.ok(requestService.updateRequest(id, dto, authentication.getName(), role));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ServiceRequestResponse> updateStatus(@PathVariable Long id, @Valid @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(requestService.updateStatus(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteRequest(@PathVariable Long id, Authentication authentication) {
        Role role = getUserRole(authentication);
        requestService.deleteRequest(id, authentication.getName(), role);
        return ResponseEntity.ok(Map.of("message", "Service request deleted successfully."));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ServiceRequestResponse>> searchRequests(
            @RequestParam(value = "query", required = false, defaultValue = "") String query,
            Authentication authentication) {
        Role role = getUserRole(authentication);
        return ResponseEntity.ok(requestService.searchRequests(query, authentication.getName(), role));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<ServiceRequestResponse>> filterRequests(
            @RequestParam(value = "category", required = false) Long categoryId,
            @RequestParam(value = "status", required = false) RequestStatus status,
            Authentication authentication) {
        Role role = getUserRole(authentication);
        return ResponseEntity.ok(requestService.filterRequests(categoryId, status, authentication.getName(), role));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats(Authentication authentication) {
        Role role = getUserRole(authentication);
        return ResponseEntity.ok(requestService.getDashboardStats(authentication.getName(), role));
    }
}
