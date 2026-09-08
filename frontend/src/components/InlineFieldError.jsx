import React from 'react';

const InlineFieldError = ({ message }) => {
  if (!message) return null;
  return (
    <div className="text-danger small mt-1 fw-medium" style={{ fontSize: '0.85rem' }}>
      <i className="bi bi-exclamation-circle-fill me-1"></i>
      {message}
    </div>
  );
};

export default InlineFieldError;

