import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiDollarSign, FiBriefcase, FiClock } from 'react-icons/fi';

const JobCard = ({ job }) => {
  const getJobTypeColor = (type) => {
    const colors = {
      'Full-time': 'bg-green-100 text-green-800',
      'Part-time': 'bg-blue-100 text-blue-800',
      'Remote': 'bg-purple-100 text-purple-800',
      'Internship': 'bg-yellow-100 text-yellow-800',
      'Contract': 'bg-orange-100 text-orange-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const formatSalary = (min, max) => {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  return (
    <div className="card hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {job.companyLogo ? (
            <img src={job.companyLogo} alt={job.company} className="w-12 h-12 rounded-lg object-cover" />
          ) : (
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-500 font-bold text-xl">
              {job.company?.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-lg hover:text-primary-500">
              <Link to={`/jobs/${job._id}`}>{job.title}</Link>
            </h3>
            <p className="text-gray-500 text-sm">{job.company}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-500 text-sm">
          <FiMapPin className="mr-2" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center text-gray-500 text-sm">
          <FiDollarSign className="mr-2" />
          <span>{formatSalary(job.salaryMin, job.salaryMax)} / year</span>
        </div>
        <div className="flex items-center text-gray-500 text-sm">
          <FiClock className="mr-2" />
          <span>{new Date(job.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`badge ${getJobTypeColor(job.jobType)}`}>
          <FiBriefcase className="inline mr-1 text-xs" />
          {job.jobType}
        </span>
        <span className="badge bg-gray-100 text-gray-800">
          {job.experienceLevel}
        </span>
      </div>

      <Link
        to={`/jobs/${job._id}`}
        className="block text-center btn-primary mt-2"
      >
        View Details
      </Link>
    </div>
  );
};

export default JobCard;