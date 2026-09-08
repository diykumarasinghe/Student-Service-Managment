import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';

const MyProfilePage = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        if (user?.studentId) {
          const res = await axiosInstance.get(`/students/${user.studentId}`);
          setProfile(res.data);
        } else {
          setProfile({
            firstName: user?.firstName || 'User',
            lastName: user?.lastName || '',
            email: user?.email || '',
            role: user?.role || 'STUDENT',
          });
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        setProfile({
          firstName: user?.firstName || 'User',
          lastName: user?.lastName || '',
          email: user?.email || '',
          role: user?.role || 'STUDENT',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />

      <div className="main-content">
        <Navbar toggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <main className="page-container" style={{ maxWidth: '800px' }}>
          <div className="mb-4">
            <h3 className="fw-bold text-dark mb-1">My Student Profile</h3>
            <p className="text-secondary mb-0">Your personal details and enrollment summary</p>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading profile..." />
          ) : (
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
              <div className="card-header bg-primary text-white p-4 d-flex align-items-center gap-3">
                <div
                  className="rounded-circle bg-white text-primary fw-bold d-flex align-items-center justify-content-center fs-3 shadow-sm"
                  style={{ width: '64px', height: '64px' }}
                >
                  {profile?.firstName?.charAt(0)}{profile?.lastName?.charAt(0)}
                </div>
                <div>
                  <h4 className="mb-1 text-white fw-bold">{profile?.firstName} {profile?.lastName}</h4>
                  <span className="badge bg-light text-primary fw-semibold me-2">
                    {profile?.studentId ? `ID: ${profile.studentId}` : profile?.role}
                  </span>
                  <span className="badge bg-success-subtle text-white">ACTIVE STUDENT</span>
                </div>
              </div>

              <div className="card-body p-4">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="text-muted small fw-semibold text-uppercase mb-1">Email Address</div>
                    <div className="fs-6 text-dark fw-medium">{profile?.email || 'N/A'}</div>
                  </div>

                  <div className="col-md-6">
                    <div className="text-muted small fw-semibold text-uppercase mb-1">Phone Number</div>
                    <div className="fs-6 text-dark fw-medium">{profile?.phoneNumber || 'N/A'}</div>
                  </div>

                  <div className="col-md-6">
                    <div className="text-muted small fw-semibold text-uppercase mb-1">Course Enrolled</div>
                    <div className="fs-6 text-dark fw-medium">{profile?.course || 'N/A'}</div>
                  </div>

                  <div className="col-md-6">
                    <div className="text-muted small fw-semibold text-uppercase mb-1">Intake Batch</div>
                    <div className="fs-6 text-dark fw-medium">{profile?.intake || 'N/A'}</div>
                  </div>

                  <div className="col-md-6">
                    <div className="text-muted small fw-semibold text-uppercase mb-1">Registration Date</div>
                    <div className="fs-6 text-dark fw-medium">{profile?.registrationDate || 'N/A'}</div>
                  </div>

                  <div className="col-md-6">
                    <div className="text-muted small fw-semibold text-uppercase mb-1">Account Role</div>
                    <div className="fs-6 text-dark fw-medium">{user?.role}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyProfilePage;
