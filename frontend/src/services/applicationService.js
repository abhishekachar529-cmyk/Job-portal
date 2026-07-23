import api from './api';

const applicationService = {
  applyForJob: async (jobId, applicationData) => {
    const response = await api.post(`/applications/apply/${jobId}`, applicationData);
    return response.data;
  },

  getMyApplications: async () => {
    const response = await api.get('/applications/my-applications');
    return response.data;
  },

  getJobApplications: async (jobId) => {
    const response = await api.get(`/applications/job/${jobId}`);
    return response.data;
  },

  updateApplicationStatus: async (applicationId, status, recruiterNotes) => {
    const response = await api.put(`/applications/${applicationId}/status`, { status, recruiterNotes });
    return response.data;
  },

  bulkUpdateStatus: async (applicationIds, status) => {
    const response = await api.put('/applications/bulk/status', { applicationIds, status });
    return response.data;
  },

  withdrawApplication: async (applicationId) => {
    const response = await api.delete(`/applications/${applicationId}`);
    return response.data;
  }
};

export default applicationService;