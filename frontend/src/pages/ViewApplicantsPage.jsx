// frontend/src/pages/ViewApplicantsPage.jsx
// ✅ COMPLETE - Working Resume Download

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  FiDownload, FiEye, FiCheckCircle, FiXCircle, FiArrowLeft, 
  FiUserCheck, FiFile, FiX, FiFileText, FiMail, FiPhone,
  FiUsers, FiClock, FiSearch, FiFilter, FiRefreshCw
} from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ===== Resume Modal Component - WITH WORKING DOWNLOAD =====
const ResumeModal = ({ applicant, onClose, onUpdateStatus }) => {
  if (!applicant) return null;

  // ✅ FIXED: Get resume URL without /api
  const getResumeUrl = () => {
    const resumePath = applicant.resume || applicant.resumeUrl || '';
    if (!resumePath) return null;
    
    // Clean up the path
    let cleanPath = resumePath.replace(/\\/g, '/');
    
    // Extract just the filename
    const fileName = cleanPath.split('/').pop();
    if (!fileName) return null;
    
    // ✅ Use base URL without /api - Your backend serves from /uploads
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return `${baseUrl}/uploads/resumes/${fileName}`;
  };

  const resumeUrl = getResumeUrl();

  const handleDownload = () => {
    if (!resumeUrl) {
      toast.error('No resume file found');
      return;
    }

    console.log('📥 Downloading resume from:', resumeUrl);
    window.open(resumeUrl, '_blank');
    toast.success('Downloading resume...');
  };

  const getApplicantName = () => {
    return applicant.fullName || 
           applicant.name || 
           applicant.applicant?.name || 
           applicant.userName || 
           'Unknown';
  };

  const getApplicantEmail = () => {
    return applicant.email || 
           applicant.applicant?.email || 
           applicant.userEmail || 
           'Not provided';
  };

  const getApplicantPhone = () => {
    return applicant.phoneNumber || 
           applicant.phone || 
           applicant.applicant?.phone || 
           'Not provided';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto transform transition-all">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Applicant Resume</h2>
              <p className="text-gray-500 text-sm">{applicant.jobTitle || applicant.job?.title || 'Job Application'}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <FiX size={24} />
            </button>
          </div>
          
          <div className="p-6">
            {/* Applicant Information */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {getApplicantName().charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">{getApplicantName()}</h3>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiMail className="text-blue-500" />
                      <span className="text-sm">{getApplicantEmail()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiPhone className="text-blue-500" />
                      <span className="text-sm">{getApplicantPhone()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Resume Information */}
            <div className="border rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-5 py-3 border-b">
                <h3 className="font-semibold text-gray-800">Resume / CV</h3>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <FiFileText className="text-red-600 text-2xl" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {applicant.resume || applicant.resumeUrl || 'resume.pdf'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Uploaded on {applicant.appliedDate ? new Date(applicant.appliedDate).toLocaleDateString() : 'N/A'}
                      </p>
                      {resumeUrl && (
                        <p className="text-xs text-blue-600 truncate max-w-[200px] mt-1">
                          📍 {resumeUrl}
                        </p>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={handleDownload}
                    disabled={!resumeUrl}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                      resumeUrl 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <FiDownload size={16} /> Download
                  </button>
                </div>
                
                <div className={`rounded-lg p-8 text-center mt-4 ${resumeUrl ? 'bg-gray-100' : 'bg-gray-50'}`}>
                  <FiFile className="mx-auto text-5xl text-gray-400 mb-3" />
                  <p className="text-gray-500 mb-1">
                    {resumeUrl ? 'Resume file is ready for download' : 'No resume file uploaded'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {resumeUrl ? 'Click the Download button to view the complete resume' : 'The applicant did not upload a resume'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Cover Letter */}
            {applicant.coverLetter && (
              <div className="mt-6 border rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-5 py-3 border-b">
                  <h3 className="font-semibold text-gray-800">Cover Letter</h3>
                </div>
                <div className="p-5">
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{applicant.coverLetter}</p>
                </div>
              </div>
            )}
            
            {/* Application Status */}
            <div className="mt-6 bg-yellow-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-700">Current Status</p>
                  <p className="font-semibold text-yellow-800">{applicant.status || 'Pending'}</p>
                </div>
                <div className="flex gap-2">
                  {applicant.status === 'Pending' && (
                    <>
                      <button 
                        onClick={() => onUpdateStatus(applicant._id, 'Shortlisted')}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                      >
                        Shortlist
                      </button>
                      <button 
                        onClick={() => onUpdateStatus(applicant._id, 'Rejected')}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {applicant.status === 'Shortlisted' && (
                    <button 
                      onClick={() => onUpdateStatus(applicant._id, 'Accepted')}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                    >
                      Accept
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Modal Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end">
            <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== MAIN COMPONENT =====
const ViewApplicantsPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    shortlisted: 0,
    accepted: 0,
    rejected: 0
  });

  // ✅ Fetch applicants
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          toast.error('Please login again');
          navigate('/login');
          return;
        }

        console.log('📤 Fetching applicants for job:', jobId);

        // ✅ Fetch job details
        try {
          const jobResponse = await axios.get(`${API_URL}/jobs/${jobId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (jobResponse.data.success) {
            setJob(jobResponse.data.job || jobResponse.data.data);
          }
        } catch (jobError) {
          console.log('⚠️ Job fetch error:', jobError);
        }

        // ✅ Fetch applications
        const response = await axios.get(
          `${API_URL}/applications/job/${jobId}/applications`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        console.log('📥 Applications Response:', response.data);
        
        let apps = [];
        if (response.data.success) {
          apps = response.data.applications || response.data.data || [];
        }
        
        console.log(`✅ Total applicants found: ${apps.length}`);
        setApplicants(apps);
        setFilteredApplicants(apps);

        // ✅ Calculate stats
        const statsData = {
          total: apps.length,
          pending: apps.filter(a => a.status === 'Pending' || !a.status).length,
          shortlisted: apps.filter(a => a.status === 'Shortlisted').length,
          accepted: apps.filter(a => a.status === 'Accepted').length,
          rejected: apps.filter(a => a.status === 'Rejected').length
        };
        setStats(statsData);

      } catch (error) {
        console.error('❌ Error fetching applicants:', error);
        toast.error('Failed to load applicants');
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchData();
    }
  }, [jobId, navigate]);

  // ✅ Filter applicants
  useEffect(() => {
    let filtered = [...applicants];
    
    if (filter !== 'all') {
      filtered = filtered.filter(app => app.status === filter);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(app => {
        const name = app.fullName || app.name || app.applicant?.name || app.userName || '';
        const email = app.email || app.applicant?.email || app.userEmail || '';
        return name.toLowerCase().includes(term) || email.toLowerCase().includes(term);
      });
    }
    
    setFilteredApplicants(filtered);
  }, [applicants, filter, searchTerm]);

  // ✅ Update application status
  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.patch(
        `${API_URL}/applications/${applicationId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(`Application ${newStatus} successfully!`);
        
        const updatedApplicants = applicants.map(app => 
          app._id === applicationId ? { ...app, status: newStatus } : app
        );
        setApplicants(updatedApplicants);
        
        const oldStatus = applicants.find(a => a._id === applicationId)?.status;
        const newStats = { ...stats };
        
        if (oldStatus) {
          const oldKey = oldStatus.toLowerCase();
          newStats[oldKey] = Math.max(0, newStats[oldKey] - 1);
        }
        const newKey = newStatus.toLowerCase();
        newStats[newKey] = (newStats[newKey] || 0) + 1;
        setStats(newStats);
        
        if (showResumeModal) {
          setShowResumeModal(false);
          setSelectedApplicant(null);
        }
      }
    } catch (error) {
      console.error('❌ Error updating status:', error);
      toast.error('Failed to update application status');
    }
  };

  const handleViewResume = (applicant) => {
    setSelectedApplicant(applicant);
    setShowResumeModal(true);
  };

  const handleRefresh = () => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please login again');
          navigate('/login');
          return;
        }

        const response = await axios.get(
          `${API_URL}/applications/job/${jobId}/applications`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          const apps = response.data.applications || response.data.data || [];
          setApplicants(apps);
          setFilteredApplicants(apps);
          
          const statsData = {
            total: apps.length,
            pending: apps.filter(a => a.status === 'Pending' || !a.status).length,
            shortlisted: apps.filter(a => a.status === 'Shortlisted').length,
            accepted: apps.filter(a => a.status === 'Accepted').length,
            rejected: apps.filter(a => a.status === 'Rejected').length
          };
          setStats(statsData);
          toast.success('Data refreshed!');
        }
      } catch (error) {
        console.error('Refresh error:', error);
        toast.error('Failed to refresh');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Pending': 'bg-yellow-100 text-yellow-700',
      'Shortlisted': 'bg-green-100 text-green-700',
      'Accepted': 'bg-blue-100 text-blue-700',
      'Rejected': 'bg-red-100 text-red-700',
      'Withdrawn': 'bg-gray-100 text-gray-700'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.Pending}`}>
        {status || 'Pending'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applicants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate('/recruiter/dashboard')} 
          className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition"
        >
          <FiArrowLeft className="mr-2" /> Back to Dashboard
        </button>
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Applicants for {job?.title || 'Job'}
            </h1>
            <p className="text-gray-500 mt-1">Review and manage applications for this position</p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <FiRefreshCw /> Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 text-center cursor-pointer hover:bg-blue-100 transition" onClick={() => setFilter('all')}>
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center cursor-pointer hover:bg-yellow-100 transition" onClick={() => setFilter('Pending')}>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center cursor-pointer hover:bg-green-100 transition" onClick={() => setFilter('Shortlisted')}>
            <div className="text-2xl font-bold text-green-600">{stats.shortlisted}</div>
            <div className="text-sm text-gray-600">Shortlisted</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center cursor-pointer hover:bg-blue-100 transition" onClick={() => setFilter('Accepted')}>
            <div className="text-2xl font-bold text-blue-600">{stats.accepted}</div>
            <div className="text-sm text-gray-600">Accepted</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 text-center cursor-pointer hover:bg-red-100 transition" onClick={() => setFilter('Rejected')}>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search applicants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button 
                onClick={() => setFilter('all')} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter('Pending')} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === 'Pending' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
              <button 
                onClick={() => setFilter('Shortlisted')} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === 'Shortlisted' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Shortlisted
              </button>
              <button 
                onClick={() => setFilter('Accepted')} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === 'Accepted' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Accepted
              </button>
              <button 
                onClick={() => setFilter('Rejected')} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === 'Rejected' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Rejected
              </button>
            </div>
          </div>
        </div>

        {/* Applicants Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {filteredApplicants.length === 0 ? (
            <div className="text-center py-12">
              <FiUsers className="mx-auto text-5xl text-gray-300 mb-3" />
              <p className="text-gray-500">No applicants found for this filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resume</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredApplicants.map((applicant) => (
                    <tr key={applicant._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {applicant.fullName || applicant.name || applicant.applicant?.name || applicant.userName || 'Unknown'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {applicant.phoneNumber || applicant.phone || applicant.applicant?.phone || 'No phone'}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {applicant.email || applicant.applicant?.email || applicant.userEmail}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {applicant.appliedDate ? new Date(applicant.appliedDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => handleViewResume(applicant)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                        >
                          <FiEye /> View Resume
                        </button>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(applicant.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {applicant.status === 'Pending' && (
                            <>
                              <button 
                                onClick={() => updateApplicationStatus(applicant._id, 'Shortlisted')} 
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition" 
                                title="Shortlist"
                              >
                                <FiCheckCircle />
                              </button>
                              <button 
                                onClick={() => updateApplicationStatus(applicant._id, 'Rejected')} 
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" 
                                title="Reject"
                              >
                                <FiXCircle />
                              </button>
                            </>
                          )}
                          {applicant.status === 'Shortlisted' && (
                            <button 
                              onClick={() => updateApplicationStatus(applicant._id, 'Accepted')} 
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" 
                              title="Accept"
                            >
                              <FiUserCheck />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Resume Modal */}
      {showResumeModal && selectedApplicant && (
        <ResumeModal 
          applicant={selectedApplicant}
          onClose={() => {
            setShowResumeModal(false);
            setSelectedApplicant(null);
          }}
          onUpdateStatus={updateApplicationStatus}
        />
      )}
    </div>
  );
};

export default ViewApplicantsPage;