import React, { useState, useEffect } from 'react';
import InlineFieldError from './InlineFieldError';
import {
  validateSubject,
  validateDescription,
  validateRequestDate,
  validateRequiredDate,
} from '../utils/validation';
import { filterSubjectKeyDown, sanitizeSubjectInput } from '../utils/inputFilters';

const ServiceRequestForm = ({
  initialValues = {},
  categories = [],
  onSubmit,
  onCancel,
  isEdit = false,
  loading = false,
  serverError = '',
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    categoryId: '',
    subject: '',
    description: '',
    requestDate: todayStr,
    requiredDate: todayStr,
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
      case 'categoryId':
        if (!value) errorMsg = 'Category is required.';
        break;
      case 'subject':
        errorMsg = validateSubject(value);
        break;
      case 'description':
        errorMsg = validateDescription(value);
        break;
      case 'requestDate':
        errorMsg = validateRequestDate(value);
        break;
      case 'requiredDate':
        errorMsg = validateRequiredDate(value);
        break;
      default:
        break;
    }
    return errorMsg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let sanitizedVal = value;

    if (name === 'subject') {
      sanitizedVal = sanitizeSubjectInput(value);
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
      formData.categoryId &&
      formData.subject &&
      formData.description &&
      formData.requestDate &&
      formData.requiredDate &&
      !errors.categoryId &&
      !errors.subject &&
      !errors.description &&
      !errors.requestDate &&
      !errors.requiredDate
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({
      categoryId: true,
      subject: true,
      description: true,
      requestDate: true,
      requiredDate: true,
    });

    if (validateAll()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="card shadow-sm border-0 rounded-4 p-4">
      <h4 className="fw-bold mb-4 text-dark">{isEdit ? 'Edit Service Request' : 'Create New Service Request'}</h4>

      {serverError && (
        <div className="alert alert-danger mb-4 rounded-3 d-flex align-items-center gap-2">
          <i className="bi bi-exclamation-triangle-fill"></i>
          <span>{serverError}</span>
        </div>
      )}

      <div className="row g-3">
        {/* Service Category */}
        <div className="col-12">
          <label className="form-label fw-semibold">Service Category <span className="text-danger">*</span></label>
          <select
            name="categoryId"
            className={`form-select rounded-3 ${errors.categoryId && touched.categoryId ? 'is-invalid' : ''}`}
            value={formData.categoryId}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <InlineFieldError message={errors.categoryId} />
        </div>

        {/* Subject */}
        <div className="col-12">
          <label className="form-label fw-semibold">Subject <span className="text-danger">*</span></label>
          <input
            type="text"
            name="subject"
            className={`form-control rounded-3 ${errors.subject && touched.subject ? 'is-invalid' : ''}`}
            placeholder="Letters, numbers and spaces only (max 100 chars)"
            value={formData.subject}
            onKeyDown={filterSubjectKeyDown}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <InlineFieldError message={errors.subject} />
        </div>

        {/* Description */}
        <div className="col-12">
          <label className="form-label fw-semibold">Description <span className="text-danger">*</span></label>
          <textarea
            name="description"
            rows="4"
            className={`form-control rounded-3 ${errors.description && touched.description ? 'is-invalid' : ''}`}
            placeholder="Detailed request description (10 - 500 characters)"
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
          ></textarea>
          <div className="d-flex justify-content-between align-items-center mt-1">
            <InlineFieldError message={errors.description} />
            <small className="text-muted ms-auto">
              {formData.description ? formData.description.trim().length : 0} / 500
            </small>
          </div>
        </div>

        {/* Request Date */}
        <div className="col-md-6">
          <label className="form-label fw-semibold">Request Date <span className="text-danger">*</span></label>
          <input
            type="date"
            name="requestDate"
            className={`form-control rounded-3 ${errors.requestDate && touched.requestDate ? 'is-invalid' : ''}`}
            value={formData.requestDate}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <InlineFieldError message={errors.requestDate} />
        </div>

        {/* Required Date */}
        <div className="col-md-6">
          <label className="form-label fw-semibold">Required Date <span className="text-danger">*</span></label>
          <input
            type="date"
            name="requiredDate"
            className={`form-control rounded-3 ${errors.requiredDate && touched.requiredDate ? 'is-invalid' : ''}`}
            value={formData.requiredDate}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <InlineFieldError message={errors.requiredDate} />
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
          <span>{isEdit ? 'Update Request' : 'Submit Request'}</span>
        </button>
      </div>
    </form>
  );
};

export default ServiceRequestForm;
