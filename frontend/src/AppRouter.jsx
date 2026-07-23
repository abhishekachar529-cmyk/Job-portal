// frontend/src/AppRouter.jsx
// ⚡ FORCE RELOAD - Version 5.0 - WITH FIXED APPLY ROUTE
console.log('🚀🚀🚀 APP ROUTER VERSION 5.0 IS LOADING!!! 🚀🚀🚀');

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './components/layout/Layout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JobListingsPage from './pages/JobListingsPage';
import JobDetailPage from './pages/JobDetailPage';
import ApplyPage from './pages/ApplyPage';
import SeekerDashboard from './pages/SeekerDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import PostJobPage from './pages/PostJobPage';
import EditJobPage from './pages/EditJobPage';
import ViewApplicantsPage from './pages/ViewApplicantsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

// ✅ ADMIN PAGES
import AdminDashboard from './pages/AdminDashboard';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminJobsPage from './pages/AdminJobsPage';
import AdminApplicationsPage from './pages/AdminApplicationsPage';

import NotFoundPage from './pages/NotFoundPage';

console.log('📦 All pages imported!');

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);

  console.log('🔐 ProtectedRoute - User:', user?.email, 'Role:', user?.role);

  if (!user) {
    console.log('❌ No user, redirecting to login');
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log('❌ User role not allowed. Required:', allowedRoles, 'Got:', user?.role);
    return <Navigate to="/" />;
  }

  console.log('✅ Access granted for role:', user?.role);
  return children;
};

const AppRouter = () => {
  console.log('🚀🚀🚀 AppRouter component is EXECUTING! 🚀🚀🚀');

  return (
    <Routes>
      {/* ===== TEST ROUTE ===== */}
      <Route 
        path="/test" 
        element={
          <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontSize: '32px',
            fontWeight: 'bold'
          }}>
            <div style={{ textAlign: 'center' }}>
              <h1>✅ TEST ROUTE WORKS!</h1>
              <p style={{ fontSize: '18px' }}>If you see this, the AppRouter is loaded!</p>
              <button 
                onClick={() => window.location.href = '/admin/dashboard'}
                style={{ marginTop: '20px', padding: '10px 20px', background: 'white', color: '#4a00e0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}
              >
                Go to Admin Dashboard
              </button>
            </div>
          </div>
        } 
      />

      {/* ===== ADMIN ROUTES ===== */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/admin/users" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminUsersPage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/admin/jobs" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminJobsPage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/admin/applications" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminApplicationsPage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Navigate to="/admin/dashboard" />
          </ProtectedRoute>
        } 
      />

      {/* ===== PUBLIC ROUTES ===== */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="jobs" element={<JobListingsPage />} />
        <Route path="jobs/:id" element={<JobDetailPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* ===== SEEKER ROUTES ===== */}
      <Route path="/seeker" element={
        <ProtectedRoute allowedRoles={['seeker']}>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<SeekerDashboard />} />
        <Route path="apply/:jobId" element={<ApplyPage />} />
      </Route>

      {/* ===== RECRUITER ROUTES ===== */}
      <Route path="/recruiter" element={
        <ProtectedRoute allowedRoles={['recruiter']}>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<RecruiterDashboard />} />
        <Route path="post-job" element={<PostJobPage />} />
        <Route path="edit-job/:id" element={<EditJobPage />} />
        <Route path="applicants/:jobId" element={<ViewApplicantsPage />} />
      </Route>

      {/* ===== SHARED ROUTES ===== */}
      <Route path="/profile" element={
        <ProtectedRoute allowedRoles={['seeker', 'recruiter', 'admin']}>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<ProfilePage />} />
      </Route>

      <Route path="/settings" element={
        <ProtectedRoute allowedRoles={['seeker', 'recruiter', 'admin']}>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<SettingsPage />} />
      </Route>

      {/* ===== 404 ===== */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

console.log('✅ AppRouter exported!');
export default AppRouter;