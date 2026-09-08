import React, { useState, useEffect } from 'react';
import InlineFieldError from './InlineFieldError';
import {
  validateName,
  validateEmail,
  validatePhone,
  validateStudentId,
  validateRegistrationDate,
} from '../utils/validation';
import {
  filterNameKeyDown,
  sanitizeNameInput,
  filterPhoneKeyDown,
  sanitizePhoneInput,
  filterStudentIdKeyDown,
  sanitizeStudentIdInput,
} from '../utils/inputFilters';

const StudentForm = ({ initialValues = {}, onSubmit, onCancel, isEdit = false, loading = false, serverError = '' }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    course: '',
    intake: '',
    registrationDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE',
    ...initialValues,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setFormData((prev) => ({
        ...prev,
        ...initialValues,
      }));
    }
  }, [initialValues]);

  const validateField = (name, value) => {
    let errorMsg = '';
    switch (name) {
      case 'studentId':
        errorMsg = validateStudentId(value);
        break;
      case 'firstName':
        errorMsg = validateName(value, 'First Name');
        break;
      case 'lastName':
        errorMsg = validateName(value, 'Last Name');
        break;
      case 'email':
        errorMsg = validateEmail(value);
        break;
      case 'phoneNumber':
        errorMsg = validatePhone(value);
        break;
      case 'course':
        if (!value || !value.trim()) errorMsg = 'Course is required.';
        break;
      case 'intake':
        if (!value || !value.trim()) errorMsg = 'Intake is required.';
        break;
      case 'registrationDate':
        errorMsg = validateRegistrationDate(value);
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

    const fieldErr = validateField(name, sanitizedVal);
    setErrors((prev) => ({ ...prev, [name]: fieldErr }));
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
      formData.studentId &&
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.phoneNumber &&
      formData.course &&
      formData.intake &&
      formData.registrationDate &&
      !errors.studentId &&
      !errors.firstName &&
      !errors.lastName &&
      !errors.email &&
      !errors.phoneNumber &&
      !errors.course &&
      !errors.intake &&
      !errors.registrationDate
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({
      studentId: true,
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      course: true,
      intake: true,
      registrationDate: true,
    });

    if (validateAll()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="card shadow-sm border-0 rounded-4 p-4">
      <h4 className="fw-bold mb-4 text-dark">{isEdit ? 'Edit Student Details' : 'Add New Student'}</h4>

      {serverError && (
        <div className="alert alert-danger mb-4 rounded-3 d-flex align-items-center gap-2">
          <i className="bi bi-exclamation-triangle-fill"></i>
          <span>{serverError}</span>
        </div>
      )}

      <div className="row g-3">
        {/* Student ID */}
        <div className="col-md-6">
          <label className="form-label fw-semibold">Student ID <span className="text-danger">*</span></label>
          <input
            type="text"
            name="studentId"
            className={`form-control rounded-3 ${errors.studentId && touched.studentId ? 'is-invalid' : ''}`}
            placeholder="e.g. IT2026001"
            value={formData.studentId}
            onKeyDown={filterStudentIdKeyDown}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <InlineFieldError message={errors.studentId} />
        </div>

        {/* Status */}
        <div className="col-md-6">
          <label className="form-label fw-semibold">Status <span className="text-danger">*</span></label>
          <select
            name="status"
            className="form-select rounded-3"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>

        {/* First Name */}
        <div className="col-md-6">
          <label className="form-label fw-semibold">First Name <span className="text-danger">*</span></label>
          <input
            type="text"
            name="firstName"
            className={`form-control rounded-3 ${errors.firstName && touched.firstName ? 'is-invalid' : ''}`}
            placeholder="First Name (letters only)"
            value={formData.firstName}
            onKeyDown={filterNameKeyDown}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <InlineFieldError message={errors.firstName} />
        </div>

        {/* Last Name */}
        <div className="col-md-6">
          <label className="form-label fw-semibold">Last Name <span className="text-danger">*</span></label>
          <input
            type="text"
            name="lastName"
            className={`form-control rounded-3 ${errors.lastName && touched.lastName ? 'is-invalid' : ''}`}
            placeholder="Last Name (letters only)"
            value={formData.lastName}
            onKeyDown={filterNameKeyDown}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <InlineFieldError message={errors.lastName} />
        </div>

        {/* Email */}
        <div className="col-md-6">
          <label className="form-label fw-semibold">Email Address <span className="text-danger">*</span></label>
          <input
            type="email"
            name="email"
            className={`form-control rounded-3 ${errors.email && touched.email ? 'is-invalid' : ''}`}
            placeholder="student@example.com"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <InlineFieldError message={errors.email} />
        </div>

        {/* Phone Number */}
        <div className="col-md-6">
          <label className="form-label fw-semibold">Phone Number <span className="text-danger">*</span></label>
          <input
            type="text"
            name="phoneNumber"
            className={`form-control rounded-3 ${errors.phoneNumber && touched.phoneNumber ? 'is-invalid' : ''}`}
            placeholder="10 digits (e.g. 0771234567)"
            value={formData.phoneNumber}
            onKeyDown={(e) => filterPhoneKeyDown(e, formData.phoneNumber)}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <InlineFieldError message={errors.phoneNumber} />
        </div>

        {/* Course */}
        <div className="col-md-6">
          <label className="form-label fw-semibold">Course <span className="text-danger">*</span></label>
          <input
            type="text"
            name="course"
            className={`form-control rounded-3 ${errors.course && touched.course ? 'is-invalid' : ''}`}
            placeholder="e.g. Software Engineering"
            value={formData.course}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <InlineFieldError message={errors.course} />
        </div>

        {/* Intake */}
        <div className="col-md-6">
          <label className="form-label fw-semibold">Intake <span className="text-danger">*</span></label>
          <input
            type="text"
            name="intake"
            className={`form-control rounded-3 ${errors.intake && touched.intake ? 'is-invalid' : ''}`}
            placeholder="e.g. 2026 Batch 1"
            value={formData.intake}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <InlineFieldError message={errors.intake} />
        </div>

        {/* Registration Date */}
        <div className="col-md-6">
          <label className="form-label fw-semibold">Registration Date <span className="text-danger">*</span></label>
          <input
            type="date"
            name="registrationDate"
            className={`form-control rounded-3 ${errors.registrationDate && touched.registrationDate ? 'is-invalid' : ''}`}
            value={formData.registrationDate}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <InlineFieldError message={errors.registrationDate} />
        </div>
      </div>

      <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
        {onCancel && (
          <button type="button" className="btn btn-light rounded-pill px-4" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2"
          disabled={!isFormValid() || loading}
        >
          {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
          <span>{isEdit ? 'Update Student' : 'Save Student'}</span>
        </button>
      </div>
    </form>
  );
};

export default StudentForm;

