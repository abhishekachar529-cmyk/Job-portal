// frontend/src/pages/PostJobPage.jsx
// ✅ UPDATED - With Success Page

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { 
  FiMapPin, FiDollarSign, FiBriefcase, FiCalendar, 
  FiPlus, FiX, FiEye, FiArrowLeft, FiCheckCircle,
  FiSave, FiTrash2, FiClock
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const PostJobPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: user?.companyName || user?.name || '',
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
    applicationDeadline: ''
  });
  
  const [requirementInput, setRequirementInput] = useState('');
  const [responsibilityInput, setResponsibilityInput] = useState('');
  const [skillInput, setSkillInput] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

  // ✅ Post job to MongoDB
  const handlePostJob = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login again');
        navigate('/login');
        return;
      }

      // Prepare job data for MongoDB
      const jobData = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        description: formData.description,
        requirements: formData.requirements,
        responsibilities: formData.responsibilities,
        salaryMin: parseInt(formData.salaryMin) || 0,
        salaryMax: parseInt(formData.salaryMax) || 0,
        jobType: formData.jobType,
        experienceLevel: formData.experienceLevel,
        category: formData.category,
        skills: formData.skills,
        applicationDeadline: formData.applicationDeadline,
        status: 'Active'
      };

      console.log('📤 Posting job to MongoDB:', jobData);

      // ✅ Save to MongoDB via API
      const response = await axios.post(
        `${API_URL}/jobs`,
        jobData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('📥 Response:', response.data);

      if (response.data.success) {
        // ✅ Get the MongoDB job with _id
        const mongoJob = response.data.job || response.data.data;
        const mongoId = mongoJob._id || mongoJob.id;

        console.log('✅ Job saved to MongoDB with _id:', mongoId);

        // ✅ Show toast
        toast.success('🎉 Job posted successfully!', {
          duration: 5000,
          position: 'top-center',
        });

        // ✅ Show success page
        setJobId(mongoId);
        setShowSuccess(true);
        setLoading(false);
        setShowPreview(false);
        
        // ✅ Reset form
        setFormData({
          title: '',
          company: user?.companyName || user?.name || '',
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
          applicationDeadline: ''
        });
      } else {
        toast.error('❌ ' + (response.data.message || 'Failed to post job'));
        setLoading(false);
      }
    } catch (error) {
      console.error('❌ Error posting job:', error);
      
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        
        if (error.response.status === 401) {
          toast.error('Please login again');
          navigate('/login');
        } else if (error.response.status === 400) {
          toast.error(error.response.data?.message || 'Invalid job data');
        } else if (error.response.status === 500) {
          toast.error('Server error. Please try again.');
        } else {
          toast.error(error.response.data?.message || 'Failed to post job');
        }
      } else if (error.request) {
        toast.error('Cannot connect to server. Please make sure backend is running.');
      } else {
        toast.error('Failed to post job. Please try again.');
      }
      setLoading(false);
    }
  };

  // ✅ Save as Draft
  const handleSaveDraft = () => {
    if (!formData.title.trim()) {
      toast.error('Please enter job title to save draft');
      return;
    }

    const draftJob = {
      id: Date.now(),
      title: formData.title,
      company: formData.company,
      location: formData.location,
      description: formData.description,
      requirements: formData.requirements,
      responsibilities: formData.responsibilities,
      salaryMin: formData.salaryMin,
      salaryMax: formData.salaryMax,
      jobType: formData.jobType,
      experienceLevel: formData.experienceLevel,
      category: formData.category,
      skills: formData.skills,
      applicationDeadline: formData.applicationDeadline,
      status: 'Draft',
      postedBy: user?.email,
      createdAt: new Date().toISOString()
    };
    
    const existingDrafts = JSON.parse(localStorage.getItem('jobDrafts') || '[]');
    existingDrafts.push(draftJob);
    localStorage.setItem('jobDrafts', JSON.stringify(existingDrafts));
    
    toast.success('📝 Job saved as draft!');
    navigate('/recruiter/dashboard');
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved data will be lost.')) {
      navigate('/recruiter/dashboard');
    }
  };

  // ✅ Success Page Component
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md w-full">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="text-6xl text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">🎉 Job Posted!</h2>
          <p className="text-gray-500 mb-6">
            Your job "{formData.title}" has been posted successfully and is now visible to job seekers.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setShowSuccess(false);
                if (jobId) {
                  navigate(`/jobs/${jobId}`);
                } else {
                  navigate('/recruiter/dashboard');
                }
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-semibold"
            >
              View Job
            </button>
            <button
              onClick={() => {
                setShowSuccess(false);
                navigate('/recruiter/dashboard');
              }}
              className="border border-gray-300 text-gray-600 px-6 py-3 rounded-xl hover:bg-gray-50 transition font-medium"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => {
                setShowSuccess(false);
                setFormData({
                  title: '',
                  company: user?.companyName || user?.name || '',
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
                  applicationDeadline: ''
                });
                window.scrollTo(0, 0);
              }}
              className="border border-green-500 text-green-600 px-6 py-3 rounded-xl hover:bg-green-50 transition font-medium"
            >
              Post Another Job
            </button>
          </div>
        </div>
      </div>
    );
  }

  const PreviewModal = () => (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowPreview(false)}></div>
        <div className="relative bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Job Preview</h2>
              <p className="text-gray-500 text-sm">Review your job posting before publishing</p>
            </div>
            <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-gray-600">
              <FiX size={24} />
            </button>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{formData.title || 'Job Title'}</h1>
              <p className="text-green-600 font-medium mt-1">{formData.company || 'Company Name'}</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b">
              <div className="flex items-center text-gray-600">
                <FiMapPin className="mr-2 text-green-500" />
                <span>{formData.location || 'Location'}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FiDollarSign className="mr-2 text-green-500" />
                <span>{formData.salaryMin && formData.salaryMax ? `$${formData.salaryMin}k - $${formData.salaryMax}k` : 'Salary Range'}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FiBriefcase className="mr-2 text-green-500" />
                <span>{formData.jobType}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FiCalendar className="mr-2 text-green-500" />
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
                    <span key={idx} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
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
              Edit
            </button>
            <button 
              onClick={handleSaveDraft} 
              className="px-6 py-2 border border-yellow-500 text-yellow-600 rounded-lg hover:bg-yellow-50 transition flex items-center gap-2"
            >
              <FiSave /> Save Draft
            </button>
            <button 
              onClick={handlePostJob} 
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Posting...
                </span>
              ) : (
                <><FiCheckCircle /> Post Job</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <button 
            onClick={() => navigate('/recruiter/dashboard')} 
            className="flex items-center text-gray-600 hover:text-green-600 mb-4 transition"
          >
            <FiArrowLeft className="mr-2" /> Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Post a New Job</h1>
          <p className="text-gray-500 mt-1">Fill in the details below to attract the best talent</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Senior Frontend Developer"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., New York, NY or Remote"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Remote">Remote</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Entry Level">Entry Level</option>
                  <option value="Junior">Junior</option>
                  <option value="Mid-Level">Mid-Level</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead">Lead</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="IT & Software">IT & Software</option>
                  <option value="Finance">Finance</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Design">Design</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., 80"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Salary (k$) *</label>
                <input
                  type="number"
                  name="salaryMax"
                  value={formData.salaryMax}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., 120"
                  required
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={requirementInput}
                  onChange={(e) => setRequirementInput(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., 5+ years React experience"
                  onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                />
                <button
                  type="button"
                  onClick={addRequirement}
                  className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
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
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Build responsive web applications"
                  onKeyPress={(e) => e.key === 'Enter' && addResponsibility()}
                />
                <button
                  type="button"
                  onClick={addResponsibility}
                  className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
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
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., React"
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  <FiPlus />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, idx) => (
                  <span key={idx} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="flex-1 px-6 py-3 border border-yellow-500 text-yellow-600 rounded-lg hover:bg-yellow-50 transition flex items-center justify-center gap-2"
              >
                <FiSave /> Save Draft
              </button>
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="flex-1 px-6 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition flex items-center justify-center gap-2"
              >
                <FiEye /> Preview
              </button>
            </div>
          </form>
        </div>
      </div>

      {showPreview && <PreviewModal />}
    </div>
  );
};

export default PostJobPage;