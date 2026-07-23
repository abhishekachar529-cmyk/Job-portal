// frontend/src/components/layout/Navbar.jsx
// ✅ SETTINGS REMOVED

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { 
  FiBriefcase, FiUser, FiLogOut, FiMenu, FiX, 
  FiChevronDown, FiHome, FiFileText
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isProfileOpen]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'seeker': return '/seeker/dashboard';
      case 'recruiter': return '/recruiter/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/';
    }
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg py-2' : 'bg-white shadow-md py-3'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
            <div className="bg-blue-600 p-2 rounded-lg">
              <FiBriefcase className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold text-blue-600">JobPortal</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`text-gray-700 hover:text-blue-600 ${isActive('/') ? 'text-blue-600 font-semibold' : ''}`}>
              Home
            </Link>
            <Link to="/jobs" className={`text-gray-700 hover:text-blue-600 ${isActive('/jobs') ? 'text-blue-600 font-semibold' : ''}`}>
              Find Jobs
            </Link>
            {user && user.role === 'recruiter' && (
              <Link to="/recruiter/post-job" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                + Post Job
              </Link>
            )}
          </div>
          
          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {/* Profile Dropdown */}
                <div className="relative profile-dropdown">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-700">{user.name?.split(' ')[0]}</span>
                    <FiChevronDown className={`text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                      <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                        <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full capitalize">
                          {user.role}
                        </span>
                      </div>
                      
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <FiUser className="mr-3 text-gray-400" />
                          <span>Your Profile</span>
                        </Link>
                        <Link
                          to={getDashboardLink()}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <FiFileText className="mr-3 text-gray-400" />
                          <span>Dashboard</span>
                        </Link>
                        {/* ❌ SETTINGS LINK REMOVED */}
                      </div>
                      
                      <div className="border-t">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <FiLogOut className="mr-3" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
                <Link to="/register" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX className="text-2xl text-gray-600" /> : <FiMenu className="text-2xl text-gray-600" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-100">
            <div className="space-y-1 pt-3">
              <Link
                to="/"
                className="block py-2 px-3 rounded-lg text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/jobs"
                className="block py-2 px-3 rounded-lg text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Find Jobs
              </Link>
              
              {user && user.role === 'recruiter' && (
                <Link
                  to="/recruiter/post-job"
                  className="block py-2 px-3 mt-2 bg-blue-50 text-blue-600 rounded-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  + Post Job
                </Link>
              )}
              
              <div className="border-t border-gray-100 my-3 pt-3">
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      className="block py-2 px-3 rounded-lg text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to={getDashboardLink()}
                      className="block py-2 px-3 rounded-lg text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left py-2 px-3 rounded-lg text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block py-2 px-3 rounded-lg text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block py-2 px-3 bg-blue-600 text-white rounded-lg mt-2 text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;