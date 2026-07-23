// backend/src/routes/jobRoutes.js
const express = require('express');
const router = express.Router();
const {
  createJob,
  getJobs,
  getAllJobs,  // ✅ Import new function
  getJobById,
  updateJob,
  deleteJob,
  getRecruiterJobs,
  getCategoryStats
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

// Public Routes
router.get('/', getJobs);
router.get('/all', getAllJobs);  // ✅ NEW: Get all jobs without limit
router.get('/category/stats', getCategoryStats);
router.get('/:id', getJobById);

// Protected Routes
router.post('/', protect, authorize('recruiter', 'admin'), createJob);
router.get('/recruiter/my-jobs', protect, authorize('recruiter'), getRecruiterJobs);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);

module.exports = router;