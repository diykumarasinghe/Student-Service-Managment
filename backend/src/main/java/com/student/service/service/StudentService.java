package com.student.service.service;

import com.student.service.dto.StudentRequest;
import com.student.service.dto.StudentResponse;
import com.student.service.entity.Role;
import com.student.service.entity.Student;
import com.student.service.entity.StudentStatus;
import com.student.service.entity.User;
import com.student.service.exception.DuplicateEmailException;
import com.student.service.exception.ResourceNotFoundException;
import com.student.service.repository.StudentRepository;
import com.student.service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<StudentResponse> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public StudentResponse getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
        return mapToResponse(student);
    }

    @Transactional
    public StudentResponse createStudent(StudentRequest request) {
        if (studentRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("This email is already registered.");
        }
        if (studentRepository.existsByStudentId(request.getStudentId())) {
            throw new IllegalArgumentException("Student ID already exists.");
        }

        User user = null;
        if (!userRepository.existsByEmail(request.getEmail())) {
            user = User.builder()
                    .email(request.getEmail())
                    .password(passwordEncoder.encode("Student@1234"))
                    .role(Role.STUDENT)
                    .build();
            user = userRepository.save(user);
        } else {
            user = userRepository.findByEmail(request.getEmail()).orElse(null);
        }

        Student student = Student.builder()
                .studentId(request.getStudentId())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .course(request.getCourse())
                .intake(request.getIntake())
                .registrationDate(request.getRegistrationDate())
                .status(request.getStatus())
                .user(user)
                .build();

        Student saved = studentRepository.save(student);
        return mapToResponse(saved);
    }

    @Transactional
    public StudentResponse updateStudent(Long id, StudentRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));

        if (!student.getEmail().equalsIgnoreCase(request.getEmail()) && studentRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("This email is already registered.");
        }
        if (!student.getStudentId().equalsIgnoreCase(request.getStudentId()) && studentRepository.existsByStudentId(request.getStudentId())) {
            throw new IllegalArgumentException("Student ID already exists.");
        }

        student.setStudentId(request.getStudentId());
        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());
        student.setEmail(request.getEmail());
        student.setPhoneNumber(request.getPhoneNumber());
        student.setCourse(request.getCourse());
        student.setIntake(request.getIntake());
        student.setRegistrationDate(request.getRegistrationDate());
        student.setStatus(request.getStatus());

        if (student.getUser() != null) {
            student.getUser().setEmail(request.getEmail());
            userRepository.save(student.getUser());
        }

        Student updated = studentRepository.save(student);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
        
        User user = student.getUser();
        studentRepository.delete(student);
        if (user != null) {
            userRepository.delete(user);
        }
    }

    public List<StudentResponse> searchStudents(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllStudents();
        }
        return studentRepository.searchStudents(query.trim()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Map<String, Long> getStudentStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalStudents", studentRepository.count());
        stats.put("activeStudents", studentRepository.countByStatus(StudentStatus.ACTIVE));
        stats.put("inactiveStudents", studentRepository.countByStatus(StudentStatus.INACTIVE));
        return stats;
    }

    private StudentResponse mapToResponse(Student student) {
        return StudentResponse.builder()
                .id(student.getId())
                .studentId(student.getStudentId())
                .firstName(student.getFirstName())
                .lastName(student.getLastName())
                .email(student.getEmail())
                .phoneNumber(student.getPhoneNumber())
                .course(student.getCourse())
                .intake(student.getIntake())
                .registrationDate(student.getRegistrationDate())
                .status(student.getStatus())
                .build();
    }
}
