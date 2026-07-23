// backend/src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  toggleUserBlock,
  deleteUser,
  getAllJobs,
  moderateJob,
  getAnalytics,
  getDashboardStats,
  getRecentUsers,
  getRecentJobs,
  getRecentApplications,
  getChartData,
  getCategoryStats,
  getAllApplications,      // ✅ ADD THIS
  updateApplicationStatus   // ✅ ADD THIS
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// ✅ All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// ===== Dashboard Routes =====
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/charts', getChartData);

// ===== User Routes =====
router.get('/users', getAllUsers);
router.get('/users/recent', getRecentUsers);
router.put('/users/:userId/toggle-block', toggleUserBlock);
router.delete('/users/:userId', deleteUser);

// ===== Job Routes =====
router.get('/jobs', getAllJobs);
router.get('/jobs/recent', getRecentJobs);
router.get('/jobs/category/stats', getCategoryStats);
router.delete('/jobs/:jobId', moderateJob);

// ===== Application Routes =====
router.get('/applications', getAllApplications);              // ✅ ADDED
router.get('/applications/recent', getRecentApplications);
router.patch('/applications/:id/status', updateApplicationStatus);  // ✅ ADDED

// ===== Analytics Routes =====
router.get('/analytics', getAnalytics);

module.exports = router;