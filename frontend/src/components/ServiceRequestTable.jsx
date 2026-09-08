import React from 'react';
import { STATUS_BADGE_CLASSES } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

const ServiceRequestTable = ({ requests, onEdit, onUpdateStatus, onDelete, onViewDetails }) => {
  const { isAdmin, isStudent } = useAuth();

  if (!requests || requests.length === 0) {
    return (
      <div className="text-center p-5 bg-white rounded-3 shadow-sm">
        <i className="bi bi-inbox text-muted display-4 mb-3 d-block"></i>
        <h5 className="text-muted fw-normal">No service requests found.</h5>
      </div>
    );
  }

  return (
    <div className="table-responsive bg-white rounded-3 shadow-sm">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th className="py-3 px-4">Request ID</th>
            {isAdmin && <th className="py-3 px-4">Student</th>}
            <th className="py-3 px-4">Category</th>
            <th className="py-3 px-4">Subject</th>
            <th className="py-3 px-4">Request Date</th>
            <th className="py-3 px-4">Required Date</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Admin Note</th>
            <th className="py-3 px-4 text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              <td className="py-3 px-4 fw-semibold text-primary">{req.requestId}</td>
              {isAdmin && (
                <td className="py-3 px-4">
                  <div className="fw-medium">{req.studentName}</div>
                  <small className="text-muted">{req.studentEmail}</small>
                </td>
              )}
              <td className="py-3 px-4">
                <span className="badge bg-light text-dark border px-2 py-1">{req.categoryName}</span>
              </td>
              <td className="py-3 px-4 fw-medium text-dark">{req.subject}</td>
              <td className="py-3 px-4 text-secondary">{req.requestDate}</td>
              <td className="py-3 px-4 text-secondary">{req.requiredDate}</td>
              <td className="py-3 px-4">
                <span className={`badge rounded-pill px-3 py-2 ${STATUS_BADGE_CLASSES[req.status] || 'bg-secondary'}`}>
                  {req.status}
                </span>
              </td>
              <td className="py-3 px-4 text-muted small">
                {req.adminNote ? (
                  <span className="text-truncate d-inline-block" style={{ maxWidth: '150px' }} title={req.adminNote}>
                    {req.adminNote}
                  </span>
                ) : (
                  <em>None</em>
                )}
              </td>
              <td className="py-3 px-4 text-end">
                <div className="btn-group btn-group-sm">
                  {/* View Details */}
                  {onViewDetails && (
                    <button
                      className="btn btn-outline-info"
                      onClick={() => onViewDetails(req)}
                      title="View Details"
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                  )}

                  {/* ADMIN Status Update */}
                  {isAdmin && onUpdateStatus && (
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => onUpdateStatus(req)}
                      title="Update Status"
                    >
                      <i className="bi bi-arrow-repeat"></i> Status
                    </button>
                  )}

                  {/* Edit Request */}
                  {onEdit && (isAdmin || (isStudent && req.status === 'PENDING')) && (
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => onEdit(req)}
                      title="Edit Request"
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  )}

                  {/* Delete Request */}
                  {onDelete && (isAdmin || (isStudent && req.status === 'PENDING')) && (
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => onDelete(req)}
                      title="Delete Request"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceRequestTable;
