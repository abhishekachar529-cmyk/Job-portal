// frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiBriefcase, FiShield, FiEye, FiEyeOff, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/slices/authSlice';
import axios from 'axios';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('seeker');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Get redirect path from URL
  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';

  // API URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // ✅ Role info for display
  const roleInfo = {
    seeker: {
      label: 'Job Seeker',
      icon: FiUser,
      color: 'blue',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-200',
      description: '🔍 Find your dream job and track applications',
      badge: '🔍'
    },
    recruiter: {
      label: 'Recruiter',
      icon: FiBriefcase,
      color: 'green',
      bg: 'bg-green-50',
      text: 'text-green-600',
      border: 'border-green-200',
      description: '📢 Post jobs and find the best talent',
      badge: '💼'
    },
    admin: {
      label: 'Admin',
      icon: FiShield,
      color: 'purple',
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-200',
      description: '⚙️ Manage users, jobs, and platform analytics',
      badge: '👑'
    }
  };

  // Validation functions
  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    const error = field === 'email' ? validateEmail(email) : validatePassword(password);
    setErrors({ ...errors, [field]: error });
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setLoginError('');
    if (errors.email) {
      setErrors({ ...errors, email: '' });
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setLoginError('');
    if (errors.password) {
      setErrors({ ...errors, password: '' });
    }
  };

  const getInputClass = (field) => {
    const isTouched = touched[field];
    const error = errors[field];
    const baseClass = "w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200";
    
    if (!isTouched) {
      return `${baseClass} border-gray-300 focus:ring-blue-500 focus:border-blue-500`;
    }
    if (error) {
      return `${baseClass} border-red-400 focus:ring-red-500 focus:border-red-500 bg-red-50`;
    }
    return `${baseClass} border-green-400 focus:ring-green-500 focus:border-green-500 bg-green-50`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    // Validate all fields
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    setTouched({ email: true, password: true });
    setErrors({ email: emailError, password: passwordError });
    
    if (emailError || passwordError) {
      toast.error('Please fix all validation errors');
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔑 Attempting login for:', email);
      console.log('📡 API URL:', API_URL);
      console.log('👤 Selected Role:', selectedRole);

      // ✅ Make API call to backend (MongoDB)
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
        role: selectedRole // ✅ Send selected role to backend
      });

      console.log('📥 Login response:', response.data);

      if (response.data.success) {
        const { token, user } = response.data;

        // ✅ ROLE VALIDATION: Check if role matches
        if (user.role !== selectedRole) {
          const actualRoleInfo = roleInfo[user.role] || { label: user.role, badge: '👤' };
          const selectedRoleInfo = roleInfo[selectedRole] || { label: selectedRole, badge: '👤' };
          
          const errorMsg = `⚠️ This account is registered as ${actualRoleInfo.badge} ${actualRoleInfo.label}. Please select the correct role tab.`;
          setLoginError(errorMsg);
          toast.error(errorMsg, {
            duration: 5000,
            position: 'top-center',
          });
          setIsLoading(false);
          return;
        }

        // ✅ Store token properly
        localStorage.setItem('token', token.trim());
        localStorage.setItem('user', JSON.stringify(user));
        
        // Update Redux state
        dispatch(setUser({ user, token }));

        const roleInfoWelcome = roleInfo[user.role] || { label: user.role, badge: '👤' };
        console.log('✅ Login successful!');
        toast.success(`${roleInfoWelcome.badge} Welcome back, ${user.name}!`, {
          duration: 3000,
          position: 'top-center',
        });

        // ✅ Redirect based on role or redirect path
        setTimeout(() => {
          if (redirectPath && redirectPath !== '/') {
            navigate(redirectPath);
          } else if (user.role === 'seeker') {
            navigate('/seeker/dashboard');
          } else if (user.role === 'recruiter') {
            navigate('/recruiter/dashboard');
          } else if (user.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/');
          }
        }, 800);
      } else {
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        
        if (error.response.status === 401) {
          const errorMsg = '❌ Invalid email or password';
          setLoginError(errorMsg);
          toast.error(errorMsg);
        } else if (error.response.status === 400) {
          const errorMsg = error.response.data?.message || 'Bad request';
          setLoginError(errorMsg);
          toast.error(errorMsg);
        } else {
          const errorMsg = error.response.data?.message || 'Login failed. Please try again.';
          setLoginError(errorMsg);
          toast.error(errorMsg);
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
        const errorMsg = 'Cannot connect to server. Please make sure backend is running.';
        setLoginError(errorMsg);
        toast.error(errorMsg);
      } else {
        console.error('Error:', error.message);
        const errorMsg = 'Login failed. Please try again.';
        setLoginError(errorMsg);
        toast.error(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Get role color
  const getRoleColor = (role) => {
    const colors = {
      seeker: { bg: 'bg-blue-600', hover: 'hover:bg-blue-700', light: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
      recruiter: { bg: 'bg-green-600', hover: 'hover:bg-green-700', light: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
      admin: { bg: 'bg-purple-600', hover: 'hover:bg-purple-700', light: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' }
    };
    return colors[role] || colors.seeker;
  };

  const roleColor = getRoleColor(selectedRole);
  const currentRoleInfo = roleInfo[selectedRole] || roleInfo.seeker;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl shadow-lg mb-4">
            <FiBriefcase className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">JobPortal</h1>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Role Selection Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1">
            <button
              onClick={() => {
                setSelectedRole('seeker');
                setLoginError('');
              }}
              className={`flex items-center justify-center space-x-2 py-3 rounded-lg transition-all duration-300 ${
                selectedRole === 'seeker' 
                  ? 'bg-blue-600 text-white shadow-md scale-105' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FiUser className="text-sm" />
              <span className="text-sm font-medium">Job Seeker</span>
            </button>
            <button
              onClick={() => {
                setSelectedRole('recruiter');
                setLoginError('');
              }}
              className={`flex items-center justify-center space-x-2 py-3 rounded-lg transition-all duration-300 ${
                selectedRole === 'recruiter' 
                  ? 'bg-green-600 text-white shadow-md scale-105' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FiBriefcase className="text-sm" />
              <span className="text-sm font-medium">Recruiter</span>
            </button>
            <button
              onClick={() => {
                setSelectedRole('admin');
                setLoginError('');
              }}
              className={`flex items-center justify-center space-x-2 py-3 rounded-lg transition-all duration-300 ${
                selectedRole === 'admin' 
                  ? 'bg-purple-600 text-white shadow-md scale-105' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FiShield className="text-sm" />
              <span className="text-sm font-medium">Admin</span>
            </button>
          </div>

          {/* ✅ Role Description with Badge */}
          <div className={`px-6 py-3 text-center text-sm font-medium ${
            selectedRole === 'seeker' ? 'bg-blue-50 text-blue-700' :
            selectedRole === 'recruiter' ? 'bg-green-50 text-green-700' :
            'bg-purple-50 text-purple-700'
          }`}>
            <span className="mr-2">{currentRoleInfo.badge}</span>
            {currentRoleInfo.description}
          </div>

          {/* Login Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* ✅ Role Indicator */}
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-sm text-gray-600">Logging in as:</span>
                <span className={`text-sm font-semibold ${currentRoleInfo.text}`}>
                  {currentRoleInfo.badge} {currentRoleInfo.label}
                </span>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={() => handleBlur('email')}
                    required
                    className={getInputClass('email')}
                    placeholder="Enter your email"
                  />
                  {touched.email && !errors.email && email && (
                    <FiCheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />
                  )}
                </div>
                {touched.email && errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
                {touched.email && !errors.email && email && (
                  <p className="text-green-500 text-xs mt-1">✓ Valid email address</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={() => handleBlur('password')}
                    required
                    className={getInputClass('password')}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                  {touched.password && !errors.password && password && (
                    <FiCheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />
                  )}
                </div>
                {touched.password && errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
                {touched.password && !errors.password && password && (
                  <p className="text-green-500 text-xs mt-1">✓ Valid password</p>
                )}
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>

              {/* ✅ Role Error Message */}
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{loginError}</p>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 ${roleColor.bg} ${roleColor.hover} disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-[1.02] flex items-center justify-center gap-2`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in as {currentRoleInfo.label}...
                  </>
                ) : (
                  <>
                    {currentRoleInfo.badge} Login as {currentRoleInfo.label}
                  </>
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-blue-600 hover:underline">
                  Create an account
                </Link>
              </p>
            </div>

            {/* Debug Info */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500">
                🔗 API: {API_URL}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                🔑 Token: {localStorage.getItem('token') ? '✅ Present' : '❌ Not found'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                👤 Selected Role: <span className="font-semibold">{selectedRole}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;