package com.student.service.service;

import com.student.service.dto.*;
import com.student.service.entity.*;
import com.student.service.exception.DuplicateEmailException;
import com.student.service.exception.ResourceNotFoundException;
import com.student.service.repository.StudentRepository;
import com.student.service.repository.UserRepository;
import com.student.service.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        Optional<Student> studentOpt = studentRepository.findByEmail(user.getEmail());

        Long studentId = studentOpt.map(Student::getId).orElse(null);
        String firstName = studentOpt.map(Student::getFirstName).orElse(user.getRole() == Role.ADMIN ? "Admin" : "User");
        String lastName = studentOpt.map(Student::getLastName).orElse("System");

        String token = jwtService.generateToken(user.getEmail(), user.getRole().name(), studentId);

        return LoginResponse.builder()
                .token(token)
                .email(user.getEmail())
                .role(user.getRole())
                .firstName(firstName)
                .lastName(lastName)
                .studentId(studentId)
                .build();
    }

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Confirm password must match password.");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("This email is already registered.");
        }

        if (studentRepository.existsByStudentId(request.getStudentId())) {
            throw new IllegalArgumentException("Student ID already exists in the system.");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.STUDENT)
                .build();
        User savedUser = userRepository.save(user);

        Student student = Student.builder()
                .studentId(request.getStudentId())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .course(request.getCourse())
                .intake(request.getIntake())
                .registrationDate(LocalDate.now())
                .status(StudentStatus.ACTIVE)
                .user(savedUser)
                .build();
        Student savedStudent = studentRepository.save(student);

        String token = jwtService.generateToken(savedUser.getEmail(), savedUser.getRole().name(), savedStudent.getId());

        return LoginResponse.builder()
                .token(token)
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .firstName(savedStudent.getFirstName())
                .lastName(savedStudent.getLastName())
                .studentId(savedStudent.getId())
                .build();
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Confirm password must match new password.");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("No account registered with this email."));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public LoginResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        Optional<Student> studentOpt = studentRepository.findByEmail(user.getEmail());

        Long studentId = studentOpt.map(Student::getId).orElse(null);
        String firstName = studentOpt.map(Student::getFirstName).orElse(user.getRole() == Role.ADMIN ? "Admin" : "User");
        String lastName = studentOpt.map(Student::getLastName).orElse("System");

        return LoginResponse.builder()
                .token(null) // Not sending new token for me endpoint
                .email(user.getEmail())
                .role(user.getRole())
                .firstName(firstName)
                .lastName(lastName)
                .studentId(studentId)
                .build();
    }
}
