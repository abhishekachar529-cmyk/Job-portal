// frontend/src/pages/JobListingsPage.jsx
// ✅ SECURE APPLY - MUST LOGIN FIRST

console.log('🔥 JOB LISTINGS PAGE - WORKING APPLY');

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FiSearch, FiMapPin, FiDollarSign, FiBriefcase, FiClock, 
  FiBookmark, FiTrendingUp, FiX, FiFilter,
  FiCode, FiBarChart2, FiStar, FiMail, FiHeart,
  FiGrid, FiList, FiChevronLeft, FiChevronRight,
  FiLock
} from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

const JobListingsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedExperience, setSelectedExperience] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [savedJobs, setSavedJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [jobsPerPage, setJobsPerPage] = useState(100);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const categories = [
    { id: 'IT & Software', name: 'IT & Software', icon: FiCode, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', text: 'text-blue-600' },
    { id: 'Finance', name: 'Finance', icon: FiBarChart2, color: 'from-green-500 to-green-600', bg: 'bg-green-50', text: 'text-green-600' },
    { id: 'Marketing', name: 'Marketing', icon: FiTrendingUp, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', text: 'text-purple-600' },
    { id: 'Design', name: 'Design', icon: FiStar, color: 'from-pink-500 to-pink-600', bg: 'bg-pink-50', text: 'text-pink-600' },
    { id: 'Healthcare', name: 'Healthcare', icon: FiHeart, color: 'from-red-500 to-red-600', bg: 'bg-red-50', text: 'text-red-600' },
    { id: 'Education', name: 'Education', icon: FiMail, color: 'from-yellow-500 to-yellow-600', bg: 'bg-yellow-50', text: 'text-yellow-600' },
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        console.log('📤 Fetching jobs from MongoDB...');
        const response = await axios.get(`${API_URL}/jobs`);
        console.log('📥 Response:', response.data);

        if (response.data.success) {
          const jobsData = response.data.jobs || [];
          console.log(`✅ Loaded ${jobsData.length} jobs from MongoDB`);
          
          jobsData.forEach((job, i) => {
            console.log(`  ${i+1}. ${job.title} - ID: ${job._id}`);
          });
          
          setJobs(jobsData);
          setFilteredJobs(jobsData);
        } else {
          toast.error('Failed to load jobs');
        }
      } catch (error) {
        console.error('❌ Error fetching jobs:', error);
        toast.error('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    setSavedJobs(saved);
  }, []);

  useEffect(() => {
    let filtered = [...jobs];
    
    if (selectedCategory) {
      filtered = filtered.filter(job => job.category === selectedCategory);
    }
    
    if (selectedType !== 'all') {
      filtered = filtered.filter(job => job.jobType === selectedType);
    }
    
    if (selectedExperience !== 'all') {
      filtered = filtered.filter(job => job.experienceLevel === selectedExperience);
    }
    
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(job => 
        job.title?.toLowerCase().includes(searchLower) ||
        job.company?.toLowerCase().includes(searchLower) ||
        job.skills?.some(skill => skill.toLowerCase().includes(searchLower))
      );
    }
    
    if (locationFilter.trim() !== '') {
      filtered = filtered.filter(job => 
        job.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    
    setFilteredJobs(filtered);
    setCurrentPage(1);
  }, [jobs, selectedCategory, selectedType, selectedExperience, searchTerm, locationFilter]);

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const handleClearFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setSelectedType('all');
    setSelectedExperience('all');
    setSelectedCategory('');
    navigate('/jobs');
    toast.success('All filters cleared');
  };

  const handleCategoryClick = (categoryId) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory('');
      navigate('/jobs');
    } else {
      setSelectedCategory(categoryId);
      navigate(`/jobs?category=${encodeURIComponent(categoryId)}`);
    }
    setShowMobileFilters(false);
  };

  // ✅ SECURE Apply - Shows login modal/prompt first
  const handleApplyClick = (job) => {
    console.log('📝 Apply clicked for job:', job.title, 'ID:', job._id);
    
    // ✅ Check if user is logged in
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    // ❌ NOT LOGGED IN - Show login modal
    if (!user || !token) {
      console.log('❌ User not logged in - Showing login prompt');
      setSelectedJob(job);
      setShowLoginModal(true);
      return;
    }
    
    try {
      const userData = JSON.parse(user);
      console.log('👤 Logged in user:', userData.email, 'Role:', userData.role);
      
      if (!job._id) {
        toast.error('Invalid job ID. Please try again.');
        return;
      }
      
      // ✅ Check role - Only seekers can apply
      if (userData.role === 'seeker') {
        console.log('✅ Seeker - navigating to apply page');
        navigate(`/seeker/apply/${job._id}`);
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

  // ✅ Handle login from modal
  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    if (selectedJob) {
      sessionStorage.setItem('redirectAfterLogin', `/jobs/${selectedJob._id}`);
      sessionStorage.setItem('applyAfterLogin', selectedJob._id);
    }
    navigate('/login', { 
      state: { 
        from: selectedJob ? `/jobs/${selectedJob._id}` : '/jobs',
        message: 'Please login to apply for this job'
      } 
    });
  };

  const handleSaveJob = (jobId) => {
    const user = localStorage.getItem('user');
    if (!user) {
      toast.error('🔒 Please login to save jobs');
      navigate('/login');
      return;
    }
    
    let saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    if (saved.includes(jobId)) {
      saved = saved.filter(id => id !== jobId);
      toast.success('Job removed from saved');
    } else {
      saved.push(jobId);
      toast.success('Job saved successfully');
    }
    localStorage.setItem('savedJobs', JSON.stringify(saved));
    setSavedJobs(saved);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'IT & Software': 'bg-blue-100 text-blue-700',
      'Finance': 'bg-green-100 text-green-700',
      'Marketing': 'bg-purple-100 text-purple-700',
      'Design': 'bg-pink-100 text-pink-700',
      'Healthcare': 'bg-red-100 text-red-700',
      'Education': 'bg-yellow-100 text-yellow-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading jobs from MongoDB...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-3">
              {selectedCategory 
                ? `${categories.find(c => c.id === selectedCategory)?.name || selectedCategory} Jobs`
                : 'Find Your Perfect Job'
              }
            </h1>
            <p className="text-blue-100 text-lg">
              {filteredJobs.length} opportunities available
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Search Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 -mt-8 mb-8">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Job title, keywords, or company" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="City, state, or remote" 
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button 
                onClick={() => {}} 
                className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Search Jobs
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {selectedCategory && (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {categories.find(c => c.id === selectedCategory)?.name || selectedCategory}
                  <button 
                    onClick={() => {
                      setSelectedCategory('');
                      navigate('/jobs');
                    }}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </span>
              )}
              {selectedType !== 'all' && (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {selectedType}
                  <button 
                    onClick={() => setSelectedType('all')}
                    className="hover:bg-green-200 rounded-full p-0.5"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </span>
              )}
              {selectedExperience !== 'all' && (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {selectedExperience}
                  <button 
                    onClick={() => setSelectedExperience('all')}
                    className="hover:bg-purple-200 rounded-full p-0.5"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </span>
              )}
              <button 
                onClick={handleClearFilters}
                className="text-sm text-gray-500 hover:text-red-600 transition"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="mb-6 overflow-x-auto">
            <div className="flex gap-2 min-w-max pb-2">
              <button
                onClick={() => {
                  setSelectedCategory('');
                  navigate('/jobs');
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap flex items-center gap-1 ${
                  !selectedCategory 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FiBriefcase className="w-4 h-4" />
                All Jobs ({jobs.length})
              </button>
              {categories.map((cat) => {
                const count = jobs.filter(j => j.category === cat.id).length;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap flex items-center gap-1 ${
                      selectedCategory === cat.id
                        ? `bg-gradient-to-r ${cat.color} text-white`
                        : `${cat.bg} ${cat.text} hover:shadow-md`
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-80">
              <div className={`bg-white rounded-xl shadow-md p-6 ${showMobileFilters ? 'block' : 'hidden lg:block'} sticky top-24`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg text-gray-800">Filters</h3>
                  <button onClick={handleClearFilters} className="text-sm text-red-500 hover:text-red-600 font-medium">
                    Clear All
                  </button>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3">Category</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setSelectedCategory('');
                        navigate('/jobs');
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center justify-between ${
                        !selectedCategory 
                          ? 'bg-blue-50 text-blue-600 font-medium' 
                          : 'hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      <span>All Categories</span>
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">{jobs.length}</span>
                    </button>
                    {categories.map((cat) => {
                      const count = jobs.filter(j => j.category === cat.id).length;
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => handleCategoryClick(cat.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center justify-between ${
                            selectedCategory === cat.id 
                              ? `${cat.bg} ${cat.text} font-medium` 
                              : 'hover:bg-gray-50 text-gray-600'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {cat.name}
                          </span>
                          <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3">Job Type</h4>
                  <div className="space-y-2">
                    {['all', 'Full-time', 'Remote', 'Part-time', 'Internship', 'Contract'].map(type => (
                      <label key={type} className="flex items-center cursor-pointer">
                        <input 
                          type="radio" 
                          name="jobType" 
                          value={type} 
                          checked={selectedType === type} 
                          onChange={(e) => setSelectedType(e.target.value)} 
                          className="mr-2 text-blue-600" 
                        />
                        <span className="text-gray-600">{type === 'all' ? 'All Types' : type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3">Experience Level</h4>
                  <div className="space-y-2">
                    {['all', 'Entry Level', 'Junior', 'Mid-Level', 'Senior', 'Lead'].map(level => (
                      <label key={level} className="flex items-center cursor-pointer">
                        <input 
                          type="radio" 
                          name="experience" 
                          value={level} 
                          checked={selectedExperience === level} 
                          onChange={(e) => setSelectedExperience(e.target.value)} 
                          className="mr-2 text-blue-600" 
                        />
                        <span className="text-gray-600">{level === 'all' ? 'Any Experience' : level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setShowMobileFilters(false)} 
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Apply Filters
                </button>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-500">{filteredJobs.length} jobs found</p>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{filteredJobs.length} Jobs Found</h2>
                  <p className="text-gray-500 text-sm">
                    Showing {filteredJobs.length > 0 ? indexOfFirstJob + 1 : 0}-{Math.min(indexOfLastJob, filteredJobs.length)} of {filteredJobs.length} jobs
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1 border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                    >
                      <FiGrid />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                    >
                      <FiList />
                    </button>
                  </div>
                  <button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition"
                  >
                    <FiFilter /> Filters
                  </button>
                </div>
              </div>

              {filteredJobs.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">No jobs found</h3>
                  <p className="text-gray-500">
                    {selectedCategory 
                      ? `No ${selectedCategory} jobs available at the moment. Try another category.`
                      : 'Try adjusting your search or filters'}
                  </p>
                  <button onClick={handleClearFilters} className="mt-4 text-blue-600 hover:underline font-medium">
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 gap-6' : 'space-y-4'}>
                  {currentJobs.map((job) => (
                    <div key={job._id} className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 ${
                      viewMode === 'grid' ? 'p-6' : 'p-4 flex flex-col md:flex-row items-start md:items-center gap-4'
                    }`}>
                      <div className="flex-1 w-full">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          {job.category && (
                            <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(job.category)}`}>
                              {job.category}
                            </span>
                          )}
                          {job.jobType && (
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                              {job.jobType}
                            </span>
                          )}
                        </div>
                        
                        <div className={`flex ${viewMode === 'grid' ? 'flex-col' : 'flex-row items-center gap-4'}`}>
                          <div className={`flex-1 ${viewMode === 'grid' ? '' : 'flex items-center gap-4'}`}>
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                              {job.company?.charAt(0) || 'C'}
                            </div>
                            <div>
                              <Link 
                                to={`/jobs/${job._id}`} 
                                className="text-lg font-bold text-gray-800 hover:text-blue-600 transition"
                              >
                                {job.title}
                              </Link>
                              <p className="text-gray-500">{job.company}</p>
                            </div>
                          </div>
                          
                          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 gap-2 mt-3' : 'grid-cols-4 gap-4'} text-sm`}>
                            <div className="flex items-center text-gray-500">
                              <FiMapPin className="mr-1 text-blue-500 flex-shrink-0" /> {job.location || 'Remote'}
                            </div>
                            <div className="flex items-center text-gray-500">
                              <FiDollarSign className="mr-1 text-green-500 flex-shrink-0" /> ${job.salaryMin}k - ${job.salaryMax}k
                            </div>
                            <div className="flex items-center text-gray-500">
                              <FiClock className="mr-1 text-orange-500 flex-shrink-0" /> {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}
                            </div>
                            <div className="flex items-center text-gray-500">
                              <FiBriefcase className="mr-1 text-purple-500 flex-shrink-0" /> {job.jobType || 'Full-time'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-3">
                          {(job.skills || []).slice(0, 3).map((skill, idx) => (
                            <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                              {skill}
                            </span>
                          ))}
                          {(job.skills || []).length > 3 && (
                            <span className="text-gray-400 text-xs px-2 py-1">
                              +{(job.skills || []).length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className={`flex ${viewMode === 'grid' ? 'flex-row mt-4 pt-4 border-t' : 'flex-col'} gap-2 flex-shrink-0`}>
                        <button 
                          onClick={() => handleApplyClick(job)} 
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center gap-1"
                        >
                          Apply Now
                        </button>
                        <button 
                          onClick={() => handleSaveJob(job._id)} 
                          className={`border px-4 py-2 rounded-lg transition text-sm flex items-center justify-center gap-1 ${
                            savedJobs.includes(job._id) 
                              ? 'border-blue-600 bg-blue-50 text-blue-600' 
                              : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <FiBookmark className={savedJobs.includes(job._id) ? 'fill-current' : ''} /> 
                          {savedJobs.includes(job._id) ? 'Saved' : 'Save'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-between mt-8 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Jobs per page:</span>
                    <select 
                      value={jobsPerPage}
                      onChange={(e) => setJobsPerPage(Number(e.target.value))}
                      className="border rounded-lg px-2 py-1 text-sm"
                    >
                      <option value={6}>6</option>
                      <option value={12}>12</option>
                      <option value={24}>24</option>
                      <option value={48}>48</option>
                      <option value={100}>100</option>
                      <option value={1000}>Show All</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                      disabled={currentPage === 1} 
                      className="px-3 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition flex items-center gap-1"
                    >
                      <FiChevronLeft className="w-4 h-4" /> Previous
                    </button>
                    
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 7) {
                        pageNum = i + 1;
                      } else if (currentPage <= 4) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 3) {
                        pageNum = totalPages - 6 + i;
                      } else {
                        pageNum = currentPage - 3 + i;
                      }
                      return (
                        <button 
                          key={pageNum} 
                          onClick={() => setCurrentPage(pageNum)} 
                          className={`px-3 py-2 rounded-lg transition ${
                            currentPage === pageNum 
                              ? 'bg-blue-600 text-white' 
                              : 'border hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                      disabled={currentPage === totalPages} 
                      className="px-3 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition flex items-center gap-1"
                    >
                      Next <FiChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
                Please login to apply for <strong>{selectedJob?.title}</strong> at <strong>{selectedJob?.company}</strong>
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
                    setSelectedJob(null);
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

export default JobListingsPage;