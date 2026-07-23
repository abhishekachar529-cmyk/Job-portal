const User = require('../models/User');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('savedJobs');

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const allowedUpdates = [
      'name', 'phone', 'location', 'skills', 'education', 'experience',
      'companyName', 'companyWebsite', 'companyDescription', 'bio'
    ];

    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (req.file) {
      updates.profilePhoto = `/uploads/profiles/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { resume: `/uploads/resumes/${req.file.filename}` },
      { new: true }
    );

    res.status(200).json({
      success: true,
      resume: user.resume
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const saveJob = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.savedJobs.includes(req.params.jobId)) {
      return res.status(400).json({ success: false, message: 'Job already saved' });
    }

    user.savedJobs.push(req.params.jobId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Job saved successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const removeSavedJob = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.savedJobs = user.savedJobs.filter(
      jobId => jobId.toString() !== req.params.jobId
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Job removed from saved'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    if (req.user.role === 'seeker') {
      const applications = await Application.find({ applicant: req.user.id });
      const appliedJobsCount = applications.length;
      const savedJobsCount = req.user.savedJobs.length;

      const pendingCount = applications.filter(a => a.status === 'Pending').length;
      const shortlistedCount = applications.filter(a => a.status === 'Shortlisted').length;
      const acceptedCount = applications.filter(a => a.status === 'Accepted').length;
      const rejectedCount = applications.filter(a => a.status === 'Rejected').length;

      res.status(200).json({
        success: true,
        stats: {
          appliedJobsCount,
          savedJobsCount,
          pendingCount,
          shortlistedCount,
          acceptedCount,
          rejectedCount
        }
      });
    } else if (req.user.role === 'recruiter') {
      res.status(200).json({
        success: true,
        message: 'Use jobs endpoint for recruiter stats'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadResume,
  saveJob,
  removeSavedJob,
  getDashboardStats
};