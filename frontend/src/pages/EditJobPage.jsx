// frontend/src/pages/EditJobPage.jsx
// ✅ PROFESSIONAL EDIT JOB PAGE

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, FiSave, FiX, FiEye, FiTrash2,
  FiMapPin, FiDollarSign, FiBriefcase, FiCalendar,
  FiPlus, FiCheckCircle, FiAlertCircle
} from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const EditJobPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [job, setJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: [],
    responsibilities: [],
    salaryMin: '',
    salaryMax: '',
    jobType: 'Full-time',
    experienceLevel: 'Mid-Level',
    category: 'IT & Software',
    skills: [],
    applicationDeadline: '',
    status: 'Active'
  });
  
  const [requirementInput, setRequirementInput] = useState('');
  const [responsibilityInput, setResponsibilityInput] = useState('');
  const [skillInput, setSkillInput] = useState('');

  const categories = ['IT & Software', 'Finance', 'Marketing', 'Design', 'Healthcare', 'Education'];
  const jobTypes = ['Full-time', 'Part-time', 'Remote', 'Internship', 'Contract'];
  const experienceLevels = ['Entry Level', 'Junior', 'Mid-Level', 'Senior', 'Lead'];
  const statuses = ['Active', 'Closed', 'Draft'];

  // ✅ Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          toast.error('Please login again');
          navigate('/login');
          return;
        }

        console.log('📤 Fetching job for edit:', id);
        
        const response = await axios.get(`${API_URL}/jobs/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success && response.data.job) {
          const jobData = response.data.job;
          setJob(jobData);
          setFormData({
            title: jobData.title || '',
            company: jobData.company || '',
            location: jobData.location || '',
            description: jobData.description || '',
            requirements: jobData.requirements || [],
            responsibilities: jobData.responsibilities || [],
            salaryMin: jobData.salaryMin || '',
            salaryMax: jobData.salaryMax || '',
            jobType: jobData.jobType || 'Full-time',
            experienceLevel: jobData.experienceLevel || 'Mid-Level',
            category: jobData.category || 'IT & Software',
            skills: jobData.skills || [],
            applicationDeadline: jobData.applicationDeadline ? new Date(jobData.applicationDeadline).toISOString().split('T')[0] : '',
            status: jobData.status || 'Active'
          });
        } else {
          toast.error('Job not found');
          navigate('/recruiter/dashboard');
        }
      } catch (error) {
        console.error('❌ Error fetching job:', error);
        toast.error('Failed to load job details');
        navigate('/recruiter/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addRequirement = () => {
    if (requirementInput.trim()) {
      setFormData({ ...formData, requirements: [...formData.requirements, requirementInput.trim()] });
      setRequirementInput('');
    }
  };

  const removeRequirement = (index) => {
    setFormData({ ...formData, requirements: formData.requirements.filter((_, i) => i !== index) });
  };

  const addResponsibility = () => {
    if (responsibilityInput.trim()) {
      setFormData({ ...formData, responsibilities: [...formData.responsibilities, responsibilityInput.trim()] });
      setResponsibilityInput('');
    }
  };

  const removeResponsibility = (index) => {
    setFormData({ ...formData, responsibilities: formData.responsibilities.filter((_, i) => i !== index) });
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (index) => {
    setFormData({ ...formData, skills: formData.skills.filter((_, i) => i !== index) });
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('Please enter job title');
      return false;
    }
    if (!formData.location.trim()) {
      toast.error('Please enter location');
      return false;
    }
    if (!formData.description.trim()) {
      toast.error('Please enter job description');
      return false;
    }
    if (!formData.salaryMin || !formData.salaryMax) {
      toast.error('Please enter salary range');
      return false;
    }
    if (!formData.applicationDeadline) {
      toast.error('Please select application deadline');
      return false;
    }
    return true;
  };

  // ✅ Update job
  const handleUpdateJob = async () => {
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login again');
        navigate('/login');
        return;
      }

      const jobData = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        description: formData.description,
        requirements: formData.requirements,
        responsibilities: formData.responsibilities,
        salaryMin: parseInt(formData.salaryMin),
        salaryMax: parseInt(formData.salaryMax),
        jobType: formData.jobType,
        experienceLevel: formData.experienceLevel,
        category: formData.category,
        skills: formData.skills,
        applicationDeadline: formData.applicationDeadline,
        status: formData.status
      };

      console.log('📤 Updating job:', jobData);

      const response = await axios.put(
        `${API_URL}/jobs/${id}`,
        jobData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('✅ Job updated successfully!');
        navigate('/recruiter/dashboard');
      } else {
        toast.error(response.data.message || 'Failed to update job');
      }
    } catch (error) {
      console.error('❌ Error updating job:', error);
      
      if (error.response?.status === 401) {
        toast.error('Please login again');
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to update job');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Delete job
  const handleDeleteJob = async () => {
    if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) return;

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.delete(`${API_URL}/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success('✅ Job deleted successfully!');
        navigate('/recruiter/dashboard');
      } else {
        toast.error(response.data.message || 'Failed to delete job');
      }
    } catch (error) {
      console.error('❌ Error deleting job:', error);
      toast.error('Failed to delete job');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={() => navigate('/recruiter/dashboard')} 
            className="flex items-center text-gray-600 hover:text-blue-600 mb-4 transition"
          >
            <FiArrowLeft className="mr-2" /> Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Edit Job</h1>
              <p className="text-gray-500 mt-1">Update your job posting details</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPreview(true)}
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition flex items-center gap-2"
              >
                <FiEye /> Preview
              </button>
              <button
                onClick={handleDeleteJob}
                className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition flex items-center gap-2"
              >
                <FiTrash2 /> Delete
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form className="space-y-6">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full md:w-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Senior Frontend Developer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., New York, NY or Remote"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {jobTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {experienceLevels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Salary (k$) *</label>
                <input
                  type="number"
                  name="salaryMin"
                  value={formData.salaryMin}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 80"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Salary (k$) *</label>
                <input
                  type="number"
                  name="salaryMax"
                  value={formData.salaryMax}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 120"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={requirementInput}
                  onChange={(e) => setRequirementInput(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 5+ years React experience"
                  onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                />
                <button
                  type="button"
                  onClick={addRequirement}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <FiPlus />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.requirements.map((req, idx) => (
                  <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    {req}
                    <button type="button" onClick={() => removeRequirement(idx)} className="text-red-500 hover:text-red-700">
                      <FiX />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Responsibilities</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={responsibilityInput}
                  onChange={(e) => setResponsibilityInput(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Build responsive web applications"
                  onKeyPress={(e) => e.key === 'Enter' && addResponsibility()}
                />
                <button
                  type="button"
                  onClick={addResponsibility}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <FiPlus />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.responsibilities.map((resp, idx) => (
                  <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    {resp}
                    <button type="button" onClick={() => removeResponsibility(idx)} className="text-red-500 hover:text-red-700">
                      <FiX />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., React"
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <FiPlus />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, idx) => (
                  <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    {skill}
                    <button type="button" onClick={() => removeSkill(idx)} className="text-red-500 hover:text-red-700">
                      <FiX />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline *</label>
              <input
                type="date"
                name="applicationDeadline"
                value={formData.applicationDeadline}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <button
                type="button"
                onClick={() => navigate('/recruiter/dashboard')}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateJob}
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  <><FiSave /> Update Job</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowPreview(false)}></div>
            <div className="relative bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Job Preview</h2>
                  <p className="text-gray-500 text-sm">Review your job posting</p>
                </div>
                <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-gray-600">
                  <FiX size={24} />
                </button>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">{formData.title || 'Job Title'}</h1>
                  <p className="text-blue-600 font-medium mt-1">{formData.company || 'Company Name'}</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                    formData.status === 'Active' ? 'bg-green-100 text-green-700' :
                    formData.status === 'Closed' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {formData.status || 'Draft'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b">
                  <div className="flex items-center text-gray-600">
                    <FiMapPin className="mr-2 text-blue-500" />
                    <span>{formData.location || 'Location'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiDollarSign className="mr-2 text-green-500" />
                    <span>{formData.salaryMin && formData.salaryMax ? `$${formData.salaryMin}k - $${formData.salaryMax}k` : 'Salary Range'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiBriefcase className="mr-2 text-orange-500" />
                    <span>{formData.jobType}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiCalendar className="mr-2 text-purple-500" />
                    <span>Deadline: {formData.applicationDeadline || 'Not set'}</span>
                  </div>
                </div>
                
                {formData.description && (
                  <div className="py-6 border-b">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Job Description</h3>
                    <p className="text-gray-600 leading-relaxed">{formData.description}</p>
                  </div>
                )}
                
                {formData.requirements.length > 0 && (
                  <div className="py-6 border-b">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Requirements</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      {formData.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {formData.responsibilities.length > 0 && (
                  <div className="py-6 border-b">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Responsibilities</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      {formData.responsibilities.map((resp, idx) => (
                        <li key={idx}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {formData.skills.length > 0 && (
                  <div className="py-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill, idx) => (
                        <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-3">
                <button 
                  onClick={() => setShowPreview(false)} 
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                >
                  Close
                </button>
                <button 
                  onClick={handleUpdateJob} 
                  disabled={submitting}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50 flex items-center gap-2"
                >
                  <FiSave /> Update Job
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditJobPage;