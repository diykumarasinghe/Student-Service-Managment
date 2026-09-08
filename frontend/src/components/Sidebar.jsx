import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const { isAdmin } = useAuth();

  return (
    <aside className={`app-sidebar ${isOpen ? 'show' : ''}`}>
      <div className="sidebar-header p-3 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-mortarboard-fill fs-3 text-primary-accent"></i>
          <span className="fw-bold fs-5 text-white">SSM System</span>
        </div>
        <button className="btn-close btn-close-white d-md-none" onClick={closeSidebar}></button>
      </div>

      <nav className="sidebar-nav mt-3">
        <div className="nav-section-title px-3 py-1 text-uppercase text-muted small fw-semibold">
          Main Navigation
        </div>

        <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
          <i className="bi bi-speedometer2 me-2"></i>
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/requests" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
          <i className="bi bi-card-checklist me-2"></i>
          <span>Service Requests</span>
        </NavLink>

        <NavLink to="/requests/add" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
          <i className="bi bi-plus-circle me-2"></i>
          <span>New Request</span>
        </NavLink>

        <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
          <i className="bi bi-person-badge me-2"></i>
          <span>My Profile</span>
        </NavLink>

        {isAdmin && (
          <>
            <div className="nav-section-title px-3 py-1 mt-4 text-uppercase text-muted small fw-semibold">
              Admin Management
            </div>

            <NavLink to="/students" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
              <i className="bi bi-people-fill me-2"></i>
              <span>Students</span>
            </NavLink>

            <NavLink to="/students/add" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
              <i className="bi bi-person-plus-fill me-2"></i>
              <span>Add Student</span>
            </NavLink>

            <NavLink to="/categories" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
              <i className="bi bi-tags-fill me-2"></i>
              <span>Service Categories</span>
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;

