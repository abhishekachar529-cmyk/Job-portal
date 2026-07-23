// backend/src/controllers/adminController.js
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// ===== Get All Users =====
const getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    let query = {};

    if (role && role !== 'all') {
      query.role = role;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ===== Toggle User Block =====
const toggleUserBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot block admin users' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'blocked'} successfully`,
      isActive: user.isActive
    });
  } catch (error) {
    console.error('Error in toggleUserBlock:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ===== Delete User =====
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot delete admin users' });
    }

    await Application.deleteMany({ applicant: user._id });

    if (user.role === 'recruiter') {
      await Job.deleteMany({ postedBy: user._id });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteUser:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ===== Get All Jobs =====
const getAllJobs = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const jobs = await Job.find(query)
      .populate('postedBy', 'name email')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error in getAllJobs:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ===== Moderate Job (Delete) =====
const moderateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    await Application.deleteMany({ job: job._id });
    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job removed successfully'
    });
  } catch (error) {
    console.error('Error in moderateJob:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ===== Get Analytics =====
const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSeekers = await User.countDocuments({ role: 'seeker' });
    const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'Active' });
    const totalApplications = await Application.countDocuments();

    const recentUsers = await User.find()
      .select('-password')
      .sort('-createdAt')
      .limit(5);

    const recentJobs = await Job.find()
      .populate('postedBy', 'name')
      .sort('-createdAt')
      .limit(5);

    const jobsByCategory = await Job.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const applicationsByStatus = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        totalSeekers,
        totalRecruiters,
        totalJobs,
        activeJobs,
        totalApplications,
        recentUsers,
        recentJobs,
        jobsByCategory,
        applicationsByStatus
      }
    });
  } catch (error) {
    console.error('Error in getAnalytics:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ===== Get Dashboard Stats =====
const getDashboardStats = async (req, res) => {
  try {
    console.log('📊 Fetching dashboard stats...');

    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'Pending' });
    const activeJobs = await Job.countDocuments({ status: 'Active' });
    const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
    const totalSeekers = await User.countDocuments({ role: 'seeker' });
    const adminCount = await User.countDocuments({ role: 'admin' });

    console.log('✅ Stats fetched:', {
      totalUsers,
      totalJobs,
      totalApplications,
      pendingApplications,
      activeJobs,
      totalRecruiters,
      totalSeekers,
      adminCount
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalJobs,
        totalApplications,
        pendingApplications,
        activeJobs,
        totalRecruiters,
        totalSeekers,
        adminCount
      }
    });
  } catch (error) {
    console.error('❌ Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats'
    });
  }
};

// ===== Get Recent Users =====
const getRecentUsers = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('❌ Error fetching recent users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent users'
    });
  }
};

// ===== Get Recent Jobs =====
const getRecentJobs = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('postedBy', 'name email');

    res.status(200).json({
      success: true,
      data: jobs
    });
  } catch (error) {
    console.error('❌ Error fetching recent jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent jobs'
    });
  }
};

// ===== Get Recent Applications =====
const getRecentApplications = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const applications = await Application.find()
      .sort({ appliedDate: -1 })
      .limit(parseInt(limit))
      .populate('job', 'title company')
      .populate('applicant', 'name email');

    res.status(200).json({
      success: true,
      data: applications
    });
  } catch (error) {
    console.error('❌ Error fetching recent applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent applications'
    });
  }
};

// ===== Get Chart Data =====
const getChartData = async (req, res) => {
  try {
    console.log('📊 Fetching chart data...');

    // Get last 6 months
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now);
      d.setMonth(d.getMonth() - i);
      months.push({
        month: d.toLocaleString('default', { month: 'short' }),
        year: d.getFullYear(),
        start: new Date(d.getFullYear(), d.getMonth(), 1),
        end: new Date(d.getFullYear(), d.getMonth() + 1, 0)
      });
    }

    // Get user growth data
    const userGrowth = await Promise.all(months.map(async (m) => {
      const users = await User.countDocuments({
        createdAt: { $gte: m.start, $lte: m.end }
      });
      const jobs = await Job.countDocuments({
        createdAt: { $gte: m.start, $lte: m.end }
      });
      return {
        month: m.month,
        users,
        jobs
      };
    }));

    // Get application status distribution
    const statusData = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusColors = {
      'Pending': '#F59E0B',
      'Shortlisted': '#10B981',
      'Accepted': '#2563EB',
      'Rejected': '#EF4444',
      'Withdrawn': '#6B7280'
    };

    const applicationStatus = statusData.map(item => ({
      name: item._id || 'Pending',
      value: item.count,
      color: statusColors[item._id] || '#6B7280'
    }));

    // If no data, provide default
    if (applicationStatus.length === 0) {
      applicationStatus.push(
        { name: 'Pending', value: 1, color: '#F59E0B' }
      );
    }

    console.log('✅ Chart data fetched:', { userGrowth, applicationStatus });

    res.status(200).json({
      success: true,
      data: {
        userGrowth,
        applicationStatus,
        applicationTrends: userGrowth
      }
    });
  } catch (error) {
    console.error('❌ Error fetching chart data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chart data'
    });
  }
};

// ===== Get Category Stats =====
const getCategoryStats = async (req, res) => {
  try {
    const stats = await Job.aggregate([
      { $match: { status: 'Active' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('❌ Error fetching category stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category stats'
    });
  }
};

// ===== Get All Applications (Admin) =====
const getAllApplications = async (req, res) => {
  try {
    console.log('📡 Fetching all applications for admin...');
    
    // ✅ Find with populate
    const applications = await Application.find()
      .sort({ appliedDate: -1 })
      .populate('job', 'title company location')
      .populate('applicant', 'name email');
    
    console.log(`✅ Found ${applications.length} applications in database`);
    
    // ✅ Format the response
    const formattedApplications = applications.map(app => {
      // Safely get values
      const jobTitle = app.jobTitle || (app.job ? app.job.title : 'Unknown Job');
      const company = app.company || (app.job ? app.job.company : 'Unknown Company');
      const email = app.applicantEmail || (app.applicant ? app.applicant.email : 'Unknown');
      const userName = app.applicantName || (app.applicant ? app.applicant.name : 'Unknown User');
      
      return {
        _id: app._id,
        jobTitle: jobTitle,
        company: company,
        email: email,
        userName: userName,
        status: app.status || 'Pending',
        appliedDate: app.appliedDate || app.createdAt,
        coverLetter: app.coverLetter || '',
        phoneNumber: app.phoneNumber || '',
        jobId: app.job ? app.job._id : null,
        userId: app.applicant ? app.applicant._id : null
      };
    });
    
    res.status(200).json({
      success: true,
      data: formattedApplications,
      count: formattedApplications.length
    });
  } catch (error) {
    console.error('❌ Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: error.message
    });
  }
};

// ===== Update Application Status (Admin) =====
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    console.log(`📝 Updating application ${id} status to: ${status}`);
    
    const validStatuses = ['Pending', 'Shortlisted', 'Accepted', 'Rejected', 'Withdrawn'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: Pending, Shortlisted, Accepted, Rejected, Withdrawn'
      });
    }
    
    const application = await Application.findByIdAndUpdate(
      id,
      { status, reviewedAt: new Date() },
      { new: true }
    );
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    console.log(`✅ Application status updated to: ${status}`);
    
    res.status(200).json({
      success: true,
      message: `Application status updated to ${status}`,
      data: application
    });
  } catch (error) {
    console.error('❌ Error updating application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update application status',
      error: error.message
    });
  }
};

module.exports = {
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
  getAllApplications,
  updateApplicationStatus
};