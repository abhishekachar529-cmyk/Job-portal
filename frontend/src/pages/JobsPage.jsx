// frontend/src/pages/JobsPage.jsx
// ✅ CLEAN VERSION - NO HARDCODED JOBS

console.log('🔥 JOBS PAGE - CLEAN VERSION');

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

const JobsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'IT & Software', 'Finance', 'Marketing', 'Design', 'Healthcare', 'Education'];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, [location.search]);

  // ✅ FETCH JOBS FROM MONGODB
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        console.log('📤 Fetching jobs from MongoDB...');
        const response = await axios.get(`${API_URL}/jobs`);
        console.log('📥 Response:', response.data);

        if (response.data.success) {
          const jobsData = response.data.jobs || [];
          console.log(`✅ Loaded ${jobsData.length} jobs`);
          
          jobsData.forEach((job, i) => {
            console.log(`  ${i+1}. ${job.title} - ${job.company}`);
          });
          
          setJobs(jobsData);
        } else {
          toast.error('Failed to load jobs');
        }
      } catch (error) {
        console.error('❌ Error:', error);
        toast.error('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // ✅ Filter jobs
  const filteredJobs = jobs.filter(job => {
    let match = true;
    
    if (searchTerm) {
      match = match && job.title?.toLowerCase().includes(searchTerm.toLowerCase());
    }
    if (locationFilter) {
      match = match && job.location?.toLowerCase().includes(locationFilter.toLowerCase());
    }
    if (selectedCategory !== 'all') {
      match = match && job.category === selectedCategory;
    }
    
    return match;
  });

  // ✅ LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  // ✅ NO JOBS
  if (filteredJobs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Find Your Perfect Job</h1>
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No jobs found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ SHOW JOBS
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Find Your Perfect Job</h1>
        <p className="text-gray-600 mb-6">Found {filteredJobs.length} jobs</p>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <input 
              type="text" 
              placeholder="Search jobs..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input 
              type="text" 
              placeholder="Location" 
              value={locationFilter} 
              onChange={(e) => setLocationFilter(e.target.value)} 
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.filter(c => c !== 'all').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
              Search Jobs
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm ${
              selectedCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Jobs
          </button>
          {categories.filter(c => c !== 'all').map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Job Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div 
              key={job._id} 
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 cursor-pointer"
              onClick={() => navigate(`/jobs/${job._id}`)}
            >
              <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
              <p className="text-blue-600 font-medium">{job.company}</p>
              <p className="text-gray-500 text-sm">{job.location || 'Remote'}</p>
              <p className="text-green-600 font-semibold mt-2">${job.salaryMin}k - ${job.salaryMax}k</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full">
                  {job.category || 'General'}
                </span>
                <span className="text-sm text-gray-500">{job.jobType || 'Full-time'}</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); navigate(`/jobs/${job._id}`); }}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobsPage;