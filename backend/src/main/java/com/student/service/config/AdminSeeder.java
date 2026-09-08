package com.student.service.config;

import com.student.service.entity.Role;
import com.student.service.entity.ServiceCategory;
import com.student.service.entity.User;
import com.student.service.repository.ServiceCategoryRepository;
import com.student.service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed default Admin User if not exists
        if (!userRepository.existsByEmail("admin@student.com")) {
            User admin = User.builder()
                    .email("admin@student.com")
                    .password(passwordEncoder.encode("Admin@1234"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
        }

        // Seed default Service Categories if empty
        if (serviceCategoryRepository.count() == 0) {
            List<String> categories = Arrays.asList(
                    "Academic Support",
                    "Course Registration",
                    "Examination",
                    "Fee Payment",
                    "Student ID Card",
                    "Certificate Request",
                    "Hostel Service",
                    "Technical Support",
                    "Other"
            );

            for (String categoryName : categories) {
                ServiceCategory category = ServiceCategory.builder()
                        .name(categoryName)
                        .description("Default category for " + categoryName)
                        .active(true)
                        .build();
                serviceCategoryRepository.save(category);
            }
        }
    }
}
