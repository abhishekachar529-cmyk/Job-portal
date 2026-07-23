// frontend/src/pages/AdminApplicationsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiFileText, FiSearch, FiArrowLeft, FiRefreshCw,
  FiCheckCircle, FiXCircle, FiClock, FiUser,
  FiBriefcase, FiMail, FiCalendar
} from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminApplicationsPage = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Please login again');
        navigate('/login');
        return;
      }

      console.log('📡 Fetching applications from API...');
      
      const response = await axios.get(`${API_URL}/admin/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('📥 Applications Response:', response.data);

      // ✅ Handle different response formats
      let apps = [];
      if (response.data.success) {
        // If the response has data array directly
        if (Array.isArray(response.data.data)) {
          apps = response.data.data;
        } 
        // If the response has applications in data
        else if (response.data.data && Array.isArray(response.data.data.applications)) {
          apps = response.data.data.applications;
        }
        // If the response has applications directly
        else if (Array.isArray(response.data.applications)) {
          apps = response.data.applications;
        }
        // If the response has data as an object with applications
        else if (response.data.applications && Array.isArray(response.data.applications.data)) {
          apps = response.data.applications.data;
        }
      }

      console.log('✅ Applications found:', apps.length);
      setApplications(apps);
      
      if (apps.length === 0) {
        console.log('⚠️ No applications found. Trying fallback...');
        // ✅ Fallback: Try to get applications from localStorage
        try {
          const localApps = JSON.parse(localStorage.getItem('applications') || '[]');
          if (localApps.length > 0) {
            console.log('📦 Found applications in localStorage:', localApps.length);
            setApplications(localApps);
          }
        } catch (e) {
          console.log('No applications in localStorage');
        }
      }
    } catch (error) {
      console.error('❌ Error fetching applications:', error);
      console.error('❌ Error details:', error.response?.data);
      toast.error('Failed to load applications');
      
      // ✅ Fallback: Load from localStorage
      try {
        const localApps = JSON.parse(localStorage.getItem('applications') || '[]');
        if (localApps.length > 0) {
          console.log('📦 Fallback: Loaded from localStorage:', localApps.length);
          setApplications(localApps);
        }
      } catch (e) {
        console.log('No applications in localStorage');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem('token');

      console.log('📤 Updating application status:', { applicationId, newStatus });

      const response = await axios.patch(
        `${API_URL}/admin/applications/${applicationId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(`Application ${newStatus}`);
        fetchApplications();
      }
    } catch (error) {
      console.error('❌ Error updating application:', error);
      toast.error('Failed to update application status');
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.userEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const styles = {
      'Pending': 'bg-yellow-100 text-yellow-700',
      'Shortlisted': 'bg-blue-100 text-blue-700',
      'Accepted': 'bg-green-100 text-green-700',
      'Rejected': 'bg-red-100 text-red-700'
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Pending': <FiClock className="inline mr-1" />,
      'Shortlisted': <FiCheckCircle className="inline mr-1 text-blue-500" />,
      'Accepted': <FiCheckCircle className="inline mr-1 text-green-500" />,
      'Rejected': <FiXCircle className="inline mr-1 text-red-500" />
    };
    return icons[status] || <FiClock className="inline mr-1" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-6 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <button 
              onClick={() => navigate('/admin/dashboard')} 
              className="flex items-center text-white/80 hover:text-white mb-2 transition"
            >
              <FiArrowLeft className="mr-2" /> Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold">📄 Manage Applications</h1>
            <p className="text-purple-100 mt-1">Total: {applications.length} applications on the platform</p>
          </div>
          <button
            onClick={fetchApplications}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
          >
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-purple-500">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold text-gray-800">{applications.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-yellow-500">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {applications.filter(a => a.status === 'Pending').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
            <p className="text-sm text-gray-500">Shortlisted</p>
            <p className="text-2xl font-bold text-blue-600">
              {applications.filter(a => a.status === 'Shortlisted').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
            <p className="text-sm text-gray-500">Accepted</p>
            <p className="text-2xl font-bold text-green-600">
              {applications.filter(a => a.status === 'Accepted').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by job, company, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="Pending">⏳ Pending</option>
              <option value="Shortlisted">⭐ Shortlisted</option>
              <option value="Accepted">✅ Accepted</option>
              <option value="Rejected">❌ Rejected</option>
            </select>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <FiFileText className="mx-auto text-5xl text-gray-300 mb-3" />
              <p className="text-gray-500">No applications found</p>
              <p className="text-sm text-gray-400 mt-2">Try applying to a job first to see applications here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredApplications.map((app) => (
                    <tr key={app._id || app.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium text-gray-900">{app.jobTitle}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{app.company}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FiUser className="text-gray-400" size={14} />
                          <span className="text-sm text-gray-600">{app.email || app.userEmail}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(app.status)}`}>
                          {getStatusIcon(app.status)} {app.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <FiCalendar className="text-gray-400" size={14} />
                          {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : 
                           app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={app.status || 'Pending'}
                          onChange={(e) => handleUpdateStatus(app._id || app.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="Pending">⏳ Pending</option>
                          <option value="Shortlisted">⭐ Shortlisted</option>
                          <option value="Accepted">✅ Accepted</option>
                          <option value="Rejected">❌ Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminApplicationsPage;