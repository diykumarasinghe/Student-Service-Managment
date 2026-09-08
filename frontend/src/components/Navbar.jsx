import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = () => {
    if (user?.role === 'ADMIN') {
      return <span className="badge bg-danger ms-2 px-2 py-1">ADMIN</span>;
    }
    return <span className="badge bg-primary ms-2 px-2 py-1">STUDENT</span>;
  };

  return (
    <header className="navbar navbar-expand-lg bg-white border-bottom shadow-sm sticky-top px-3 py-2">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <button className="btn btn-light d-md-none me-2" onClick={toggleSidebar}>
            <i className="bi bi-list fs-4"></i>
          </button>
          <span className="navbar-brand mb-0 h1 text-dark fw-bold fs-5">
            Student Service Management
          </span>
        </div>

        <div className="d-flex align-items-center">
          <div className="me-3 text-end d-none d-sm-block">
            <div className="fw-semibold text-dark mb-0">
              {user?.firstName} {user?.lastName}
              {getRoleBadge()}
            </div>
            <small className="text-muted">{user?.email}</small>
          </div>

          <button
            className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 rounded-pill px-3 py-1"
            onClick={handleLogout}
            title="Logout"
          >
            <i className="bi bi-box-arrow-right"></i>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
