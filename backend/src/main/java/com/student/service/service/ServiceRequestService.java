package com.student.service.service;

import com.student.service.dto.ServiceRequestDto;
import com.student.service.dto.ServiceRequestResponse;
import com.student.service.dto.StatusUpdateRequest;
import com.student.service.entity.*;
import com.student.service.exception.AccessDeniedException;
import com.student.service.exception.ResourceNotFoundException;
import com.student.service.repository.ServiceCategoryRepository;
import com.student.service.repository.ServiceRequestRepository;
import com.student.service.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceRequestService {

    private final ServiceRequestRepository requestRepository;
    private final StudentRepository studentRepository;
    private final ServiceCategoryRepository categoryRepository;

    @Transactional
    public ServiceRequestResponse createRequest(String studentEmail, ServiceRequestDto dto) {
        Student student = studentRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for email: " + studentEmail));

        ServiceCategory category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Service Category not found with ID: " + dto.getCategoryId()));

        if (dto.getRequestDate().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Request date cannot be a future date.");
        }
        if (dto.getRequiredDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Required date must be today or a future date.");
        }

        String requestId = "REQ-" + LocalDate.now().getYear() + "-" + String.format("%04d", (int) (Math.random() * 9000) + 1000);

        ServiceRequest request = ServiceRequest.builder()
                .requestId(requestId)
                .student(student)
                .category(category)
                .subject(dto.getSubject())
                .description(dto.getDescription())
                .requestDate(dto.getRequestDate())
                .requiredDate(dto.getRequiredDate())
                .status(RequestStatus.PENDING)
                .build();

        ServiceRequest saved = requestRepository.save(request);
        return mapToResponse(saved);
    }

    public List<ServiceRequestResponse> getAllRequests(String userEmail, Role userRole) {
        if (userRole == Role.ADMIN) {
            return requestRepository.findAllByOrderByCreatedAtDesc().stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        } else {
            Student student = getStudentByEmail(userEmail);
            return requestRepository.findByStudentIdOrderByCreatedAtDesc(student.getId()).stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        }
    }

    public ServiceRequestResponse getRequestById(Long id, String userEmail, Role userRole) {
        ServiceRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service Request not found with ID: " + id));

        if (userRole == Role.STUDENT) {
            Student student = getStudentByEmail(userEmail);
            if (!request.getStudent().getId().equals(student.getId())) {
                throw new AccessDeniedException("You are not authorized to view this request.");
            }
        }

        return mapToResponse(request);
    }

    @Transactional
    public ServiceRequestResponse updateRequest(Long id, ServiceRequestDto dto, String userEmail, Role userRole) {
        ServiceRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service Request not found with ID: " + id));

        if (userRole == Role.STUDENT) {
            Student student = getStudentByEmail(userEmail);
            if (!request.getStudent().getId().equals(student.getId())) {
                throw new AccessDeniedException("You are not authorized to edit this request.");
            }
        }

        ServiceCategory category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Service Category not found with ID: " + dto.getCategoryId()));

        request.setCategory(category);
        request.setSubject(dto.getSubject());
        request.setDescription(dto.getDescription());
        request.setRequestDate(dto.getRequestDate());
        request.setRequiredDate(dto.getRequiredDate());

        ServiceRequest updated = requestRepository.save(request);
        return mapToResponse(updated);
    }

    @Transactional
    public ServiceRequestResponse updateStatus(Long id, StatusUpdateRequest updateDto) {
        ServiceRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service Request not found with ID: " + id));

        request.setStatus(updateDto.getStatus());
        if (updateDto.getAdminNote() != null) {
            request.setAdminNote(updateDto.getAdminNote());
        }

        ServiceRequest updated = requestRepository.save(request);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteRequest(Long id, String userEmail, Role userRole) {
        ServiceRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service Request not found with ID: " + id));

        if (userRole == Role.STUDENT) {
            Student student = getStudentByEmail(userEmail);
            if (!request.getStudent().getId().equals(student.getId())) {
                throw new AccessDeniedException("You are not authorized to delete this request.");
            }
        }

        requestRepository.delete(request);
    }

    public List<ServiceRequestResponse> searchRequests(String query, String userEmail, Role userRole) {
        Long studentId = (userRole == Role.STUDENT) ? getStudentByEmail(userEmail).getId() : null;
        if (query == null || query.trim().isEmpty()) {
            return getAllRequests(userEmail, userRole);
        }
        return requestRepository.searchRequests(studentId, query.trim()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ServiceRequestResponse> filterRequests(Long categoryId, RequestStatus status, String userEmail, Role userRole) {
        Long studentId = (userRole == Role.STUDENT) ? getStudentByEmail(userEmail).getId() : null;
        return requestRepository.filterRequests(studentId, categoryId, status).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getDashboardStats(String userEmail, Role userRole) {
        Map<String, Object> stats = new HashMap<>();
        if (userRole == Role.ADMIN) {
            stats.put("totalStudents", studentRepository.count());
            stats.put("activeStudents", studentRepository.countByStatus(StudentStatus.ACTIVE));
            stats.put("totalRequests", requestRepository.count());
            stats.put("pendingRequests", requestRepository.countByStatus(RequestStatus.PENDING));
            stats.put("completedRequests", requestRepository.countByStatus(RequestStatus.COMPLETED));
        } else {
            Student student = getStudentByEmail(userEmail);
            stats.put("myTotalRequests", requestRepository.countByStudentId(student.getId()));
            stats.put("pendingRequests", requestRepository.countByStudentIdAndStatus(student.getId(), RequestStatus.PENDING));
            stats.put("completedRequests", requestRepository.countByStudentIdAndStatus(student.getId(), RequestStatus.COMPLETED));
        }
        return stats;
    }

    private Student getStudentByEmail(String email) {
        return studentRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for email: " + email));
    }

    private ServiceRequestResponse mapToResponse(ServiceRequest request) {
        return ServiceRequestResponse.builder()
                .id(request.getId())
                .requestId(request.getRequestId())
                .studentId(request.getStudent().getId())
                .studentName(request.getStudent().getFirstName() + " " + request.getStudent().getLastName())
                .studentEmail(request.getStudent().getEmail())
                .categoryId(request.getCategory().getId())
                .categoryName(request.getCategory().getName())
                .subject(request.getSubject())
                .description(request.getDescription())
                .requestDate(request.getRequestDate())
                .requiredDate(request.getRequiredDate())
                .status(request.getStatus())
                .adminNote(request.getAdminNote())
                .createdAt(request.getCreatedAt())
                .build();
    }
}
