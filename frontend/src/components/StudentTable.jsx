import React from 'react';
import { STATUS_BADGE_CLASSES } from '../utils/constants';

const StudentTable = ({ students, onEdit, onDelete }) => {
  if (!students || students.length === 0) {
    return (
      <div className="text-center p-5 bg-white rounded-3 shadow-sm">
        <i className="bi bi-people text-muted display-4 mb-3 d-block"></i>
        <h5 className="text-muted fw-normal">No student records found.</h5>
      </div>
    );
  }

  return (
    <div className="table-responsive bg-white rounded-3 shadow-sm">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th className="py-3 px-4">Student ID</th>
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">Phone</th>
            <th className="py-3 px-4">Course</th>
            <th className="py-3 px-4">Intake</th>
            <th className="py-3 px-4">Registration Date</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4 text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td className="py-3 px-4 fw-semibold text-primary">{student.studentId}</td>
              <td className="py-3 px-4 fw-medium">{student.firstName} {student.lastName}</td>
              <td className="py-3 px-4 text-secondary">{student.email}</td>
              <td className="py-3 px-4">{student.phoneNumber}</td>
              <td className="py-3 px-4">{student.course}</td>
              <td className="py-3 px-4">{student.intake}</td>
              <td className="py-3 px-4">{student.registrationDate}</td>
              <td className="py-3 px-4">
                <span className={`badge rounded-pill px-3 py-2 ${STATUS_BADGE_CLASSES[student.status] || 'bg-secondary'}`}>
                  {student.status}
                </span>
              </td>
              <td className="py-3 px-4 text-end">
                <div className="btn-group btn-group-sm">
                  {onEdit && (
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => onEdit(student)}
                      title="Edit Student"
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => onDelete(student)}
                      title="Delete Student"
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

export default StudentTable;
