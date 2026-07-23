// backend/src/controllers/jobController.js
const Job = require('../models/Job');
const Application = require('../models/Application');

// ✅ Helper function to validate category
const validateCategory = (category) => {
  const validCategories = ['IT & Software', 'Finance', 'Marketing', 'Design', 'Healthcare', 'Education'];
  if (!category) return 'IT & Software';
  if (validCategories.includes(category)) return category;
  const categoryMap = {
    'IT': 'IT & Software',
    'Finance': 'Finance',
    'Marketing': 'Marketing',
    'Design': 'Design',
    'Healthcare': 'Healthcare',
    'Education': 'Education'
  };
  return categoryMap[category] || 'IT & Software';
};

// ===== Create a new job =====
const createJob = async (req, res) => {
  try {
    console.log('📥 Received job data:', req.body);

    if (req.body.category) {
      req.body.category = validateCategory(req.body.category);
    }

    req.body.postedBy = req.user.id;

    if (req.user.role === 'recruiter') {
      req.body.company = req.user.companyName || req.body.company;
    }

    const requiredFields = ['title', 'company', 'location', 'description', 'salaryMin', 'salaryMax', 'applicationDeadline'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `Missing required field: ${field}`
        });
      }
    }

    if (parseInt(req.body.salaryMin) > parseInt(req.body.salaryMax)) {
      return res.status(400).json({
        success: false,
        message: 'Minimum salary cannot be greater than maximum salary'
      });
    }

    const job = await Job.create(req.body);

    console.log('✅ Job created successfully:', job._id);

    res.status(201).json({
      success: true,
      job
    });
  } catch (error) {
    console.error('❌ Error creating job:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A job with this title already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// ===== Get all jobs - FIXED: NO LIMIT =====
const getJobs = async (req, res) => {
  try {
    const {
      search,
      location,
      jobType,
      experienceLevel,
      category,
      minSalary,
      maxSalary,
      page = 1,
      limit = 100,  // ✅ CHANGED: Show up to 100 jobs per page
      sort = '-createdAt'
    } = req.query;

    let query = { status: 'Active' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } }
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    if (category) {
      const validCategory = validateCategory(category);
      query.category = validCategory;
    }

    if (minSalary || maxSalary) {
      query.salaryMin = {};
      if (minSalary) query.salaryMin.$gte = parseInt(minSalary);
      if (maxSalary) query.salaryMax = { $lte: parseInt(maxSalary) };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // ✅ Get ALL jobs with the limit
    const jobs = await Job.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('postedBy', 'name email companyName');

    const total = await Job.countDocuments(query);

    console.log(`📊 Found ${total} jobs, returning ${jobs.length}`);

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
    console.error('❌ Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// ===== Get ALL jobs (no pagination) - NEW =====
const getAllJobs = async (req, res) => {
  try {
    console.log('📤 Fetching ALL jobs (no limit)...');
    
    const jobs = await Job.find({ status: 'Active' })
      .sort({ createdAt: -1 })
      .populate('postedBy', 'name email companyName');

    console.log(`✅ Found ${jobs.length} jobs`);

    res.status(200).json({
      success: true,
      jobs
    });
  } catch (error) {
    console.error('❌ Error fetching all jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// ===== Get job by ID =====
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name email companyName companyLogo');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    job.views += 1;
    await job.save();

    res.status(200).json({
      success: true,
      job
    });
  } catch (error) {
    console.error('❌ Error fetching job:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid job ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// ===== Update job =====
const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    if (req.body.category) {
      req.body.category = validateCategory(req.body.category);
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      job
    });
  } catch (error) {
    console.error('❌ Error updating job:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// ===== Delete job =====
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    await Application.deleteMany({ job: req.params.id });
    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting job:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// ===== Get recruiter's jobs =====
const getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id })
      .sort('-createdAt')
      .populate('postedBy', 'name');

    const jobsWithCounts = await Promise.all(jobs.map(async (job) => {
      const count = await Application.countDocuments({ job: job._id });
      return {
        ...job.toObject(),
        applicantsCount: count
      };
    }));

    res.status(200).json({
      success: true,
      jobs: jobsWithCounts
    });
  } catch (error) {
    console.error('❌ Error fetching recruiter jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// ===== Get category statistics =====
const getCategoryStats = async (req, res) => {
  try {
    const stats = await Job.aggregate([
      { $match: { status: 'Active' } },
      { $group: {
        _id: '$category',
        count: { $sum: 1 }
      }},
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
      message: 'Server error'
    });
  }
};

module.exports = {
  createJob,
  getJobs,
  getAllJobs,  // ✅ NEW: Get all jobs without limit
  getJobById,
  updateJob,
  deleteJob,
  getRecruiterJobs,
  getCategoryStats
};