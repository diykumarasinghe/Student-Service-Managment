import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StudentForm from '../components/StudentForm';
import { createStudentApi } from '../api/studentApi';

const AddStudentPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (studentData) => {
    setLoading(true);
    setServerError('');
    try {
      await createStudentApi(studentData);
      navigate('/students');
    } catch (err) {
      console.error('Failed to create student:', err);
      const msg = err.response?.data?.message || err.response?.data?.errors?.email || 'Failed to create student.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />

      <div className="main-content">
        <Navbar toggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <main className="page-container" style={{ maxWidth: '850px' }}>
          <StudentForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/students')}
            loading={loading}
            serverError={serverError}
          />
        </main>
      </div>
    </div>
  );
};

export default AddStudentPage;
