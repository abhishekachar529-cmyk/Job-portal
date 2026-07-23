// frontend/src/pages/RecruiterDashboardPage.jsx
// ✅ UPDATED - WITH WORKING EDIT JOB BUTTON

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { 
  FiBriefcase, FiUsers, FiCheckCircle, FiClock, FiPlus, 
  FiEye, FiEdit2, FiTrash2, FiTrendingUp, FiUserCheck,
  FiCalendar, FiMapPin, FiDollarSign, FiArrowRight
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

const RecruiterDashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [recentApplicants, setRecentApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplicants: 0,
    activeJobs: 0,
    views: 0
  });

  // ✅ Fetch dashboard data from MongoDB
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please login again');
          navigate('/login');
          return;
        }

        console.log('📤 Fetching recruiter jobs...');

        // Get recruiter's jobs from MongoDB
        const jobsRes = await axios.get(
          `${API_URL}/jobs/recruiter/my-jobs`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log('📥 Jobs Response:', jobsRes.data);

        const recruiterJobs = jobsRes.data.jobs || [];

        setJobs(recruiterJobs);

        // Calculate stats
        const totalApplicants = recruiterJobs.reduce(
          (sum, job) => sum + (job.applicantsCount || 0),
          0
        );

        setStats({
          totalJobs: recruiterJobs.length,
          totalApplicants,
          activeJobs: recruiterJobs.filter(
            job => job.status === 'Active'
          ).length,
          views: recruiterJobs.reduce(
            (sum, job) => sum + (job.views || 0),
            0
          )
        });

        // Get recent applicants from API
        try {
          const appsRes = await axios.get(
            `${API_URL}/applications/my-applications`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          
          if (appsRes.data.success) {
            const applications = appsRes.data.data || [];
            // Filter applications for recruiter's jobs
            const jobIds = recruiterJobs.map(job => job._id);
            const relatedApplicants = applications
              .filter(app => jobIds.includes(app.job?._id) || jobIds.includes(app.jobId))
              .slice(0, 5);
            setRecentApplicants(relatedApplicants);
          }
        } catch (appError) {
          console.log('⚠️ Could not fetch applicants:', appError);
        }

      } catch (error) {
        console.error('❌ Error fetching dashboard:', error);
        
        if (error.response?.status === 401) {
          toast.error('Please login again');
          navigate('/login');
        } else {
          toast.error('Failed to load dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, navigate]);

  // ✅ Delete job from MongoDB
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) return;

    try {
      const token = localStorage.getItem('token');

      await axios.delete(
        `${API_URL}/jobs/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setJobs(prev => prev.filter(job => job._id !== jobId));
      toast.success('✅ Job deleted successfully');
    } catch (error) {
      console.error('❌ Delete error:', error);
      toast.error('Failed to delete job');
    }
  };

  // ✅ Handle Edit Job
  const handleEditJob = (jobId) => {
    navigate(`/recruiter/edit-job/${jobId}`);
  };

  // ✅ Handle View Applicants
  const handleViewApplicants = (jobId) => {
    navigate(`/recruiter/applicants/${jobId}`);
  };

  // ✅ Handle View Job
  const handleViewJob = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const getStatusBadge = (status) => {
    if (status === 'Closed') {
      return 'bg-gray-100 text-gray-700';
    }
    if (status === 'Draft') {
      return 'bg-yellow-100 text-yellow-700';
    }
    return 'bg-green-100 text-green-700';
  };

  const statsCards = [
    { icon: <FiBriefcase className="text-3xl" />, value: stats.totalJobs, label: 'Total Jobs Posted', color: 'bg-blue-50', textColor: 'text-blue-600' },
    { icon: <FiUsers className="text-3xl" />, value: stats.totalApplicants, label: 'Total Applicants', color: 'bg-green-50', textColor: 'text-green-600' },
    { icon: <FiCheckCircle className="text-3xl" />, value: stats.activeJobs, label: 'Active Listings', color: 'bg-purple-50', textColor: 'text-purple-600' },
    { icon: <FiTrendingUp className="text-3xl" />, value: stats.views, label: 'Total Views', color: 'bg-orange-50', textColor: 'text-orange-600' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header - Professional Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
              <p className="text-blue-100 mt-1">
                Welcome back, {user?.name || user?.companyName || 'Recruiter'}!
              </p>
            </div>
            <Link 
              to="/recruiter/post-job" 
              className="bg-white text-blue-600 px-5 py-2.5 rounded-lg font-semibold hover:shadow-lg transition flex items-center gap-2 hover:scale-105"
            >
              <FiPlus /> Post New Job
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, idx) => (
            <div key={idx} className={`${stat.color} rounded-xl p-6 hover:scale-105 transition-transform duration-300 shadow-sm hover:shadow-md border border-gray-100`}>
              <div className="flex items-center justify-between">
                <div className={`${stat.textColor}`}>{stat.icon}</div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Applicants Mini-List */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FiUserCheck className="text-blue-600" /> Recent Applicants
            </h2>
            <Link to="/recruiter/applicants" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
              View All <FiArrowRight className="text-sm" />
            </Link>
          </div>
          
          {recentApplicants.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FiUsers className="mx-auto text-4xl mb-2 text-gray-300" />
              <p>No applicants yet. Post jobs to attract candidates.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentApplicants.map((applicant, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {applicant.fullName || applicant.applicant?.name || 'Applicant'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {applicant.jobTitle || applicant.job?.title || 'Job'} • 
                      Applied {applicant.appliedDate ? new Date(applicant.appliedDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      applicant.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      applicant.status === 'Shortlisted' ? 'bg-green-100 text-green-700' :
                      applicant.status === 'Accepted' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {applicant.status || 'Pending'}
                    </span>
                    <button 
                      onClick={() => handleViewApplicants(applicant.job?._id || applicant.jobId)}
                      className="text-blue-600 hover:text-blue-700"
                      title="View Applicants"
                    >
                      <FiEye />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Posted Jobs Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Posted Jobs</h2>
            <Link 
              to="/recruiter/post-job" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition flex items-center gap-1"
            >
              <FiPlus size={16} /> Post Job
            </Link>
          </div>
          
          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <FiBriefcase className="mx-auto text-5xl text-gray-300 mb-3" />
              <p className="text-gray-500">You haven't posted any jobs yet.</p>
              <Link to="/recruiter/post-job" className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                Post Your First Job
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicants</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {jobs.map((job) => (
                    <tr key={job._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{job.title}</p>
                          <p className="text-sm text-gray-500">{job.company}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <FiMapPin size={14} className="text-gray-400" />
                          {job.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <FiDollarSign size={14} className="text-gray-400" />
                          ${job.salaryMin}k - ${job.salaryMax}k
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <FiUsers size={14} className="text-gray-400" />
                          {job.applicantsCount || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(job.status)}`}>
                          {job.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          {/* ✅ View Job Button */}
                          <button 
                            onClick={() => handleViewJob(job._id)} 
                            className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition"
                            title="View Job"
                          >
                            <FiEye size={18} />
                          </button>
                          
                          {/* ✅ Edit Job Button - Now working */}
                          <button 
                            onClick={() => handleEditJob(job._id)} 
                            className="p-2 text-gray-500 hover:text-green-600 rounded-lg hover:bg-green-50 transition"
                            title="Edit Job"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          
                          {/* ✅ View Applicants Button */}
                          <button 
                            onClick={() => handleViewApplicants(job._id)} 
                            className="p-2 text-gray-500 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition"
                            title="View Applicants"
                          >
                            <FiUsers size={18} />
                          </button>
                          
                          {/* ✅ Delete Job Button */}
                          <button 
                            onClick={() => handleDeleteJob(job._id)} 
                            className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
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
    </div>
  );
};

export default RecruiterDashboardPage;