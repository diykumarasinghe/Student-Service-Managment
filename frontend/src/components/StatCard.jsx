import React from 'react';

const StatCard = ({ title, count, icon, color = 'primary' }) => {
  const getColorClass = () => {
    switch (color) {
      case 'success':
        return 'border-start border-success border-4 text-success';
      case 'warning':
        return 'border-start border-warning border-4 text-warning';
      case 'danger':
        return 'border-start border-danger border-4 text-danger';
      case 'info':
        return 'border-start border-info border-4 text-info';
      default:
        return 'border-start border-primary border-4 text-primary';
    }
  };

  const getBgIconClass = () => {
    switch (color) {
      case 'success':
        return 'bg-success-subtle text-success';
      case 'warning':
        return 'bg-warning-subtle text-warning';
      case 'danger':
        return 'bg-danger-subtle text-danger';
      case 'info':
        return 'bg-info-subtle text-info';
      default:
        return 'bg-primary-subtle text-primary';
    }
  };

  return (
    <div className={`card shadow-sm rounded-3 h-100 ${getColorClass()}`}>
      <div className="card-body d-flex align-items-center justify-content-between p-4">
        <div>
          <div className="text-muted small text-uppercase fw-semibold mb-1">{title}</div>
          <h2 className="mb-0 fw-bold text-dark">{count !== undefined ? count : 0}</h2>
        </div>
        <div className={`rounded-circle p-3 d-flex align-items-center justify-content-center ${getBgIconClass()}`} style={{ width: '56px', height: '56px' }}>
          <i className={`bi ${icon} fs-3`}></i>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
