import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light p-4 text-center">
      <div className="card shadow-lg border-0 rounded-4 p-5" style={{ maxWidth: '500px' }}>
        <h1 className="display-1 fw-bold text-primary mb-0">404</h1>
        <h3 className="fw-bold text-dark mb-2">Page Not Found</h3>
        <p className="text-secondary mb-4">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/dashboard" className="btn btn-primary rounded-pill px-4">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

