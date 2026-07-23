import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase, FiGlobe, FiSave, FiUpload, FiX, FiCamera, FiCheckCircle } from 'react-icons/fi';
import { setUser } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [tempPhoto, setTempPhoto] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    skills: [],
    education: [],
    experience: [],
    companyName: '',
    companyWebsite: '',
    companyDescription: '',
    companyLogo: ''
  });
  
  const [newSkill, setNewSkill] = useState('');
  const [newEducation, setNewEducation] = useState({ degree: '', institution: '', year: '' });
  const [newExperience, setNewExperience] = useState({ title: '', company: '', startDate: '', endDate: '', current: false });
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [showExperienceForm, setShowExperienceForm] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        skills: user.skills || [],
        education: user.education || [],
        experience: user.experience || [],
        companyName: user.companyName || '',
        companyWebsite: user.companyWebsite || '',
        companyDescription: user.companyDescription || '',
        companyLogo: user.companyLogo || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload JPG, PNG or GIF image only');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      // Preview image
      const reader = new FileReader();
      reader.onload = (event) => {
        setTempPhoto(event.target.result);
        setShowPhotoModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmPhotoUpload = () => {
    setProfilePhoto(tempPhoto);
    setShowPhotoModal(false);
    
    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          toast.success('Profile photo updated successfully!');
          // Update user in localStorage and Redux
          const updatedUser = { ...user, profilePhoto: tempPhoto };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          dispatch(setUser({ user: updatedUser, token: localStorage.getItem('token') }));
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const removePhoto = () => {
    setProfilePhoto(null);
    const updatedUser = { ...user, profilePhoto: null };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    dispatch(setUser({ user: updatedUser, token: localStorage.getItem('token') }));
    toast.success('Profile photo removed');
  };

  // Skills management
  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setFormData({ ...formData, skills: formData.skills.filter((_, i) => i !== index) });
  };

  // Education management
  const addEducation = () => {
    if (newEducation.degree && newEducation.institution) {
      setFormData({ 
        ...formData, 
        education: [...formData.education, { ...newEducation, id: Date.now() }] 
      });
      setNewEducation({ degree: '', institution: '', year: '' });
      setShowEducationForm(false);
      toast.success('Education added');
    } else {
      toast.error('Please fill degree and institution');
    }
  };

  const removeEducation = (index) => {
    setFormData({ ...formData, education: formData.education.filter((_, i) => i !== index) });
    toast.success('Education removed');
  };

  // Experience management
  const addExperience = () => {
    if (newExperience.title && newExperience.company) {
      setFormData({ 
        ...formData, 
        experience: [...formData.experience, { ...newExperience, id: Date.now() }] 
      });
      setNewExperience({ title: '', company: '', startDate: '', endDate: '', current: false });
      setShowExperienceForm(false);
      toast.success('Experience added');
    } else {
      toast.error('Please fill title and company');
    }
  };

  const removeExperience = (index) => {
    setFormData({ ...formData, experience: formData.experience.filter((_, i) => i !== index) });
    toast.success('Experience removed');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const updatedUser = {
        ...user,
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio,
        skills: formData.skills,
        education: formData.education,
        experience: formData.experience,
        profilePhoto: profilePhoto,
        ...(user?.role === 'recruiter' && {
          companyName: formData.companyName,
          companyWebsite: formData.companyWebsite,
          companyDescription: formData.companyDescription
        })
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      dispatch(setUser({ user: updatedUser, token: localStorage.getItem('token') }));
      
      // Also update in users array
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map(u => u.email === user.email ? updatedUser : u);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      toast.success('Profile updated successfully!');
      setLoading(false);
    }, 1000);
  };

  // Photo Modal
  const PhotoModal = () => (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowPhotoModal(false)}></div>
        <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full transform transition-all">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Update Profile Photo</h2>
            <button onClick={() => setShowPhotoModal(false)} className="text-gray-400 hover:text-gray-600">
              <FiX size={24} />
            </button>
          </div>
          <div className="p-6">
            <div className="flex justify-center mb-6">
              <img src={tempPhoto} alt="Preview" className="w-32 h-32 rounded-full object-cover border-4 border-blue-500" />
            </div>
            <p className="text-center text-gray-600 mb-4">Do you want to update your profile photo?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowPhotoModal(false)} className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={confirmPhotoUpload} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Confirm</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
        <p className="text-gray-500 mb-8">Manage your personal information and professional details</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Photo Section */}
          <div className="bg-white rounded-2xl shadow-md p-8">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition shadow-lg"
                >
                  <FiCamera size={16} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/jpeg,image/jpg,image/png,image/gif"
                  className="hidden"
                />
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">Click the camera icon to change photo</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG or GIF. Max 5MB.</p>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                )}
                {profilePhoto && (
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="mt-2 text-sm text-red-600 hover:text-red-700"
                  >
                    Remove Photo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input type="email" value={formData.email} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50" readOnly />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="+1 234 567 8900" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="City, Country" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Tell us about yourself..."></textarea>
              </div>
            </div>
          </div>

          {/* Skills Section (for Job Seekers) */}
          {user?.role === 'seeker' && (
            <div className="bg-white rounded-2xl shadow-md p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Skills</h2>
              <div className="flex gap-2 mb-4">
                <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g., React, Node.js, Python" onKeyPress={(e) => e.key === 'Enter' && addSkill()} />
                <button type="button" onClick={addSkill} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    {skill}
                    <button type="button" onClick={() => removeSkill(idx)} className="text-red-500 hover:text-red-700"><FiX size={14} /></button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education Section (for Job Seekers) */}
          {user?.role === 'seeker' && (
            <div className="bg-white rounded-2xl shadow-md p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Education</h2>
                <button type="button" onClick={() => setShowEducationForm(!showEducationForm)} className="text-blue-600 hover:text-blue-700">+ Add Education</button>
              </div>
              {showEducationForm && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Degree" value={newEducation.degree} onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })} className="px-4 py-2 border rounded-lg" />
                    <input type="text" placeholder="Institution" value={newEducation.institution} onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })} className="px-4 py-2 border rounded-lg" />
                    <input type="text" placeholder="Year" value={newEducation.year} onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })} className="px-4 py-2 border rounded-lg" />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button type="button" onClick={() => setShowEducationForm(false)} className="px-4 py-2 border rounded-lg text-gray-700">Cancel</button>
                    <button type="button" onClick={addEducation} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button>
                  </div>
                </div>
              )}
              <div className="space-y-3">
                {formData.education.map((edu, idx) => (
                  <div key={edu.id || idx} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                    <div><p className="font-semibold">{edu.degree}</p><p className="text-sm text-gray-600">{edu.institution} • {edu.year}</p></div>
                    <button type="button" onClick={() => removeEducation(idx)} className="text-red-500 hover:text-red-700"><FiX /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience Section (for Job Seekers) */}
          {user?.role === 'seeker' && (
            <div className="bg-white rounded-2xl shadow-md p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Work Experience</h2>
                <button type="button" onClick={() => setShowExperienceForm(!showExperienceForm)} className="text-blue-600 hover:text-blue-700">+ Add Experience</button>
              </div>
              {showExperienceForm && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Job Title" value={newExperience.title} onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })} className="px-4 py-2 border rounded-lg" />
                    <input type="text" placeholder="Company" value={newExperience.company} onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })} className="px-4 py-2 border rounded-lg" />
                    <input type="date" placeholder="Start Date" value={newExperience.startDate} onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })} className="px-4 py-2 border rounded-lg" />
                    <input type="date" placeholder="End Date" value={newExperience.endDate} onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })} className="px-4 py-2 border rounded-lg" />
                  </div>
                  <label className="flex items-center mt-3"><input type="checkbox" checked={newExperience.current} onChange={(e) => setNewExperience({ ...newExperience, current: e.target.checked })} className="mr-2" /> I currently work here</label>
                  <div className="flex gap-2 mt-4"><button type="button" onClick={() => setShowExperienceForm(false)} className="px-4 py-2 border rounded-lg text-gray-700">Cancel</button><button type="button" onClick={addExperience} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button></div>
                </div>
              )}
              <div className="space-y-3">
                {formData.experience.map((exp, idx) => (
                  <div key={exp.id || idx} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                    <div><p className="font-semibold">{exp.title}</p><p className="text-sm text-gray-600">{exp.company} • {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p></div>
                    <button type="button" onClick={() => removeExperience(idx)} className="text-red-500 hover:text-red-700"><FiX /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Company Information (for Recruiters) */}
          {user?.role === 'recruiter' && (
            <div className="bg-white rounded-2xl shadow-md p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Company Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label><input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Company Website</label><input type="url" name="companyWebsite" value={formData.companyWebsite} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
                <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Company Description</label><textarea name="companyDescription" value={formData.companyDescription} onChange={handleChange} rows="3" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"></textarea></div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <button type="button" onClick={() => window.history.back()} className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"><FiSave /> {loading ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>

      {/* Photo Modal */}
      {showPhotoModal && <PhotoModal />}
    </div>
  );
};

export default ProfilePage;