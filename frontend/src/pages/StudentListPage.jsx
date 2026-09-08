import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SearchFilter from '../components/SearchFilter';
import StudentTable from '../components/StudentTable';
import LoadingSpinner from '../components/LoadingSpinner';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { getAllStudentsApi, searchStudentsApi, deleteStudentApi } from '../api/studentApi';

const StudentListPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    student: null,
    loading: false,
  });

  const navigate = useNavigate();

  const fetchStudents = async (query = '') => {
    setLoading(true);
    setError('');
    try {
      let data;
      if (query.trim()) {
        data = await searchStudentsApi(query);
      } else {
        data = await getAllStudentsApi();
      }
      setStudents(data);
    } catch (err) {
      console.error('Failed to load students:', err);
      setError('Failed to retrieve student records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(searchTerm);
  }, [searchTerm]);

  const handleDeleteClick = (student) => {
    setDeleteModal({
      show: true,
      student,
      loading: false,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.student) return;
    setDeleteModal((prev) => ({ ...prev, loading: true }));
    try {
      await deleteStudentApi(deleteModal.student.id);
      setDeleteModal({ show: false, student: null, loading: false });
      fetchStudents(searchTerm);
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete student record.');
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
              <h3 className="fw-bold text-dark mb-1">Student Directory</h3>
              <p className="text-secondary mb-0">Manage registered students and course enrollments</p>
            </div>

            <button
              className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2"
              onClick={() => navigate('/students/add')}
            >
              <i className="bi bi-person-plus-fill"></i>
              <span>Add Student</span>
            </button>
          </div>

          <SearchFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Search by student ID, name, email, or course..."
          />

          {error && <div className="alert alert-danger rounded-3 mb-4">{error}</div>}

          {loading ? (
            <LoadingSpinner text="Fetching student records..." />
          ) : (
            <StudentTable
              students={students}
              onEdit={(st) => navigate(`/students/edit/${st.id}`)}
              onDelete={handleDeleteClick}
            />
          )}

          <DeleteConfirmModal
            show={deleteModal.show}
            title="Delete Student Record"
            message={
              deleteModal.student
                ? `Are you sure you want to delete student "${deleteModal.student.firstName} ${deleteModal.student.lastName}" (${deleteModal.student.studentId})?`
                : ''
            }
            loading={deleteModal.loading}
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeleteModal({ show: false, student: null, loading: false })}
          />
        </main>
      </div>
    </div>
  );
};

export default StudentListPage;
