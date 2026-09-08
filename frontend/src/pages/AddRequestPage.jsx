import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ServiceRequestForm from '../components/ServiceRequestForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { createRequestApi } from '../api/requestApi';
import { getAllCategoriesApi } from '../api/categoryApi';

const AddRequestPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      setCatLoading(true);
      try {
        const data = await getAllCategoriesApi();
        setCategories(data.filter((c) => c.active));
      } catch (err) {
        console.error('Failed to load categories:', err);
        setServerError('Failed to load service categories.');
      } finally {
        setCatLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (requestData) => {
    setLoading(true);
    setServerError('');
    try {
      await createRequestApi(requestData);
      navigate('/requests');
    } catch (err) {
      console.error('Failed to create service request:', err);
      const msg = err.response?.data?.message || 'Failed to submit service request.';
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
          {catLoading ? (
            <LoadingSpinner text="Loading service categories..." />
          ) : (
            <ServiceRequestForm
              categories={categories}
              onSubmit={handleSubmit}
              onCancel={() => navigate('/requests')}
              loading={loading}
              serverError={serverError}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default AddRequestPage;
