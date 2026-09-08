import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StudentForm from '../components/StudentForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { getStudentByIdApi, updateStudentApi } from '../api/studentApi';

const EditStudentPage = () => {
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [initialValues, setInitialValues] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      setFetchLoading(true);
      try {
        const data = await getStudentByIdApi(id);
        setInitialValues(data);
      } catch (err) {
        console.error('Failed to fetch student:', err);
        setServerError('Failed to load student details.');
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) fetchStudent();
  }, [id]);

  const handleSubmit = async (studentData) => {
    setSubmitLoading(true);
    setServerError('');
    try {
      await updateStudentApi(id, studentData);
      navigate('/students');
    } catch (err) {
      console.error('Failed to update student:', err);
      const msg = err.response?.data?.message || err.response?.data?.errors?.email || 'Failed to update student details.';
      setServerError(msg);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />

      <div className="main-content">
        <Navbar toggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <main className="page-container" style={{ maxWidth: '850px' }}>
          {fetchLoading ? (
            <LoadingSpinner text="Loading student details..." />
          ) : (
            <StudentForm
              initialValues={initialValues}
              isEdit={true}
              onSubmit={handleSubmit}
              onCancel={() => navigate('/students')}
              loading={submitLoading}
              serverError={serverError}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default EditStudentPage;

