// frontend/src/pages/SeekerDashboard.jsx
// ✅ UPDATED - WITH APPLICATION DETAIL MODAL

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  FiFileText, FiBookmark, FiCheckCircle, FiClock, 
  FiXCircle, FiUser, FiTrendingUp, FiArrowRight,
  FiBriefcase, FiSave, FiAward, FiEye, FiTrash2,
  FiCalendar, FiMapPin, FiMail, FiPhone, FiDollarSign,
  FiX
} from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SeekerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [stats, setStats] = useState({
    appliedJobs: 0,
    savedJobs: 0,
    shortlisted: 0,
    accepted: 0
  });

  // ✅ Fetch applications from MongoDB API
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.log('No token found');
          setLoading(false);
          return;
        }

        console.log('📤 Fetching applications from MongoDB...');
        
        const response = await axios.get(`${API_URL}/applications/my-applications`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('📥 Response:', response.data);

        if (response.data.success) {
          const apps = response.data.data || [];
          console.log(`✅ Loaded ${apps.length} applications`);
          
          // ✅ Log each application to see what data we have
          apps.forEach((app, index) => {
            console.log(`  ${index + 1}. Job: ${app.jobTitle || app.job?.title}, Job ID: ${app.job?._id || app.jobId}`);
          });
          
          setApplications(apps);
          
          // ✅ Calculate stats
          const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
          setSavedJobs(saved);
          
          setStats({
            appliedJobs: apps.length,
            savedJobs: saved.length,
            shortlisted: apps.filter(app => app.status === 'Shortlisted').length,
            accepted: apps.filter(app => app.status === 'Accepted').length
          });
        } else {
          console.log('❌ No applications found');
        }
      } catch (error) {
        console.error('❌ Error fetching applications:', error);
        
        if (error.response?.status === 401) {
          toast.error('Please login again');
          navigate('/login');
        } else {
          toast.error('Failed to load applications');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [navigate]);

  // ✅ Handle View Application Details - Opens Modal
  const handleViewApplication = (application) => {
    console.log('👁️ Viewing application details:', application);
    setSelectedApplication(application);
    setShowDetailModal(true);
  };

  // ✅ Handle View Job (from modal)
  const handleViewJob = (jobId) => {
    console.log('📤 Viewing job with ID:', jobId);
    
    if (!jobId) {
      toast.error('Job ID not found. Please try again.');
      return;
    }
    
    // Close modal and navigate to job details
    setShowDetailModal(false);
    navigate(`/jobs/${jobId}`);
  };

  // ✅ Handle Withdraw
  const handleWithdraw = async (applicationId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.delete(`${API_URL}/applications/${applicationId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success('Application withdrawn successfully');
        // Refresh applications
        setApplications(applications.filter(app => app._id !== applicationId));
        setStats(prev => ({
          ...prev,
          appliedJobs: prev.appliedJobs - 1
        }));
        setShowDetailModal(false);
      }
    } catch (error) {
      console.error('❌ Error withdrawing application:', error);
      toast.error('Failed to withdraw application');
    }
  };

  // ✅ Get status badge
  const getStatusBadge = (status) => {
    const styles = {
      'Pending': 'bg-yellow-100 text-yellow-700',
      'Shortlisted': 'bg-blue-100 text-blue-700',
      'Accepted': 'bg-green-100 text-green-700',
      'Rejected': 'bg-red-100 text-red-700',
      'Withdrawn': 'bg-gray-100 text-gray-700'
    };
    const icons = {
      'Pending': <FiClock className="inline mr-1" />,
      'Shortlisted': <FiCheckCircle className="inline mr-1" />,
      'Accepted': <FiCheckCircle className="inline mr-1" />,
      'Rejected': <FiXCircle className="inline mr-1" />,
      'Withdrawn': <FiXCircle className="inline mr-1" />
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
        {icons[status]} {status || 'Pending'}
      </span>
    );
  };

  // ✅ Get status message
  const getStatusMessage = (status) => {
    const messages = {
      'Pending': '⏳ Your application is being reviewed by the employer.',
      'Shortlisted': '⭐ Congratulations! You have been shortlisted for this position.',
      'Accepted': '🎉 Great news! Your application has been accepted.',
      'Rejected': '😞 Unfortunately, the employer has moved on with other candidates.',
      'Withdrawn': '📤 You have withdrawn this application.'
    };
    return messages[status] || 'Status update pending.';
  };

  // ✅ Stats cards
  const statsCards = [
    { 
      icon: <FiFileText className="text-3xl text-blue-600" />, 
      value: stats.appliedJobs, 
      label: 'Applied Jobs', 
      color: 'bg-blue-50' 
    },
    { 
      icon: <FiBookmark className="text-3xl text-green-600" />, 
      value: stats.savedJobs, 
      label: 'Saved Jobs', 
      color: 'bg-green-50' 
    },
    { 
      icon: <FiCheckCircle className="text-3xl text-purple-600" />, 
      value: stats.shortlisted, 
      label: 'Shortlisted', 
      color: 'bg-purple-50' 
    },
    { 
      icon: <FiTrendingUp className="text-3xl text-orange-600" />, 
      value: stats.accepted, 
      label: 'Accepted', 
      color: 'bg-orange-50' 
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">My Dashboard</h1>
                <p className="text-blue-100 mt-1">Welcome back, {user?.name || 'Job Seeker'}!</p>
              </div>
              <Link to="/profile" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center gap-2">
                <FiUser /> Edit Profile
              </Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-4 gap-6 mb-8"
          >
            {statsCards.map((stat, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`${stat.color} rounded-xl p-6 text-center hover:scale-105 transition-transform cursor-pointer`}
                onClick={() => {
                  if (idx === 0) {
                    document.getElementById('applications-table')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <div className="flex justify-center mb-3">{stat.icon}</div>
                <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Recent Applications */}
          <motion.div 
            id="applications-table"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Recent Applications</h2>
              <span className="text-sm text-gray-500">{applications.length} total</span>
            </div>
            
            {applications.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-5xl mb-4">📋</div>
                <p className="text-gray-500">You haven't applied for any jobs yet.</p>
                <Link to="/jobs" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                  Browse Jobs
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {applications.map((app) => {
                      // ✅ Get the correct job ID
                      const jobId = app.job?._id || app.jobId;
                      
                      return (
                        <tr key={app._id || app.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">
                              {app.jobTitle || app.job?.title || 'Unknown Job'}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {app.company || app.job?.company || 'Unknown Company'}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            <div className="flex items-center gap-1">
                              <FiCalendar className="text-gray-400" />
                              {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(app.status || 'Pending')}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {/* ✅ View Button - Opens Detail Modal */}
                              <button 
                                onClick={() => handleViewApplication(app)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 transition"
                                title="View Application Details"
                              >
                                <FiEye className="text-sm" /> View
                              </button>
                              
                              {/* ✅ Withdraw Button - Only for pending applications */}
                              {(app.status === 'Pending' || app.status === 'Shortlisted') && (
                                <button 
                                  onClick={() => handleWithdraw(app._id)} 
                                  className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 transition"
                                  title="Withdraw Application"
                                >
                                  <FiTrash2 className="text-sm" /> Withdraw
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>

          {/* Profile Completion */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Profile Completion</h2>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <span className="text-lg font-semibold text-gray-800">60%</span>
            </div>
            <p className="text-gray-500 mt-2">Complete your profile to get better job matches</p>
            <Link to="/profile" className="mt-4 inline-block text-blue-600 font-semibold hover:text-blue-800 transition flex items-center gap-1">
              Complete Profile <FiArrowRight className="text-sm" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ✅ Application Detail Modal */}
      {showDetailModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-800">Application Details</h2>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedApplication(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <FiX className="text-2xl text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Job Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  {selectedApplication.jobTitle || selectedApplication.job?.title || 'Unknown Job'}
                </h3>
                <p className="text-lg text-blue-600">
                  {selectedApplication.company || selectedApplication.job?.company || 'Unknown Company'}
                </p>
                <div className="flex flex-wrap gap-4 mt-3">
                  {selectedApplication.job?.location && (
                    <span className="flex items-center text-gray-600 text-sm">
                      <FiMapPin className="mr-1" /> {selectedApplication.job.location}
                    </span>
                  )}
                  <span className="flex items-center text-gray-600 text-sm">
                    <FiCalendar className="mr-1" /> Applied: {selectedApplication.appliedDate ? new Date(selectedApplication.appliedDate).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Application Status */}
              <div className="border rounded-xl p-4">
                <h4 className="font-semibold text-gray-700 mb-2">Application Status</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedApplication.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                    selectedApplication.status === 'Shortlisted' ? 'bg-blue-100 text-blue-700' :
                    selectedApplication.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                    selectedApplication.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {selectedApplication.status || 'Pending'}
                  </span>
                  <span className="text-sm text-gray-600">
                    {getStatusMessage(selectedApplication.status)}
                  </span>
                </div>
              </div>

              {/* Cover Letter */}
              {selectedApplication.coverLetter && (
                <div className="border rounded-xl p-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Cover Letter</h4>
                  <p className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed">
                    {selectedApplication.coverLetter}
                  </p>
                </div>
              )}

              {/* Contact Information */}
              <div className="border rounded-xl p-4">
                <h4 className="font-semibold text-gray-700 mb-2">Contact Information</h4>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <FiMail className="text-gray-400" />
                    <span className="text-gray-600">{selectedApplication.email || user?.email || 'Not provided'}</span>
                  </div>
                  {selectedApplication.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <FiPhone className="text-gray-400" />
                      <span className="text-gray-600">{selectedApplication.phoneNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    const jobId = selectedApplication.job?._id || selectedApplication.jobId;
                    if (jobId) {
                      handleViewJob(jobId);
                    } else {
                      toast.error('Job ID not found');
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <FiEye /> View Job
                </button>
                {(selectedApplication.status === 'Pending' || selectedApplication.status === 'Shortlisted') && (
                  <button
                    onClick={() => handleWithdraw(selectedApplication._id || selectedApplication.id)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition flex items-center gap-2"
                  >
                    <FiTrash2 /> Withdraw Application
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedApplication(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default SeekerDashboard;