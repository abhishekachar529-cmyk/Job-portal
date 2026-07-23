// backend/src/models/Job.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a job title'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Please add company name'],
    trim: true
  },
  companyLogo: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: [true, 'Please add job description']
  },
  requirements: [{
    type: String
  }],
  responsibilities: [{
    type: String
  }],
  location: {
    type: String,
    required: [true, 'Please add location']
  },
  salaryMin: {
    type: Number,
    required: [true, 'Please add minimum salary']
  },
  salaryMax: {
    type: Number,
    required: [true, 'Please add maximum salary']
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Remote', 'Internship', 'Contract'],
    default: 'Full-time'
  },
  experienceLevel: {
    type: String,
    enum: ['Entry Level', 'Junior', 'Mid-Level', 'Senior', 'Lead'],
    default: 'Mid-Level'
  },
  skills: [{
    type: String
  }],
  // ✅ UPDATED: Category values match frontend
  category: {
    type: String,
    enum: ['IT & Software', 'Finance', 'Marketing', 'Design', 'Healthcare', 'Education'],
    default: 'IT & Software'
  },
  applicationDeadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Closed', 'Draft'],
    default: 'Active'
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  postedByName: {
    type: String,
    trim: true
  },
  applicantsCount: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// ✅ Text index for search
jobSchema.index({ title: 'text', description: 'text', company: 'text', location: 'text' });

// ✅ Index for category filter (improves performance)
jobSchema.index({ category: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ createdAt: -1 });

// ✅ Virtual field for salary range
jobSchema.virtual('salaryRange').get(function() {
  return `$${this.salaryMin}k - $${this.salaryMax}k`;
});

// ✅ Method to check if job is expired
jobSchema.methods.isExpired = function() {
  return new Date() > this.applicationDeadline;
};

// ✅ Static method to get active jobs
jobSchema.statics.getActiveJobs = function() {
  return this.find({ status: 'Active', applicationDeadline: { $gt: new Date() } });
};

module.exports = mongoose.model('Job', jobSchema);