import api from './api';

const userService = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },

  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    const response = await api.post('/users/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  saveJob: async (jobId) => {
    const response = await api.post(`/users/save-job/${jobId}`);
    return response.data;
  },

  removeSavedJob: async (jobId) => {
    const response = await api.delete(`/users/save-job/${jobId}`);
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/users/dashboard-stats');
    return response.data;
  }
};

export default userService;