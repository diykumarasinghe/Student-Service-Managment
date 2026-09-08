import React from 'react';

const DeleteConfirmModal = ({ show, title = 'Confirm Delete', message, onConfirm, onCancel, loading = false }) => {
  if (!show) return null;

  return (
    <div className="modal fade show d-block tab-index-n1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-lg border-0 rounded-4">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold text-danger d-flex align-items-center gap-2">
              <i className="bi bi-exclamation-triangle-fill fs-4"></i>
              {title}
            </h5>
            <button type="button" className="btn-close" onClick={onCancel} disabled={loading}></button>
          </div>
          <div className="modal-body py-3">
            <p className="mb-0 text-secondary">{message || 'Are you sure you want to delete this record? This action cannot be undone.'}</p>
          </div>
          <div className="modal-footer border-0 pt-0">
            <button type="button" className="btn btn-light rounded-pill px-4" onClick={onCancel} disabled={loading}>
              Cancel
            </button>
            <button type="button" className="btn btn-danger rounded-pill px-4 d-flex align-items-center gap-2" onClick={onConfirm} disabled={loading}>
              {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;

