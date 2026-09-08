import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import ServiceRequestTable from '../components/ServiceRequestTable';
import LoadingSpinner from '../components/LoadingSpinner';
import { getRequestStatsApi, getAllRequestsApi } from '../api/requestApi';
import { Link, useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const { user, isAdmin, isStudent } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({});
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const statsData = await getRequestStatsApi();
        setStats(statsData);

        const requestsData = await getAllRequestsApi();
        setRecentRequests(requestsData.slice(0, 5)); // Show 5 most recent requests
      } catch (err) {
        console.error('Error loading dashboard:', err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />

      <div className="main-content">
        <Navbar toggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <main className="page-container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div>
              <h3 className="fw-bold text-dark mb-1">
                Welcome back, {user?.firstName}!
              </h3>
              <p className="text-secondary mb-0">
                {isAdmin ? 'System Administrative Overview' : 'Overview of your service requests'}
              </p>
            </div>

            <div className="d-flex gap-2">
              <Link to="/requests/add" className="btn btn-primary rounded-pill px-3 d-flex align-items-center gap-2">
                <i className="bi bi-plus-circle"></i>
                <span>New Request</span>
              </Link>
              {isAdmin && (
                <Link to="/students/add" className="btn btn-outline-primary rounded-pill px-3 d-flex align-items-center gap-2">
                  <i className="bi bi-person-plus"></i>
                  <span>Add Student</span>
                </Link>
              )}
            </div>
          </div>

          {error && (
            <div className="alert alert-danger rounded-3 mb-4">{error}</div>
          )}

          {loading ? (
            <LoadingSpinner text="Loading dashboard metrics..." />
          ) : (
            <>
              {/* Stat Cards Grid */}
              <div className="row g-3 mb-4">
                {isAdmin ? (
                  <>
                    <div className="col-lg-2 col-md-4 col-sm-6">
                      <StatCard title="Total Students" count={stats.totalStudents} icon="bi-people" color="primary" />
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-6">
                      <StatCard title="Active Students" count={stats.activeStudents} icon="bi-person-check" color="success" />
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6">
                      <StatCard title="Total Requests" count={stats.totalRequests} icon="bi-card-checklist" color="info" />
                    </div>
                    <div className="col-lg-2 col-md-6 col-sm-6">
                      <StatCard title="Pending Requests" count={stats.pendingRequests} icon="bi-hourglass-split" color="warning" />
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-6">
                      <StatCard title="Completed Requests" count={stats.completedRequests} icon="bi-check-circle" color="success" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-md-4">
                      <StatCard title="My Total Requests" count={stats.myTotalRequests} icon="bi-card-checklist" color="primary" />
                    </div>
                    <div className="col-md-4">
                      <StatCard title="Pending Requests" count={stats.pendingRequests} icon="bi-hourglass-split" color="warning" />
                    </div>
                    <div className="col-md-4">
                      <StatCard title="Completed Requests" count={stats.completedRequests} icon="bi-check-circle" color="success" />
                    </div>
                  </>
                )}
              </div>

              {/* Recent Requests Section */}
              <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                <div className="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center border-0">
                  <h5 className="fw-bold text-dark mb-0">
                    {isAdmin ? 'Recent Service Requests' : 'My Recent Requests'}
                  </h5>
                  <Link to="/requests" className="btn btn-sm btn-link text-decoration-none fw-semibold">
                    View All <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>

                <div className="card-body p-0">
                  <ServiceRequestTable
                    requests={recentRequests}
                    onEdit={(req) => navigate(`/requests/edit/${req.id}`)}
                    onViewDetails={(req) => navigate(`/requests`)}
                  />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
