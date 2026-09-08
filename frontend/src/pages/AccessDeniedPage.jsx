import React from 'react';
import { Link } from 'react-router-dom';

const AccessDeniedPage = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light p-4 text-center">
      <div className="card shadow-lg border-0 rounded-4 p-5" style={{ maxWidth: '500px' }}>
        <i className="bi bi-shield-slash-fill text-danger display-1 mb-3"></i>
        <h2 className="fw-bold text-dark mb-2">Access Denied</h2>
        <p className="text-secondary mb-4">
          You do not have administrative permission to view or modify this page.
        </p>
        <Link to="/dashboard" className="btn btn-primary rounded-pill px-4">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default AccessDeniedPage;

