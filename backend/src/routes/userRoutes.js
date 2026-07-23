const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  uploadResume,
  saveJob,
  removeSavedJob,
  getDashboardStats
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('profilePhoto'), updateProfile);
router.post('/resume', protect, upload.single('resume'), uploadResume);
router.post('/save-job/:jobId', protect, saveJob);
router.delete('/save-job/:jobId', protect, removeSavedJob);
router.get('/dashboard-stats', protect, getDashboardStats);

module.exports = router;