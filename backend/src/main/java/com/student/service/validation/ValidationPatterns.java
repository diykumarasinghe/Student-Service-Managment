package com.student.service.validation;

public class ValidationPatterns {
    public static final String NAME_PATTERN = "^[A-Za-z ]+$";
    public static final String NAME_MESSAGE = "Name can contain letters and spaces only.";

    public static final String PHONE_PATTERN = "^[0-9]{10}$";
    public static final String PHONE_MESSAGE = "Phone number must contain exactly 10 digits.";

    public static final String STUDENT_ID_PATTERN = "^[A-Za-z0-9-]+$";
    public static final String STUDENT_ID_MESSAGE = "Student ID can contain letters, numbers, and hyphens only.";

    public static final String SEARCH_PATTERN = "^[A-Za-z0-9 @.-]*$";
    public static final String SEARCH_MESSAGE = "Special characters are not allowed in search.";

    public static final String PASSWORD_PATTERN = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#^()_+\\-=\\[\\]{};':\"\\\\\\|,.<>\\/?]).{8,}$";
    public static final String PASSWORD_MESSAGE = "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.";
}

