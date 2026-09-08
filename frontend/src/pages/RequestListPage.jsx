import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SearchFilter from '../components/SearchFilter';
import ServiceRequestTable from '../components/ServiceRequestTable';
import LoadingSpinner from '../components/LoadingSpinner';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import {
  getAllRequestsApi,
  searchRequestsApi,
  filterRequestsApi,
  deleteRequestApi,
  updateRequestStatusApi,
} from '../api/requestApi';
import { getAllCategoriesApi } from '../api/categoryApi';

const RequestListPage = () => {
  const { isAdmin, isStudent } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Status update modal state (Admin only)
  const [statusModal, setStatusModal] = useState({
    show: false,
    request: null,
    status: 'PENDING',
    adminNote: '',
    loading: false,
  });

  // Delete confirm modal state
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    request: null,
    loading: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getAllCategoriesApi();
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      let data;
      if (selectedCategory || selectedStatus) {
        data = await filterRequestsApi(selectedCategory || null, selectedStatus || null);
      } else if (searchTerm.trim()) {
        data = await searchRequestsApi(searchTerm.trim());
      } else {
        data = await getAllRequestsApi();
      }
      setRequests(data);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
      setError('Failed to retrieve service requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [searchTerm, selectedCategory, selectedStatus]);

  // Open status update modal (ADMIN only)
  const handleOpenStatusModal = (req) => {
    setStatusModal({
      show: true,
      request: req,
      status: req.status,
      adminNote: req.adminNote || '',
      loading: false,
    });
  };

  // Submit status update
  const handleSaveStatus = async () => {
    if (!statusModal.request) return;
    setStatusModal((prev) => ({ ...prev, loading: true }));
    try {
      await updateRequestStatusApi(statusModal.request.id, {
        status: statusModal.status,
        adminNote: statusModal.adminNote,
      });
      setStatusModal({ show: false, request: null, status: 'PENDING', adminNote: '', loading: false });
      fetchRequests();
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status.');
      setStatusModal((prev) => ({ ...prev, loading: false }));
    }
  };

  // Delete click
  const handleDeleteClick = (req) => {
    setDeleteModal({
      show: true,
      request: req,
      loading: false,
    });
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!deleteModal.request) return;
    setDeleteModal((prev) => ({ ...prev, loading: true }));
    try {
      await deleteRequestApi(deleteModal.request.id);
      setDeleteModal({ show: false, request: null, loading: false });
      fetchRequests();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete service request.');
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />

      <div className="main-content">
        <Navbar toggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <main className="page-container">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
            <div>
              <h3 className="fw-bold text-dark mb-1">
                {isAdmin ? 'All Service Requests' : 'My Service Requests'}
              </h3>
              <p className="text-secondary mb-0">
                {isAdmin ? 'Manage, track and update student requests' : 'Track and manage your submitted requests'}
              </p>
            </div>

            <button
              className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2"
              onClick={() => navigate('/requests/add')}
            >
              <i className="bi bi-plus-circle-fill"></i>
              <span>Create Request</span>
            </button>
          </div>

          <SearchFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            placeholder="Search by request ID, subject, student, category..."
            showFilters={true}
          />

          {error && <div className="alert alert-danger rounded-3 mb-4">{error}</div>}

          {loading ? (
            <LoadingSpinner text="Fetching service requests..." />
          ) : (
            <ServiceRequestTable
              requests={requests}
              onEdit={(req) => navigate(`/requests/edit/${req.id}`)}
              onUpdateStatus={isAdmin ? handleOpenStatusModal : null}
              onDelete={handleDeleteClick}
            />
          )}

          {/* Admin Status Update Modal */}
          {statusModal.show && (
            <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content shadow-lg border-0 rounded-4">
                  <div className="modal-header border-0 pb-0">
                    <h5 className="modal-title fw-bold text-dark">Update Request Status</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setStatusModal({ show: false, request: null, status: 'PENDING', adminNote: '', loading: false })}
                    ></button>
                  </div>
                  <div className="modal-body py-3">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Request ID</label>
                      <input type="text" className="form-control bg-light" value={statusModal.request?.requestId || ''} readOnly />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Request Status <span className="text-danger">*</span></label>
                      <select
                        className="form-select"
                        value={statusModal.status}
                        onChange={(e) => setStatusModal((prev) => ({ ...prev, status: e.target.value }))}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Admin Note / Response</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Add optional notes for the student..."
                        value={statusModal.adminNote}
                        onChange={(e) => setStatusModal((prev) => ({ ...prev, adminNote: e.target.value }))}
                      ></textarea>
                    </div>
                  </div>
                  <div className="modal-footer border-0 pt-0">
                    <button
                      type="button"
                      className="btn btn-light rounded-pill px-4"
                      onClick={() => setStatusModal({ show: false, request: null, status: 'PENDING', adminNote: '', loading: false })}
                      disabled={statusModal.loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2"
                      onClick={handleSaveStatus}
                      disabled={statusModal.loading}
                    >
                      {statusModal.loading && <span className="spinner-border spinner-border-sm" role="status"></span>}
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirm Modal */}
          <DeleteConfirmModal
            show={deleteModal.show}
            title="Delete Service Request"
            message={
              deleteModal.request
                ? `Are you sure you want to delete service request "${deleteModal.request.requestId}" (${deleteModal.request.subject})?`
                : ''
            }
            loading={deleteModal.loading}
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeleteModal({ show: false, request: null, loading: false })}
          />
        </main>
      </div>
    </div>
  );
};

export default RequestListPage;
