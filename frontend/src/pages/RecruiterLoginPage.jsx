import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiBriefcase, FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const RecruiterLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email && u.password === password && u.role === 'recruiter');
      
      if (!user) {
        toast.error('Invalid credentials or not a recruiter account. Please register first.');
        setIsLoading(false);
        return;
      }
      
      const loggedInUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        companyName: user.companyName,
        companyWebsite: user.companyWebsite,
        companyDescription: user.companyDescription
      };
      
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      localStorage.setItem('token', 'token-' + Date.now());
      dispatch(setUser({ user: loggedInUser, token: localStorage.getItem('token') }));
      
      toast.success(`Welcome back, ${user.companyName || user.name}!`);
      
      setIsLoading(false);
      navigate('/recruiter/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-green-50 py-12 px-4">
      <div className="max-w-md w-full">
        {/* Back to Home */}
        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-teal-600 mb-4">
          <FiArrowLeft className="mr-1" /> Back to Home
        </Link>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-600 to-green-600 rounded-2xl shadow-lg mb-4">
            <FiBriefcase className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Recruiter Portal</h1>
          <p className="text-gray-500 mt-2">Sign in to manage jobs and find talent</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-teal-600 to-green-600 px-6 py-4">
            <h2 className="text-white font-semibold text-lg">Recruiter Access</h2>
            <p className="text-teal-100 text-sm">Post jobs, manage applicants, find the best talent</p>
          </div>

          {/* Login Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="company@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="mr-2 rounded border-gray-300 text-teal-600" />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-teal-600 hover:underline">Forgot password?</a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 bg-gradient-to-r from-teal-600 to-green-600 hover:shadow-lg disabled:opacity-50"
              >
                {isLoading ? 'Logging in...' : 'Login as Recruiter'}
              </button>
            </form>

            {/* Demo Recruiter Account */}
            <div className="mt-6 p-4 bg-teal-50 rounded-lg">
              <p className="text-sm text-teal-700 font-medium mb-2">Demo Recruiter Account:</p>
              <p className="text-xs text-gray-600">Email: recruiter@jobportal.com</p>
              <p className="text-xs text-gray-600">Password: 123456</p>
            </div>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have a recruiter account?{' '}
                <Link to="/register?role=recruiter" className="font-semibold text-teal-600 hover:underline">
                  Register as Recruiter
                </Link>
              </p>
            </div>

            {/* Back to Job Seeker Login */}
            <div className="mt-4 text-center">
              <Link to="/login" className="text-sm text-gray-500 hover:text-teal-600">
                ← Job Seeker Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterLoginPage; 