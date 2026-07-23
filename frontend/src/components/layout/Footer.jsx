import React from 'react';
import { Link } from 'react-router-dom';
import { FiBriefcase, FiFacebook, FiTwitter, FiLinkedin, FiGithub } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg"><FiBriefcase className="text-white" /></div>
              <span className="text-xl font-bold text-white">JobPortal</span>
            </div>
            <p className="text-sm">Find your dream job with thousands of opportunities.</p>
          </div>
          <div><h3 className="text-white font-semibold mb-4">Quick Links</h3><ul className="space-y-2 text-sm"><li><Link to="/jobs" className="hover:text-white">Browse Jobs</Link></li><li><Link to="/register" className="hover:text-white">Register</Link></li><li><Link to="/login" className="hover:text-white">Login</Link></li></ul></div>
          <div><h3 className="text-white font-semibold mb-4">For Employers</h3><ul className="space-y-2 text-sm"><li><Link to="/recruiter/post-job" className="hover:text-white">Post a Job</Link></li><li><Link to="/recruiter/dashboard" className="hover:text-white">Recruiter Dashboard</Link></li></ul></div>
          <div><h3 className="text-white font-semibold mb-4">Contact</h3><ul className="space-y-2 text-sm"><li>Email: support@jobportal.com</li><li>Phone: +1 234 567 890</li></ul></div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm"><p>&copy; 2025 JobPortal. All rights reserved.</p></div>
      </div>
    </footer>
  );
};

export default Footer;