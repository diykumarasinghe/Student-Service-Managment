import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Import CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/global.css';
import './styles/auth.css';
import './styles/dashboard.css';
import './styles/forms.css';
import './styles/responsive.css';

// Import Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import StudentListPage from './pages/StudentListPage';
import AddStudentPage from './pages/AddStudentPage';
import EditStudentPage from './pages/EditStudentPage';
import RequestListPage from './pages/RequestListPage';
import AddRequestPage from './pages/AddRequestPage';
import EditRequestPage from './pages/EditRequestPage';
import CategoryManagementPage from './pages/CategoryManagementPage';
import MyProfilePage from './pages/MyProfilePage';
import AccessDeniedPage from './pages/AccessDeniedPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected Common Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests"
            element={
              <ProtectedRoute>
                <RequestListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests/add"
            element={
              <ProtectedRoute>
                <AddRequestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests/edit/:id"
            element={
              <ProtectedRoute>
                <EditRequestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MyProfilePage />
              </ProtectedRoute>
            }
          />

          {/* ADMIN Only Routes */}
          <Route
            path="/students"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <StudentListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/add"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AddStudentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/edit/:id"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <EditStudentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <CategoryManagementPage />
              </ProtectedRoute>
            }
          />

          {/* System Fallback Routes */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/access-denied" element={<AccessDeniedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
