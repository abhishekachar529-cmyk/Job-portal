// frontend/src/pages/AdminJobsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FiBriefcase, FiSearch, FiTrash2, FiEye, 
  FiArrowLeft, FiRefreshCw, FiMapPin, FiPlus,
  FiEdit2, FiUsers, FiClock, FiDollarSign
} from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminJobsPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Please login again');
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_URL}/admin/jobs`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setJobs(response.data.jobs || response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!selectedJob) return;

      await axios.delete(
        `${API_URL}/admin/jobs/${selectedJob._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Job deleted successfully');
      setShowDeleteModal(false);
      setSelectedJob(null);
      fetchJobs();
    } catch (error) {
      toast.error('Failed to delete job');
    }
  };

  const handlePostJob = () => {
    navigate('/recruiter/post-job');
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job =>
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const styles = {
      'Active': 'bg-green-100 text-green-700',
      'Closed': 'bg-red-100 text-red-700',
      'Draft': 'bg-yellow-100 text-yellow-700',
      'Pending': 'bg-blue-100 text-blue-700'
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Active': '🟢',
      'Closed': '🔴',
      'Draft': '🟡',
      'Pending': '🟠'
    };
    return icons[status] || '⚪';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-700 text-white py-6 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <button 
              onClick={() => navigate('/admin/dashboard')} 
              className="flex items-center text-white/80 hover:text-white mb-2 transition"
            >
              <FiArrowLeft className="mr-2" /> Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold">💼 Manage Jobs</h1>
            <p className="text-green-100 mt-1">Total: {jobs.length} jobs on the platform</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handlePostJob}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
            >
              <FiPlus /> Post New Job
            </button>
            <button
              onClick={fetchJobs}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
            >
              <FiRefreshCw /> Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-teal-500">
            <p className="text-sm text-gray-500">Total Jobs</p>
            <p className="text-2xl font-bold text-gray-800">{jobs.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-2xl font-bold text-green-600">
              {jobs.filter(j => j.status === 'Active').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-yellow-500">
            <p className="text-sm text-gray-500">Draft</p>
            <p className="text-2xl font-bold text-yellow-600">
              {jobs.filter(j => j.status === 'Draft').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-red-500">
            <p className="text-sm text-gray-500">Closed</p>
            <p className="text-2xl font-bold text-red-600">
              {jobs.filter(j => j.status === 'Closed').length}
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
                  placeholder="Search by title or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <FiBriefcase className="mx-auto text-5xl text-gray-300 mb-3" />
              <p className="text-gray-500">No jobs found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredJobs.map((job) => (
                    <tr key={job._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{job.title}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <FiUsers className="inline" size={12} />
                          {job.applicantsCount || 0} applicants
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{job.company}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <FiMapPin className="inline mr-1 text-gray-400" /> {job.location || 'Remote'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <FiDollarSign className="inline mr-1 text-gray-400" />
                        ${job.salaryMin}k - ${job.salaryMax}k
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(job.status)}`}>
                          {getStatusIcon(job.status)} {job.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link
                            to={`/jobs/${job._id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="View Job"
                          >
                            <FiEye size={18} />
                          </Link>
                          <Link
                            to={`/recruiter/edit-job/${job._id}`}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
                            title="Edit Job"
                          >
                            <FiEdit2 size={18} />
                          </Link>
                          <button
                            onClick={() => {
                              setSelectedJob(job);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete Job"
                          >
                            <FiTrash2 size={18} />
                          </button>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Confirm Delete</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete <strong>{selectedJob.title}</strong> at <strong>{selectedJob.company}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedJob(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteJob}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobsPage;