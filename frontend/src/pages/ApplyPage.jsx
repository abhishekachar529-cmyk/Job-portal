// frontend/src/pages/ApplyPage.jsx
// ✅ FIXED - Uses correct parameter name

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiUpload, FiFile, FiArrowLeft, FiCheckCircle, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ApplyPage = () => {
  // ✅ FIXED: Use jobId (matches route parameter)
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    coverLetter: '',
    resume: null,
    resumeName: ''
  });
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const loadJob = async () => {
      setLoading(true);
      
      try {
        console.log(`🔍 Fetching job from MongoDB: ${jobId}`);

        // ✅ Validate MongoDB ObjectId format
        const isValidMongoId = /^[0-9a-fA-F]{24}$/.test(jobId);
        
        if (!isValidMongoId) {
          toast.error('Invalid job ID format');
          navigate('/jobs');
          return;
        }

        // ✅ Fetch job from MongoDB API
        const response = await axios.get(`${API_URL}/jobs/${jobId}`);
        console.log('📥 API Response:', response.data);
        
        if (response.data.success && response.data.job) {
          const jobData = response.data.job;
          setJob(jobData);
          console.log('✅ Job loaded from MongoDB:', jobData.title);
        } else {
          toast.error('Job not found in database');
          navigate('/jobs');
        }
        
      } catch (error) {
        console.error('❌ Error loading job:', error);
        
        if (error.response?.status === 404) {
          toast.error('Job not found in database');
          navigate('/jobs');
        } else {
          toast.error('Failed to load job details');
        }
      } finally {
        setLoading(false);
      }
    };

    // Set user data if available
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || ''
      }));
    }

    if (jobId) {
      loadJob();
    } else {
      toast.error('No job ID provided');
      navigate('/jobs');
    }
  }, [jobId, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload PDF or DOC/DOCX file only');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      
      setFormData({ 
        ...formData, 
        resume: file,
        resumeName: file.name 
      });
      
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) clearInterval(interval);
      }, 100);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName) { 
      toast.error('Please enter your full name'); 
      return; 
    }
    if (!formData.email) { 
      toast.error('Please enter your email'); 
      return; 
    }
    if (!formData.resume) { 
      toast.error('Please upload your resume'); 
      return; 
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login again');
        navigate('/login');
        return;
      }

      // ✅ Use jobId from URL
      const jobIdentifier = jobId;
      
      const isValidMongoId = /^[0-9a-fA-F]{24}$/.test(jobIdentifier);
      
      if (!isValidMongoId) {
        toast.error('Invalid job ID format');
        setSubmitting(false);
        return;
      }

      console.log('📤 Applying for job:', jobIdentifier);

      const formDataToSend = new FormData();
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phoneNumber', formData.phone || '');
      formDataToSend.append('coverLetter', formData.coverLetter || '');
      formDataToSend.append('resume', formData.resume);

      const response = await axios.post(
        `${API_URL}/applications/${jobIdentifier}/apply`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('📥 Response:', response.data);

      if (response.data.success) {
        toast.success('✅ Application submitted successfully!');
        navigate('/seeker/dashboard');
      } else {
        toast.error(response.data.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('❌ Application error:', error);
      
      if (error.response) {
        if (error.response.status === 401) {
          toast.error('Please login again');
          navigate('/login');
        } else if (error.response.status === 400) {
          toast.error(error.response.data?.message || 'Already applied for this job');
        } else if (error.response.status === 404) {
          toast.error('Job not found in database');
        } else {
          toast.error(error.response.data?.message || 'Failed to submit application');
        }
      } else if (error.request) {
        toast.error('Cannot connect to server. Please make sure backend is running.');
      } else {
        toast.error('Failed to submit application. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

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
          <p className="text-gray-500 mb-4">The job you're looking for doesn't exist in the database.</p>
          <button 
            onClick={() => navigate('/jobs')} 
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            ← Back to Jobs
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 py-12 px-4"
    >
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate(`/jobs/${job._id}`)} 
          className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition"
        >
          <FiArrowLeft className="mr-2" /> Back to Job
        </button>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5">
            <h1 className="text-2xl font-bold text-white">Apply for {job?.title}</h1>
            <p className="text-blue-100 mt-1">
              {job?.company} • {job?.location || 'Location not specified'}
            </p>
            <p className="text-blue-200 text-sm mt-2 font-mono">
              Job ID: {job?._id?.substring(0, 12)}...
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="fullName" 
                  value={formData.fullName} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resume/CV <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-500 transition cursor-pointer">
                <div className="space-y-1 text-center">
                  <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload a file</span>
                      <input 
                        type="file" 
                        className="sr-only" 
                        accept=".pdf,.doc,.docx" 
                        onChange={handleFileChange} 
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 5MB</p>
                  {formData.resume && (
                    <div className="mt-2 text-sm text-green-600 flex items-center justify-center gap-1">
                      <FiFile className="inline" /> 
                      {formData.resumeName}
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, resume: null, resumeName: '' })}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <FiX />
                      </button>
                    </div>
                  )}
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter (Optional)</label>
              <textarea 
                name="coverLetter" 
                value={formData.coverLetter} 
                onChange={handleChange} 
                rows="5" 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
                placeholder="Tell us why you're a great fit for this position..."
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="button" 
                onClick={() => navigate(`/jobs/${job._id}`)} 
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition"
                disabled={submitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={submitting} 
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ApplyPage;