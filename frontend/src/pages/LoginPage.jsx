import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InlineFieldError from '../components/InlineFieldError';
import { validateEmail } from '../utils/validation';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    setEmailError(validateEmail(val));
    setServerError('');
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    setPasswordError(!val ? 'Password is required.' : '');
    setServerError('');
  };

  const isFormValid = () => {
    return email && password && !emailError && !passwordError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eErr = validateEmail(email);
    const pErr = !password ? 'Password is required.' : '';

    setEmailError(eErr);
    setPasswordError(pErr);

    if (eErr || pErr) return;

    setLoading(true);
    setServerError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email address or password.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left panel: Illustration */}
      <div className="auth-left-panel">
        <div className="text-center mb-4">
          <h2 className="fw-bold text-dark mb-2">Student Service Portal</h2>
          <p className="text-muted fs-6">Streamlined requests & administrative service management</p>
        </div>
        <img
          src="/student-illustration.svg"
          alt="Student Illustration"
          className="auth-illustration"
        />
      </div>

      {/* Right panel: Login card */}
      <div className="auth-right-panel">
        <div className="auth-card">
          <div className="text-center mb-4">
            <h3 className="auth-title">Welcome Back!</h3>
            <p className="auth-subtitle">Sign in to manage student services.</p>
          </div>

          {serverError && (
            <div className="alert alert-danger rounded-3 small py-2 px-3 mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email field */}
            <div className="mb-3">
              <label className="form-label fw-semibold small text-secondary">Email Address</label>
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

            {/* Password field */}
            <div className="mb-3">
              <label className="form-label fw-semibold small text-secondary">Password</label>
              <div className="auth-input-group">
                <i className="bi bi-lock input-icon"></i>
                <input
                  type="password"
                  className={`form-control auth-input ${passwordError ? 'is-invalid' : ''}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
              <InlineFieldError message={passwordError} />
            </div>

            {/* Forgot password link */}
            <div className="text-end mb-4">
              <Link to="/forgot-password" className="auth-link small">
                Forgot Password?
              </Link>
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="btn auth-button w-100 d-flex align-items-center justify-content-center gap-2 mb-3"
              disabled={!isFormValid() || loading}
            >
              {loading && <span className="spinner-border spinner-border-sm" role="status"></span>}
              <span>Sign In</span>
            </button>
          </form>

          {/* Registration link */}
          <div className="text-center mt-3 pt-3 border-top">
            <span className="text-muted small">Don't have an account? </span>
            <Link to="/register" className="auth-link small">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

