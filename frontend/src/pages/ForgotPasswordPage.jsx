import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPasswordApi } from '../api/authApi';
import InlineFieldError from '../components/InlineFieldError';
import { validateEmail, validatePassword, validateConfirmPassword } from '../utils/validation';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    setEmailError(validateEmail(val));
    setServerError('');
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setNewPassword(val);
    setPasswordError(validatePassword(val));
    if (confirmPassword) {
      setConfirmError(validateConfirmPassword(val, confirmPassword));
    }
    setServerError('');
  };

  const handleConfirmChange = (e) => {
    const val = e.target.value;
    setConfirmPassword(val);
    setConfirmError(validateConfirmPassword(newPassword, val));
    setServerError('');
  };

  const isFormValid = () => {
    return email && newPassword && confirmPassword && !emailError && !passwordError && !confirmError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eErr = validateEmail(email);
    const pErr = validatePassword(newPassword);
    const cErr = validateConfirmPassword(newPassword, confirmPassword);

    setEmailError(eErr);
    setPasswordError(pErr);
    setConfirmError(cErr);

    if (eErr || pErr || cErr) return;

    setLoading(true);
    setServerError('');
    setSuccessMessage('');

    try {
      await forgotPasswordApi({ email, newPassword, confirmPassword });
      setSuccessMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.email || 'Failed to reset password. Please check your email.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left-panel">
        <div className="text-center mb-4">
          <h2 className="fw-bold text-dark mb-2">Reset Password</h2>
          <p className="text-muted fs-6">Securely update your student account password</p>
        </div>
        <img
          src="/student-illustration.svg"
          alt="Student Illustration"
          className="auth-illustration"
        />
      </div>

      <div className="auth-right-panel">
        <div className="auth-card">
          <div className="text-center mb-4">
            <h3 className="auth-title">Forgot Password?</h3>
            <p className="auth-subtitle">Enter your registered email and choose a new password.</p>
          </div>

          {serverError && (
            <div className="alert alert-danger rounded-3 small py-2 px-3 mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span>{serverError}</span>
            </div>
          )}

          {successMessage && (
            <div className="alert alert-success rounded-3 small py-2 px-3 mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-check-circle-fill"></i>
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="mb-3">
              <label className="form-label fw-semibold small text-secondary">Registered Email Address</label>
              <div className="auth-input-group">
                <i className="bi bi-envelope input-icon"></i>
                <input
                  type="email"
                  className={`form-control auth-input ${emailError ? 'is-invalid' : ''}`}
                  placeholder="student@example.com"
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
              <InlineFieldError message={emailError} />
            </div>

            {/* New Password */}
            <div className="mb-3">
              <label className="form-label fw-semibold small text-secondary">New Password</label>
              <div className="auth-input-group">
                <i className="bi bi-lock input-icon"></i>
                <input
                  type="password"
                  className={`form-control auth-input ${passwordError ? 'is-invalid' : ''}`}
                  placeholder="Min 8, uppercase, lowercase, digit, symbol"
                  value={newPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              <InlineFieldError message={passwordError} />
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="form-label fw-semibold small text-secondary">Confirm New Password</label>
              <div className="auth-input-group">
                <i className="bi bi-lock-fill input-icon"></i>
                <input
                  type="password"
                  className={`form-control auth-input ${confirmError ? 'is-invalid' : ''}`}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={handleConfirmChange}
                />
              </div>
              <InlineFieldError message={confirmError} />
            </div>

            <button
              type="submit"
              className="btn auth-button w-100 d-flex align-items-center justify-content-center gap-2 mb-3"
              disabled={!isFormValid() || loading}
            >
              {loading && <span className="spinner-border spinner-border-sm" role="status"></span>}
              <span>Reset Password</span>
            </button>
          </form>

          <div className="text-center mt-3 pt-3 border-top">
            <Link to="/login" className="auth-link small d-flex align-items-center justify-content-center gap-1">
              <i className="bi bi-arrow-left"></i> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
