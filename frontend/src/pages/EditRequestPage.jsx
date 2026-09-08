import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ServiceRequestForm from '../components/ServiceRequestForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { getRequestByIdApi, updateRequestApi } from '../api/requestApi';
import { getAllCategoriesApi } from '../api/categoryApi';

const EditRequestPage = () => {
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [initialValues, setInitialValues] = useState(null);
  const [categories, setCategories] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setFetchLoading(true);
      try {
        const [reqData, catsData] = await Promise.all([
          getRequestByIdApi(id),
          getAllCategoriesApi(),
        ]);

        setInitialValues({
          categoryId: reqData.categoryId,
          subject: reqData.subject,
          description: reqData.description,
          requestDate: reqData.requestDate,
          requiredDate: reqData.requiredDate,
        });

        setCategories(catsData.filter((c) => c.active || c.id === reqData.categoryId));
      } catch (err) {
        console.error('Failed to fetch request:', err);
        setServerError('Failed to load service request details.');
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleSubmit = async (requestData) => {
    setSubmitLoading(true);
    setServerError('');
    try {
      await updateRequestApi(id, requestData);
      navigate('/requests');
    } catch (err) {
      console.error('Failed to update service request:', err);
      const msg = err.response?.data?.message || 'Failed to update service request.';
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
            <LoadingSpinner text="Loading request details..." />
          ) : (
            <ServiceRequestForm
              initialValues={initialValues}
              categories={categories}
              isEdit={true}
              onSubmit={handleSubmit}
              onCancel={() => navigate('/requests')}
              loading={submitLoading}
              serverError={serverError}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default EditRequestPage;
