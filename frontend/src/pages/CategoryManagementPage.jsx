import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import InlineFieldError from '../components/InlineFieldError';
import {
  getAllCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from '../api/categoryApi';

const CategoryManagementPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Category Modal (Add / Edit)
  const [modal, setModal] = useState({
    show: false,
    isEdit: false,
    id: null,
    name: '',
    description: '',
    active: true,
    nameError: '',
    serverError: '',
    submitting: false,
  });

  // Delete modal
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    category: null,
    loading: false,
  });

  const fetchCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllCategoriesApi();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError('Failed to retrieve service categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAddModal = () => {
    setModal({
      show: true,
      isEdit: false,
      id: null,
      name: '',
      description: '',
      active: true,
      nameError: '',
      serverError: '',
      submitting: false,
    });
  };

  const handleOpenEditModal = (cat) => {
    setModal({
      show: true,
      isEdit: true,
      id: cat.id,
      name: cat.name,
      description: cat.description || '',
      active: cat.active,
      nameError: '',
      serverError: '',
      submitting: false,
    });
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setModal((prev) => ({
      ...prev,
      name: val,
      nameError: !val.trim() ? 'Category name is required.' : '',
      serverError: '',
    }));
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!modal.name.trim()) {
      setModal((prev) => ({ ...prev, nameError: 'Category name is required.' }));
      return;
    }

    setModal((prev) => ({ ...prev, submitting: true, serverError: '' }));

    try {
      const payload = {
        name: modal.name.trim(),
        description: modal.description.trim(),
        active: modal.active,
      };

      if (modal.isEdit) {
        await updateCategoryApi(modal.id, payload);
      } else {
        await createCategoryApi(payload);
      }

      setModal((prev) => ({ ...prev, show: false, submitting: false }));
      fetchCategories();
    } catch (err) {
      console.error('Category save failed:', err);
      const msg = err.response?.data?.message || 'Failed to save service category.';
      setModal((prev) => ({ ...prev, serverError: msg, submitting: false }));
    }
  };

  const handleDeleteClick = (cat) => {
    setDeleteModal({
      show: true,
      category: cat,
      loading: false,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.category) return;
    setDeleteModal((prev) => ({ ...prev, loading: true }));
    try {
      await deleteCategoryApi(deleteModal.category.id);
      setDeleteModal({ show: false, category: null, loading: false });
      fetchCategories();
    } catch (err) {
      console.error('Delete category failed:', err);
      alert('Failed to delete category.');
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
              <h3 className="fw-bold text-dark mb-1">Service Categories</h3>
              <p className="text-secondary mb-0">Configure available student service request categories</p>
            </div>

            <button
              className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2"
              onClick={handleOpenAddModal}
            >
              <i className="bi bi-plus-lg"></i>
              <span>Add Category</span>
            </button>
          </div>

          {error && <div className="alert alert-danger rounded-3 mb-4">{error}</div>}

          {loading ? (
            <LoadingSpinner text="Loading categories..." />
          ) : (
            <div className="table-responsive bg-white rounded-3 shadow-sm">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="py-3 px-4">Category Name</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id}>
                      <td className="py-3 px-4 fw-semibold text-dark">{cat.name}</td>
                      <td className="py-3 px-4 text-secondary">{cat.description || <em>No description</em>}</td>
                      <td className="py-3 px-4">
                        {cat.active ? (
                          <span className="badge bg-success rounded-pill px-3 py-1">Active</span>
                        ) : (
                          <span className="badge bg-secondary rounded-pill px-3 py-1">Inactive</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-end">
                        <div className="btn-group btn-group-sm">
                          <button className="btn btn-outline-primary" onClick={() => handleOpenEditModal(cat)} title="Edit Category">
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button className="btn btn-outline-danger" onClick={() => handleDeleteClick(cat)} title="Delete Category">
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Add / Edit Category Modal */}
          {modal.show && (
            <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content shadow-lg border-0 rounded-4">
                  <div className="modal-header border-0 pb-0">
                    <h5 className="modal-title fw-bold text-dark">
                      {modal.isEdit ? 'Edit Category' : 'Add New Category'}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setModal((prev) => ({ ...prev, show: false }))}
                    ></button>
                  </div>
                  <form onSubmit={handleModalSubmit} noValidate>
                    <div className="modal-body py-3">
                      {modal.serverError && (
                        <div className="alert alert-danger rounded-3 small py-2 px-3 mb-3">{modal.serverError}</div>
                      )}

                      <div className="mb-3">
                        <label className="form-label fw-semibold">Category Name <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className={`form-control ${modal.nameError ? 'is-invalid' : ''}`}
                          placeholder="e.g. Academic Support"
                          value={modal.name}
                          onChange={handleNameChange}
                        />
                        <InlineFieldError message={modal.nameError} />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">Description</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          placeholder="Brief category description..."
                          value={modal.description}
                          onChange={(e) => setModal((prev) => ({ ...prev, description: e.target.value }))}
                        ></textarea>
                      </div>

                      <div className="form-check form-switch mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="categoryActiveSwitch"
                          checked={modal.active}
                          onChange={(e) => setModal((prev) => ({ ...prev, active: e.target.checked }))}
                        />
                        <label className="form-check-label fw-medium" htmlFor="categoryActiveSwitch">
                          Active (Visible for new requests)
                        </label>
                      </div>
                    </div>

                    <div className="modal-footer border-0 pt-0">
                      <button
                        type="button"
                        className="btn btn-light rounded-pill px-4"
                        onClick={() => setModal((prev) => ({ ...prev, show: false }))}
                        disabled={modal.submitting}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2"
                        disabled={!modal.name.trim() || !!modal.nameError || modal.submitting}
                      >
                        {modal.submitting && <span className="spinner-border spinner-border-sm" role="status"></span>}
                        <span>Save Category</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirm Modal */}
          <DeleteConfirmModal
            show={deleteModal.show}
            title="Delete Category"
            message={
              deleteModal.category
                ? `Are you sure you want to delete category "${deleteModal.category.name}"?`
                : ''
            }
            loading={deleteModal.loading}
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeleteModal({ show: false, category: null, loading: false })}
          />
        </main>
      </div>
    </div>
  );
};

export default CategoryManagementPage;
