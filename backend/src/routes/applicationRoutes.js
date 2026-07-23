// backend/src/routes/applicationRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// ✅ Import all controller functions
const {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication,
  bulkUpdateStatus
} = require('../controllers/applicationController');

// ===== Protected Routes =====
router.use(protect);

// ===== Apply for a job =====
router.post('/:jobId/apply', upload.single('resume'), applyForJob);

// ===== Get my applications =====
router.get('/my-applications', getMyApplications);

// ===== Get job applications (recruiter) =====
router.get('/job/:jobId/applications', getJobApplications);

// ===== Update application status =====
router.patch('/:applicationId/status', updateApplicationStatus);

// ===== Withdraw application =====
router.delete('/:applicationId', withdrawApplication);

// ===== Bulk update status =====
router.patch('/bulk-status', bulkUpdateStatus);

module.exports = router;