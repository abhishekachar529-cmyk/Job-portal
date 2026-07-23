// frontend/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiBriefcase, FiMail, FiLock, FiPhone, FiCheckCircle, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('seeker');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    companyName: '',
    companyWebsite: '',
    companyDescription: ''
  });
  const [errors, setErrors] = useState({});

  // API URL - Backend URL
  const API_URL = 'http://localhost:5000/api';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (role === 'recruiter' && !formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // 1. Check if email already exists in MongoDB
      const checkResponse = await axios.get(`${API_URL}/auth/check-email?email=${formData.email}`);
      
      if (checkResponse.data.exists) {
        toast.error('User already exists! Please login.');
        setIsLoading(false);
        return;
      }

      // 2. Prepare user data for MongoDB
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || '',
        role: role,
        ...(role === 'recruiter' && {
          companyName: formData.companyName,
          companyWebsite: formData.companyWebsite || '',
          companyDescription: formData.companyDescription || ''
        })
      };

      console.log('📤 Sending to MongoDB:', userData);

      // 3. Send to MongoDB via API
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      
      console.log('📥 Response from MongoDB:', response.data);

      if (response.data.success) {
        // 4. Also save to localStorage as backup
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const newUser = {
          id: response.data.user?._id || Date.now(),
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          role: role,
          createdAt: new Date().toISOString(),
          isActive: true,
          ...(role === 'recruiter' && {
            companyName: formData.companyName,
            companyWebsite: formData.companyWebsite,
            companyDescription: formData.companyDescription
          })
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        toast.success('✅ Registration successful! Please login.');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        toast.error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        toast.error(error.response.data?.message || 'Registration failed. Please try again.');
      } else if (error.request) {
        console.error('No response received:', error.request);
        toast.error('Cannot connect to server. Please make sure backend is running.');
      } else {
        console.error('Error:', error.message);
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create an Account</h1>
          <p className="text-gray-500 mt-2">Join thousands of professionals on JobPortal</p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Job Seeker Card - Blue */}
          <div 
            onClick={() => setRole('seeker')} 
            className={`cursor-pointer rounded-xl p-6 transition-all duration-300 ${
              role === 'seeker' 
                ? 'bg-blue-600 text-white shadow-lg scale-105' 
                : 'bg-white border-2 border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <FiUser className={`text-4xl ${role === 'seeker' ? 'text-white' : 'text-blue-600'}`} />
              {role === 'seeker' && <FiCheckCircle className="text-white text-2xl" />}
            </div>
            <h2 className={`text-xl font-bold mb-2 ${role === 'seeker' ? 'text-white' : 'text-gray-800'}`}>Job Seeker</h2>
            <p className={`text-sm ${role === 'seeker' ? 'text-blue-100' : 'text-gray-500'}`}>
              Find your dream job, apply to companies, track applications
            </p>
          </div>

          {/* Recruiter Card - GREEN */}
          <div 
            onClick={() => setRole('recruiter')} 
            className={`cursor-pointer rounded-xl p-6 transition-all duration-300 ${
              role === 'recruiter' 
                ? 'bg-green-600 text-white shadow-lg scale-105' 
                : 'bg-white border-2 border-gray-200 hover:border-green-300'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <FiBriefcase className={`text-4xl ${role === 'recruiter' ? 'text-white' : 'text-green-600'}`} />
              {role === 'recruiter' && <FiCheckCircle className="text-white text-2xl" />}
            </div>
            <h2 className={`text-xl font-bold mb-2 ${role === 'recruiter' ? 'text-white' : 'text-gray-800'}`}>Recruiter</h2>
            <p className={`text-sm ${role === 'recruiter' ? 'text-green-100' : 'text-gray-500'}`}>
              Post jobs, find talent, manage applications
            </p>
          </div>

          {/* Admin Card - Purple */}
          <div 
            onClick={() => setRole('admin')} 
            className={`cursor-pointer rounded-xl p-6 transition-all duration-300 ${
              role === 'admin' 
                ? 'bg-purple-600 text-white shadow-lg scale-105' 
                : 'bg-white border-2 border-gray-200 hover:border-purple-300'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <FiShield className={`text-4xl ${role === 'admin' ? 'text-white' : 'text-purple-600'}`} />
              {role === 'admin' && <FiCheckCircle className="text-white text-2xl" />}
            </div>
            <h2 className={`text-xl font-bold mb-2 ${role === 'admin' ? 'text-white' : 'text-gray-800'}`}>Admin</h2>
            <p className={`text-sm ${role === 'admin' ? 'text-purple-100' : 'text-gray-500'}`}>
              Manage platform, users, and analytics
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    placeholder="••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    placeholder="••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Recruiter Specific Fields */}
            {role === 'recruiter' && (
              <div className="border-t pt-6 mt-4 border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FiBriefcase className="mr-2 text-green-600" /> Company Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Tech Corp Inc."
                    />
                    {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Website</label>
                    <input
                      type="url"
                      name="companyWebsite"
                      value={formData.companyWebsite}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Description</label>
                    <textarea
                      name="companyDescription"
                      value={formData.companyDescription}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Tell us about your company..."
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* Admin Note */}
            {role === 'admin' && (
              <div className="border-t pt-6 mt-4 border-gray-200">
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-start">
                    <FiShield className="text-purple-600 text-xl mr-3 mt-0.5" />
                    <div>
                      <p className="text-purple-800 font-medium">Admin Access</p>
                      <p className="text-purple-600 text-sm mt-1">
                        Admin accounts have full access to manage users, jobs, and platform analytics. 
                        Please ensure you have proper authorization.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="flex items-start pt-4">
              <input type="checkbox" required className="mt-1 mr-3 w-4 h-4" />
              <span className="text-sm text-gray-600">
                I agree to the{' '}
                <Link to="/terms" className="text-blue-600 hover:text-blue-700 hover:underline font-medium" target="_blank">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-blue-600 hover:text-blue-700 hover:underline font-medium" target="_blank">
                  Privacy Policy
                </Link>
              </span>
            </div>

            {/* Connection Status Indicator */}
            <div className="flex items-center justify-center gap-4 text-xs text-gray-400 border-t pt-4">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                localStorage ✓
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                MongoDB ✓
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                API: {API_URL}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 ${
                role === 'seeker' ? 'bg-blue-600 hover:bg-blue-700' : 
                role === 'recruiter' ? 'bg-green-600 hover:bg-green-700' : 
                'bg-purple-600 hover:bg-purple-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                `Create ${role === 'seeker' ? 'Job Seeker' : role === 'recruiter' ? 'Recruiter' : 'Admin'} Account`
              )}
            </button>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-blue-600 hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;