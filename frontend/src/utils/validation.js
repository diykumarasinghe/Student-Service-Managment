export const validateName = (val, fieldName = 'Name') => {
  if (!val || !val.trim()) return `${fieldName} is required.`;
  const pattern = /^[A-Za-z ]+$/;
  if (!pattern.test(val)) return 'Name can contain letters and spaces only.';
  return '';
};

export const validateEmail = (val) => {
  if (!val || !val.trim()) return 'Please enter a valid email address.';
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(val)) return 'Please enter a valid email address.';
  return '';
};

export const validatePhone = (val) => {
  if (!val || !val.trim()) return 'Phone number is required.';
  const pattern = /^[0-9]{10}$/;
  if (!pattern.test(val)) return 'Phone number must contain exactly 10 digits.';
  return '';
};

export const validateStudentId = (val) => {
  if (!val || !val.trim()) return 'Student ID is required.';
  const pattern = /^[A-Za-z0-9-]+$/;
  if (!pattern.test(val)) return 'Student ID can contain letters, numbers, and hyphens only.';
  return '';
};

export const validateSearch = (val) => {
  if (!val) return '';
  const pattern = /^[A-Za-z0-9 @.-]*$/;
  if (!pattern.test(val)) return 'Special characters are not allowed in search.';
  return '';
};

export const validateMoney = (val) => {
  if (!val) return '';
  const pattern = /^\d+(\.\d{1,2})?$/;
  if (!pattern.test(val) || parseFloat(val) <= 0) {
    return 'Please enter a valid positive amount with up to 2 decimal places.';
  }
  return '';
};

export const validateRegistrationDate = (val) => {
  if (!val) return 'Registration date is required.';
  const selectedDate = new Date(val);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  if (selectedDate > today) return 'Registration date cannot be a future date.';
  return '';
};

export const validateRequestDate = (val) => {
  if (!val) return 'Request date is required.';
  const selectedDate = new Date(val);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  if (selectedDate > today) return 'Request date cannot be a future date.';
  return '';
};

export const validateRequiredDate = (val) => {
  if (!val) return 'Required date is required.';
  const selectedDate = new Date(val);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate < today) return 'Required date must be today or a future date.';
  return '';
};

export const validateSubject = (val) => {
  if (!val || !val.trim()) return 'Subject is required.';
  if (val.length > 100) return 'Subject cannot exceed 100 characters.';
  const pattern = /^[A-Za-z0-9 ]+$/;
  if (!pattern.test(val)) return 'Subject allows letters, numbers, and spaces only.';
  return '';
};

export const validateDescription = (val) => {
  if (!val || !val.trim()) return 'Description is required.';
  if (val.trim().length < 10 || val.trim().length > 500) {
    return 'Description must be between 10 and 500 characters.';
  }
  return '';
};

export const validatePassword = (val) => {
  if (!val) return 'Password is required.';
  if (val.length < 8) return 'Password must be at least 8 characters long.';
  if (!/[A-Z]/.test(val)) return 'Password must contain at least one uppercase letter.';
  if (!/[a-z]/.test(val)) return 'Password must contain at least one lowercase letter.';
  if (!/[0-9]/.test(val)) return 'Password must contain at least one number.';
  if (!/[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val)) {
    return 'Password must contain at least one special character.';
  }
  return '';
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Confirm password is required.';
  if (password !== confirmPassword) return 'Passwords do not match.';
  return '';
};
