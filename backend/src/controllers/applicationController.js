// backend/src/controllers/applicationController.js
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const mongoose = require('mongoose');

// ===== Apply for a job =====
const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;
    const { fullName, email, phoneNumber, coverLetter } = req.body;

    console.log('📝 Applying for job ID:', jobId);
    console.log('👤 User ID:', userId);

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid job ID format'
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const existingApplication = await Application.findOne({
      job: job._id,
      applicant: userId
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    if (job.status !== 'Active') {
      return res.status(400).json({
        success: false,
        message: 'This job is no longer accepting applications'
      });
    }

    let resumePath = '';
    if (req.file) {
      resumePath = req.file.path || req.file.filename || 'Resume uploaded';
    }

    const applicationData = {
      job: job._id,
      applicant: userId,
      jobTitle: job.title || 'Unknown Job',
      company: job.company || 'Unknown Company',
      applicantEmail: user.email || 'Unknown',
      applicantName: user.name || 'Unknown User',
      fullName: fullName || user.name,
      email: email || user.email,
      phoneNumber: phoneNumber || '',
      coverLetter: coverLetter || '',
      resume: resumePath || 'Resume uploaded',
      status: 'Pending',
      appliedDate: new Date()
    };

    const application = new Application(applicationData);
    await application.save();

    job.applicantsCount = (job.applicantsCount || 0) + 1;
    await job.save();

    console.log('✅ Application saved:', application._id);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });

  } catch (error) {
    console.error('❌ Error applying for job:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to apply for job',
      error: error.message
    });
  }
};

// ===== Get user's applications =====
const getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const applications = await Application.find({ applicant: userId })
      .populate('job', 'title company location salaryMin salaryMax jobType')
      .sort({ appliedDate: -1 });

    res.status(200).json({
      success: true,
      data: applications
    });
  } catch (error) {
    console.error('❌ Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications'
    });
  }
};

// ===== Get job applications (for recruiters) =====
const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status } = req.query;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view applications for this job'
      });
    }

    let query = { job: job._id };
    if (status) {
      query.status = status;
    }

    const applications = await Application.find(query)
      .populate('applicant', 'name email profilePhoto phone skills')
      .sort({ appliedDate: -1 });

    res.status(200).json({
      success: true,
      applications,
      jobTitle: job.title
    });
  } catch (error) {
    console.error('❌ Error fetching job applications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// ===== ✅ FIXED: Update application status =====
const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    console.log(`📝 Updating application ${applicationId} status to: ${status}`);

    // ✅ Validate status
    const validStatuses = ['Pending', 'Shortlisted', 'Accepted', 'Rejected', 'Withdrawn'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: Pending, Shortlisted, Accepted, Rejected, Withdrawn'
      });
    }

    // ✅ Find the application
    const application = await Application.findById(applicationId).populate('job');
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // ✅ Check if user is authorized
    const isRecruiter = application.job && application.job.postedBy.toString() === userId;
    const isAdmin = userRole === 'admin';

    if (!isRecruiter && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application'
      });
    }

    // ✅ Update the status
    application.status = status;
    application.reviewedAt = new Date();
    await application.save();

    console.log(`✅ Application status updated to: ${status}`);

    res.status(200).json({
      success: true,
      message: `Application ${status} successfully`,
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

// ===== Withdraw application =====
const withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.applicant.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const job = await Job.findById(application.job);
    if (job) {
      job.applicantsCount = Math.max(0, job.applicantsCount - 1);
      await job.save();
    }

    await application.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully'
    });
  } catch (error) {
    console.error('❌ Error withdrawing application:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// ===== Bulk update status =====
const bulkUpdateStatus = async (req, res) => {
  try {
    const { applicationIds, status } = req.body;

    if (!applicationIds || !applicationIds.length) {
      return res.status(400).json({
        success: false,
        message: 'No applications selected'
      });
    }

    const result = await Application.updateMany(
      { _id: { $in: applicationIds } },
      { status, reviewedAt: Date.now() }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} applications updated`
    });
  } catch (error) {
    console.error('❌ Error bulk updating applications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// ✅ ALL functions exported
module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication,
  bulkUpdateStatus  
};