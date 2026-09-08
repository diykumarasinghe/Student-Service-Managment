package com.student.service.repository;

import com.student.service.entity.RequestStatus;
import com.student.service.entity.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {

    List<ServiceRequest> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    List<ServiceRequest> findAllByOrderByCreatedAtDesc();

    long countByStatus(RequestStatus status);
    long countByStudentId(Long studentId);
    long countByStudentIdAndStatus(Long studentId, RequestStatus status);

    @Query("SELECT r FROM ServiceRequest r WHERE " +
           "(:studentId IS NULL OR r.student.id = :studentId) AND " +
           "(LOWER(r.requestId) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.subject) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.student.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.student.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.category.name) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<ServiceRequest> searchRequests(@Param("studentId") Long studentId, @Param("query") String query);

    @Query("SELECT r FROM ServiceRequest r WHERE " +
           "(:studentId IS NULL OR r.student.id = :studentId) AND " +
           "(:categoryId IS NULL OR r.category.id = :categoryId) AND " +
           "(:status IS NULL OR r.status = :status) ORDER BY r.createdAt DESC")
    List<ServiceRequest> filterRequests(@Param("studentId") Long studentId,
                                         @Param("categoryId") Long categoryId,
                                         @Param("status") RequestStatus status);
}

