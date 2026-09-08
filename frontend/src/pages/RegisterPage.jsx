import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InlineFieldError from '../components/InlineFieldError';
import {
  validateName,
  validateEmail,
  validatePhone,
  validateStudentId,
  validatePassword,
  validateConfirmPassword,
} from '../utils/validation';
import {
  filterNameKeyDown,
  sanitizeNameInput,
  filterPhoneKeyDown,
  sanitizePhoneInput,
  filterStudentIdKeyDown,
  sanitizeStudentIdInput,
} from '../utils/inputFilters';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    studentId: '',
    course: '',
    intake: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let errorMsg = '';
    switch (name) {
      case 'firstName':
        errorMsg = validateName(value, 'First Name');
        break;
      case 'lastName':
        errorMsg = validateName(value, 'Last Name');
        break;
      case 'email':
        errorMsg = validateEmail(value);
        break;
      case 'password':
        errorMsg = validatePassword(value);
        break;
      case 'confirmPassword':
        errorMsg = validateConfirmPassword(formData.password, value);
        break;
      case 'phoneNumber':
        errorMsg = validatePhone(value);
        break;
      case 'studentId':
        errorMsg = validateStudentId(value);
        break;
      case 'course':
        if (!value || !value.trim()) errorMsg = 'Course is required.';
        break;
      case 'intake':
        if (!value || !value.trim()) errorMsg = 'Intake is required.';
        break;
      default:
        break;
    }
    return errorMsg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let sanitizedVal = value;

    if (name === 'firstName' || name === 'lastName') {
      sanitizedVal = sanitizeNameInput(value);
    } else if (name === 'phoneNumber') {
      sanitizedVal = sanitizePhoneInput(value);
    } else if (name === 'studentId') {
      sanitizedVal = sanitizeStudentIdInput(value);
    }

    setFormData((prev) => ({ ...prev, [name]: sanitizedVal }));
    setServerError('');

    const fieldErr = validateField(name, sanitizedVal);
    setErrors((prev) => ({ ...prev, [name]: fieldErr }));

    if (name === 'password' && formData.confirmPassword) {
      const confirmErr = validateConfirmPassword(sanitizedVal, formData.confirmPassword);
      setErrors((prev) => ({ ...prev, confirmPassword: confirmErr }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldErr = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldErr }));
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.password &&
      formData.confirmPassword &&
      formData.phoneNumber &&
      formData.studentId &&
      formData.course &&
      formData.intake &&
      !errors.firstName &&
      !errors.lastName &&
      !errors.email &&
      !errors.password &&
      !errors.confirmPassword &&
      !errors.phoneNumber &&
      !errors.studentId &&
      !errors.course &&
      !errors.intake
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
      phoneNumber: true,
      studentId: true,
      course: true,
      intake: true,
    });

    if (!validateAll()) return;

    setLoading(true);
    setServerError('');

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.email || 'Registration failed. Please check your details.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left-panel">
        <div className="text-center mb-4">
          <h2 className="fw-bold text-dark mb-2">Create Student Account</h2>
          <p className="text-muted fs-6">Register to access student services and manage requests</p>
        </div>
        <img
          src="/student-illustration.svg"
          alt="Student Illustration"
          className="auth-illustration"
        />
      </div>

      <div className="auth-right-panel" style={{ overflowY: 'auto' }}>
        <div className="auth-card my-4" style={{ maxWidth: '520px' }}>
          <div className="text-center mb-4">
            <h3 className="auth-title">Register Account</h3>
            <p className="auth-subtitle">Enter your details to create your student account.</p>
          </div>

          {serverError && (
            <div className="alert alert-danger rounded-3 small py-2 px-3 mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-2">
              {/* Student ID */}
              <div className="col-md-6 mb-2">
                <label className="form-label fw-semibold small text-secondary">Student ID *</label>
                <input
                  type="text"
                  name="studentId"
                  className={`form-control auth-input ${errors.studentId && touched.studentId ? 'is-invalid' : ''}`}
                  style={{ paddingLeft: '1rem' }}
                  placeholder="IT2026001"
                  value={formData.studentId}
                  onKeyDown={filterStudentIdKeyDown}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <InlineFieldError message={errors.studentId} />
              </div>

              {/* Phone Number */}
              <div className="col-md-6 mb-2">
                <label className="form-label fw-semibold small text-secondary">Phone Number *</label>
                <input
                  type="text"
                  name="phoneNumber"
                  className={`form-control auth-input ${errors.phoneNumber && touched.phoneNumber ? 'is-invalid' : ''}`}
                  style={{ paddingLeft: '1rem' }}
                  placeholder="0771234567"
                  value={formData.phoneNumber}
                  onKeyDown={(e) => filterPhoneKeyDown(e, formData.phoneNumber)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <InlineFieldError message={errors.phoneNumber} />
              </div>

              {/* First Name */}
              <div className="col-md-6 mb-2">
                <label className="form-label fw-semibold small text-secondary">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  className={`form-control auth-input ${errors.firstName && touched.firstName ? 'is-invalid' : ''}`}
                  style={{ paddingLeft: '1rem' }}
                  placeholder="Letters only"
                  value={formData.firstName}
                  onKeyDown={filterNameKeyDown}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <InlineFieldError message={errors.firstName} />
              </div>

              {/* Last Name */}
              <div className="col-md-6 mb-2">
                <label className="form-label fw-semibold small text-secondary">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  className={`form-control auth-input ${errors.lastName && touched.lastName ? 'is-invalid' : ''}`}
                  style={{ paddingLeft: '1rem' }}
                  placeholder="Letters only"
                  value={formData.lastName}
                  onKeyDown={filterNameKeyDown}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <InlineFieldError message={errors.lastName} />
              </div>

              {/* Email */}
              <div className="col-12 mb-2">
                <label className="form-label fw-semibold small text-secondary">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  className={`form-control auth-input ${errors.email && touched.email ? 'is-invalid' : ''}`}
                  style={{ paddingLeft: '1rem' }}
                  placeholder="student@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <InlineFieldError message={errors.email} />
              </div>

              {/* Course */}
              <div className="col-md-6 mb-2">
                <label className="form-label fw-semibold small text-secondary">Course *</label>
                <input
                  type="text"
                  name="course"
                  className={`form-control auth-input ${errors.course && touched.course ? 'is-invalid' : ''}`}
                  style={{ paddingLeft: '1rem' }}
                  placeholder="Software Engineering"
                  value={formData.course}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <InlineFieldError message={errors.course} />
              </div>

              {/* Intake */}
              <div className="col-md-6 mb-2">
                <label className="form-label fw-semibold small text-secondary">Intake *</label>
                <input
                  type="text"
                  name="intake"
                  className={`form-control auth-input ${errors.intake && touched.intake ? 'is-invalid' : ''}`}
                  style={{ paddingLeft: '1rem' }}
                  placeholder="2026 Batch 1"
                  value={formData.intake}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <InlineFieldError message={errors.intake} />
              </div>

              {/* Password */}
              <div className="col-md-6 mb-2">
                <label className="form-label fw-semibold small text-secondary">Password *</label>
                <input
                  type="password"
                  name="password"
                  className={`form-control auth-input ${errors.password && touched.password ? 'is-invalid' : ''}`}
                  style={{ paddingLeft: '1rem' }}
                  placeholder="Min 8, A-z, 0-9, symbol"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <InlineFieldError message={errors.password} />
              </div>

              {/* Confirm Password */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold small text-secondary">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className={`form-control auth-input ${errors.confirmPassword && touched.confirmPassword ? 'is-invalid' : ''}`}
                  style={{ paddingLeft: '1rem' }}
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <InlineFieldError message={errors.confirmPassword} />
              </div>
            </div>

            <button
              type="submit"
              className="btn auth-button w-100 d-flex align-items-center justify-content-center gap-2 mb-3 mt-2"
              disabled={!isFormValid() || loading}
            >
              {loading && <span className="spinner-border spinner-border-sm" role="status"></span>}
              <span>Create Account</span>
            </button>
          </form>

          <div className="text-center mt-3 pt-3 border-top">
            <span className="text-muted small">Already have an account? </span>
            <Link to="/login" className="auth-link small">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

