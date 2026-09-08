package com.student.service.repository;

import com.student.service.entity.Student;
import com.student.service.entity.StudentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByEmail(String email);
    Optional<Student> findByStudentId(String studentId);
    boolean existsByEmail(String email);
    boolean existsByStudentId(String studentId);
    long countByStatus(StudentStatus status);

    @Query("SELECT s FROM Student s WHERE " +
           "LOWER(s.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.studentId) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.course) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.phoneNumber) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Student> searchStudents(@Param("query") String query);
}
