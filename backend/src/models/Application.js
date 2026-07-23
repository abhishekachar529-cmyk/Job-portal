// backend/src/models/Application.js
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // ✅ Store job details directly for admin view
  jobTitle: {
    type: String,
    default: ''
  },
  company: {
    type: String,
    default: ''
  },
  applicantEmail: {
    type: String,
    default: ''
  },
  applicantName: {
    type: String,
    default: ''
  },
  resume: {
    type: String,
    default: ''
  },
  coverLetter: {
    type: String,
    default: ''
  },
  phoneNumber: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Pending', 'Shortlisted', 'Accepted', 'Rejected', 'Withdrawn'],
    default: 'Pending'
  },
  recruiterNotes: {
    type: String,
    default: ''
  },
  appliedDate: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date
  }
}, {
  timestamps: true
});

applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);