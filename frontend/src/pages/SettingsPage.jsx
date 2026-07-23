// frontend/src/pages/SettingsPage.jsx
console.log('🔥🔥🔥 SETTINGS PAGE IS LOADING!');

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  FiUser, FiBell, FiLock, FiGlobe, FiMoon, FiSun, 
  FiSave, FiShield, FiMail, FiPhone, FiMapPin, 
  FiBriefcase, FiDollarSign, FiAlertCircle, FiCheckCircle,
  FiTrash2, FiLogOut, FiEye, FiEyeOff
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Profile Settings
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: ''
  });
  
  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    jobAlerts: true,
    applicationUpdates: true,
    recruiterMessages: true,
    marketingEmails: false
  });
  
  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    showLocation: true
  });
  
  // Password Settings
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  
  // Appearance Settings
  const [appearance, setAppearance] = useState({
    theme: localStorage.getItem('theme') || 'light',
    compactView: false,
    animations: true
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  // Load saved notification settings
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notificationSettings');
    if (savedNotifications) {
      setNotificationSettings(JSON.parse(savedNotifications));
    }
  }, []);

  // Handle theme change
  useEffect(() => {
    if (appearance.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', appearance.theme);
  }, [appearance.theme]);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleNotificationChange = (key) => {
    const newSettings = { ...notificationSettings, [key]: !notificationSettings[key] };
    setNotificationSettings(newSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
  };

  const handlePrivacyChange = (key, value) => {
    setPrivacySettings({ ...privacySettings, [key]: value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    if (passwordErrors[e.target.name]) {
      setPasswordErrors({ ...passwordErrors, [e.target.name]: '' });
    }
  };

  const validatePassword = () => {
    const errors = {};
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateProfile = () => {
    setLoading(true);
    setTimeout(() => {
      const updatedUser = { ...user, ...profileData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update in users array
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map(u => u.email === user.email ? updatedUser : u);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      dispatch(setUser({ user: updatedUser, token: localStorage.getItem('token') }));
      toast.success('Profile updated successfully!');
      setLoading(false);
    }, 1000);
  };

  const handleChangePassword = () => {
    if (!validatePassword()) return;
    
    setLoading(true);
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.email === user.email);
      
      if (users[userIndex] && users[userIndex].password === passwordData.currentPassword) {
        users[userIndex].password = passwordData.newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        
        toast.success('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error('Current password is incorrect');
      }
      setLoading(false);
    }, 1000);
  };

  const handleDeleteAccount = () => {
    setLoading(true);
    setTimeout(() => {
      // Remove user from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.filter(u => u.email !== user.email);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Remove current session
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      toast.success('Account deleted successfully');
      navigate('/register');
      setLoading(false);
    }, 1000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: <FiUser /> },
    { id: 'notifications', label: 'Notifications', icon: <FiBell /> },
    { id: 'security', label: 'Security', icon: <FiLock /> },
    { id: 'privacy', label: 'Privacy', icon: <FiShield /> },
    { id: 'appearance', label: 'Appearance', icon: <FiGlobe /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account preferences and settings</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-xl shadow-md p-4 sticky top-24">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
              
              <div className="border-t my-4 pt-4">
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
                >
                  <FiTrash2 className="text-lg" />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h2>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input type="text" name="name" value={profileData.name} onChange={handleProfileChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input type="email" value={profileData.email} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50" readOnly />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <div className="relative">
                        <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input type="tel" name="phone" value={profileData.phone} onChange={handleProfileChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <div className="relative">
                        <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input type="text" name="location" value={profileData.location} onChange={handleProfileChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                      <textarea name="bio" value={profileData.bio} onChange={handleProfileChange} rows="4" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Tell us about yourself..."></textarea>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button onClick={handleUpdateProfile} disabled={loading} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                      <FiSave /> {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                    { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive push notifications in browser' },
                    { key: 'jobAlerts', label: 'Job Alerts', desc: 'Get notified about new job matches' },
                    { key: 'applicationUpdates', label: 'Application Updates', desc: 'Get updates about your applications' },
                    { key: 'recruiterMessages', label: 'Recruiter Messages', desc: 'Receive messages from recruiters' },
                    { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Receive promotional emails and offers' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-3 border-b">
                      <div><h3 className="font-medium text-gray-800">{item.label}</h3><p className="text-sm text-gray-500">{item.desc}</p></div>
                      <button onClick={() => handleNotificationChange(item.key)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notificationSettings[item.key] ? 'bg-blue-600' : 'bg-gray-300'}`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationSettings[item.key] ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input type={showPassword ? 'text' : 'password'} name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300'}`} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">{showPassword ? <FiEyeOff /> : <FiEye />}</button>
                    </div>
                    {passwordErrors.currentPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.currentPassword}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300'}`} />
                    {passwordErrors.newPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <div className="relative">
                      <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`} />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">{showConfirmPassword ? <FiEyeOff /> : <FiEye />}</button>
                    </div>
                    {passwordErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword}</p>}
                  </div>
                  <button onClick={handleChangePassword} disabled={loading} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">{loading ? 'Updating...' : 'Update Password'}</button>
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeTab === 'privacy' && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Privacy Settings</h2>
                <div className="space-y-6">
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label><select value={privacySettings.profileVisibility} onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg"><option value="public">Public - Everyone can see your profile</option><option value="recruiters">Recruiters Only</option><option value="private">Private - Only you</option></select></div>
                  <div className="flex items-center justify-between py-3 border-b"><div><h3 className="font-medium text-gray-800">Show Email on Profile</h3><p className="text-sm text-gray-500">Display your email address on your public profile</p></div><button onClick={() => handlePrivacyChange('showEmail', !privacySettings.showEmail)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${privacySettings.showEmail ? 'bg-blue-600' : 'bg-gray-300'}`}><span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${privacySettings.showEmail ? 'translate-x-6' : 'translate-x-1'}`} /></button></div>
                  <div className="flex items-center justify-between py-3 border-b"><div><h3 className="font-medium text-gray-800">Show Phone on Profile</h3><p className="text-sm text-gray-500">Display your phone number on your public profile</p></div><button onClick={() => handlePrivacyChange('showPhone', !privacySettings.showPhone)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${privacySettings.showPhone ? 'bg-blue-600' : 'bg-gray-300'}`}><span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${privacySettings.showPhone ? 'translate-x-6' : 'translate-x-1'}`} /></button></div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Appearance</h2>
                <div className="space-y-6">
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Theme</label><div className="grid grid-cols-2 gap-4"><button onClick={() => setAppearance({ ...appearance, theme: 'light' })} className={`p-4 border-2 rounded-lg flex items-center justify-center gap-2 ${appearance.theme === 'light' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}><FiSun /> Light Mode</button><button onClick={() => setAppearance({ ...appearance, theme: 'dark' })} className={`p-4 border-2 rounded-lg flex items-center justify-center gap-2 ${appearance.theme === 'dark' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}><FiMoon /> Dark Mode</button></div></div>
                  <div className="flex items-center justify-between py-3 border-b"><div><h3 className="font-medium text-gray-800">Compact View</h3><p className="text-sm text-gray-500">Show more content by reducing spacing</p></div><button onClick={() => setAppearance({ ...appearance, compactView: !appearance.compactView })} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${appearance.compactView ? 'bg-blue-600' : 'bg-gray-300'}`}><span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${appearance.compactView ? 'translate-x-6' : 'translate-x-1'}`} /></button></div>
                  <div className="flex items-center justify-between py-3 border-b"><div><h3 className="font-medium text-gray-800">Animations</h3><p className="text-sm text-gray-500">Enable smooth animations throughout the site</p></div><button onClick={() => setAppearance({ ...appearance, animations: !appearance.animations })} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${appearance.animations ? 'bg-blue-600' : 'bg-gray-300'}`}><span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${appearance.animations ? 'translate-x-6' : 'translate-x-1'}`} /></button></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowDeleteConfirm(false)}></div>
            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiAlertCircle className="text-red-600 text-3xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Delete Account</h2>
                <p className="text-gray-600 mb-6">Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                  <button onClick={handleDeleteAccount} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete Account</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;