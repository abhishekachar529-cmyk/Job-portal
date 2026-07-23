// frontend/src/pages/JobDetailPage.jsx
// ✅ UPDATED - With Login Check on Apply Button

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiMapPin, FiDollarSign, FiBriefcase, FiClock, 
  FiArrowLeft, FiCheckCircle, FiUsers, FiX,
  FiHeart, FiShare2, FiMail, FiAward, FiCode,
  FiAlertTriangle, FiLock
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [applicantCount, setApplicantCount] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const loadJob = async () => {
      setLoading(true);
      
      try {
        console.log(`🔍 Fetching job from MongoDB with ID: ${id}`);

        // ✅ Check if it's a valid MongoDB ObjectId (24 character hex)
        const isValidMongoId = /^[0-9a-fA-F]{24}$/.test(id);
        
        if (!isValidMongoId) {
          console.log('❌ Invalid MongoDB ID format:', id);
          toast.error('Invalid job ID format');
          navigate('/jobs');
          return;
        }

        // ✅ Fetch from MongoDB API
        const response = await axios.get(`${API_URL}/jobs/${id}`);
        console.log('📥 API Response:', response.data);
        
        // ✅ FIXED: Use response.data.job (not response.data.data)
        if (response.data.success && response.data.job) {
          const jobData = response.data.job;
          setJob(jobData);
          setApplicantCount(jobData.applicantsCount || 0);
          console.log('✅ Job loaded from MongoDB:', jobData.title);
          console.log('   Category:', jobData.category);
          console.log('   _id:', jobData._id);
        } else {
          console.log('❌ Job not found in MongoDB');
          toast.error('Job not found');
          navigate('/jobs');
        }
        
      } catch (error) {
        console.error('❌ Error loading job:', error);
        
        if (error.response?.status === 404) {
          toast.error('Job not found in database');
        } else if (error.response?.status === 400) {
          toast.error('Invalid job ID format');
        } else {
          toast.error('Failed to load job details');
        }
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadJob();
    } else {
      toast.error('No job ID provided');
      navigate('/jobs');
    }
  }, [id, navigate]);

  // ✅ Handle Apply - With Login Check
  const handleApply = () => {
    console.log('📝 Apply clicked for job:', job?.title, 'ID:', id);
    
    // ✅ Check if user is logged in
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    // ❌ NOT LOGGED IN - Show login modal
    if (!user || !token) {
      console.log('❌ User not logged in - Showing login prompt');
      setShowLoginModal(true);
      return;
    }
    
    try {
      const userData = JSON.parse(user);
      console.log('👤 Logged in user:', userData.email, 'Role:', userData.role);
      
      // ✅ Use the MongoDB _id from the job
      const applyId = job._id;
      console.log(`📝 Applying with MongoDB ID: ${applyId}`);
      
      // ✅ Check role - Only seekers can apply
      if (userData.role === 'seeker') {
        navigate(`/seeker/apply/${applyId}`);
      } else if (userData.role === 'admin') {
        toast.error('⛔ Admins cannot apply for jobs. Please login as a job seeker.');
      } else if (userData.role === 'recruiter') {
        toast.error('⛔ Recruiters cannot apply for jobs. Please login as a job seeker.');
      } else {
        toast.error('Invalid user role');
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      toast.error('Please login again');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  // ✅ Handle login redirect from modal
  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    sessionStorage.setItem('redirectAfterLogin', `/jobs/${id}`);
    sessionStorage.setItem('applyAfterLogin', id);
    navigate('/login', { 
      state: { 
        from: `/jobs/${id}`,
        message: 'Please login to apply for this job'
      } 
    });
  };

  // ===== Handle Share =====
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this job: ${job.title} at ${job.company}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  // ===== Handle Save Job =====
  const handleSaveJob = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      toast.error('Please login to save jobs');
      navigate('/login');
      return;
    }

    const jobId = job._id;
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    
    let newSavedJobs;
    if (savedJobs.includes(jobId)) {
      newSavedJobs = savedJobs.filter(id => id !== jobId);
      toast.success('Job removed from saved');
    } else {
      newSavedJobs = [...savedJobs, jobId];
      toast.success('Job saved successfully!');
    }
    
    localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
    setIsSaved(!isSaved);
  };

  // ===== Loading State =====
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // ===== Job Not Found =====
  if (!job) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen flex items-center justify-center bg-gray-50"
      >
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Job Not Found</h2>
          <p className="text-gray-500 mb-6">
            The job you're looking for doesn't exist in the database.
          </p>
          <Link to="/jobs">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
              ← Back to Jobs
            </button>
          </Link>
        </div>
      </motion.div>
    );
  }

  // ===== Main Render =====
  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-50 min-h-screen py-8"
      >
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Back Button */}
          <button 
            onClick={() => navigate('/jobs')} 
            className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition"
          >
            <FiArrowLeft className="mr-2" /> Back to Jobs
          </button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Card */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center text-2xl font-bold text-blue-600 mr-4">
                      {job.company?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">{job.title}</h1>
                      <p className="text-lg text-blue-600">{job.company}</p>
                      {job.category && (
                        <span className="inline-block mt-1 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                          {job.category}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleShare}
                      className="p-3 bg-gray-100 text-gray-400 rounded-full hover:bg-gray-200 transition"
                    >
                      <FiShare2 size={20} />
                    </button>
                    <button
                      onClick={handleSaveJob}
                      className={`p-3 rounded-full transition-all ${
                        isSaved 
                          ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      <FiHeart className={isSaved ? 'fill-current' : ''} size={20} />
                    </button>
                  </div>
                </div>

                {/* Job Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b">
                  <div className="flex items-center text-gray-600">
                    <FiMapPin className="mr-2 text-blue-500" /> {job.location || 'Not specified'}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiDollarSign className="mr-2 text-green-500" /> 
                    ${job.salaryMin}k - ${job.salaryMax}k
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiBriefcase className="mr-2 text-orange-500" /> {job.jobType || 'Not specified'}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiClock className="mr-2 text-purple-500" /> 
                    Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}
                  </div>
                </div>

                {/* Job Description */}
                {job.description && (
                  <div className="py-6 border-b">
                    <h2 className="text-xl font-bold mb-4">Job Description</h2>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
                  </div>
                )}

                {/* Requirements */}
                {job.requirements && job.requirements.length > 0 && (
                  <div className="py-6 border-b">
                    <h2 className="text-xl font-bold mb-4">Requirements</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      {job.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Responsibilities */}
                {job.responsibilities && job.responsibilities.length > 0 && (
                  <div className="py-6 border-b">
                    <h2 className="text-xl font-bold mb-4">Responsibilities</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      {job.responsibilities.map((resp, idx) => (
                        <li key={idx}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Required Skills */}
                {job.skills && job.skills.length > 0 && (
                  <div className="py-6">
                    <h2 className="text-xl font-bold mb-4">Required Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, idx) => (
                        <motion.span 
                          key={idx}
                          whileHover={{ scale: 1.05 }}
                          className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div>
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
              >
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold">Ready to apply?</h3>
                  <p className="text-gray-500 text-sm mt-1 flex items-center justify-center gap-1">
                    <FiUsers className="text-blue-500" /> 
                    {applicantCount || 0}+ applicants already applied
                  </p>
                </div>

                {/* ✅ Apply Now Button - With Login Check */}
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleApply} 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition shadow-md flex items-center justify-center gap-2"
                >
                  Apply Now
                </motion.button>

                <div className="mt-6 pt-6 border-t space-y-2">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <FiCode className="text-gray-400" /> Job ID
                    </span>
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded truncate max-w-[120px]">
                      {job._id?.substring(0, 12)}...
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <FiAward className="text-gray-400" /> Experience
                    </span>
                    <span>{job.experienceLevel || 'Not specified'}</span>
                  </div>
                  {job.applicationDeadline && (
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FiClock className="text-gray-400" /> Deadline
                      </span>
                      <span className="text-red-500">{new Date(job.applicationDeadline).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ✅ LOGIN MODAL - Shows when user clicks Apply without login */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiLock className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Required</h2>
              <p className="text-gray-600 mb-4">
                Please login to apply for <strong>{job?.title}</strong> at <strong>{job?.company}</strong>
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleLoginRedirect}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold"
                >
                  Login Now
                </button>
                <button
                  onClick={() => {
                    setShowLoginModal(false);
                  }}
                  className="w-full border border-gray-300 text-gray-600 py-3 rounded-xl hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <p className="text-sm text-gray-400 mt-2">
                  Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register here</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS for animation */}
      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default JobDetailPage;