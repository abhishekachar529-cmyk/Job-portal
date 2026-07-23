import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FiBriefcase, FiUsers, FiAward, FiFileText, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'

function DashboardPage() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  // If no user, redirect to login
  if (!user) {
    navigate('/login')
    return null
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    toast.success('Logged out successfully')
    navigate('/')
  }

  // Admin Dashboard
  if (user.role === 'admin') {
    const adminStats = [
      { icon: <FiUsers className="text-4xl text-purple-600" />, value: '1,234', label: 'Total Users', color: 'bg-purple-50' },
      { icon: <FiBriefcase className="text-4xl text-blue-600" />, value: '567', label: 'Total Jobs', color: 'bg-blue-50' },
      { icon: <FiFileText className="text-4xl text-green-600" />, value: '2,345', label: 'Applications', color: 'bg-green-50' },
      { icon: <FiUsers className="text-4xl text-orange-600" />, value: '89', label: 'Companies', color: 'bg-orange-50' },
    ]

    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-purple-100 mt-1">Welcome back, {user.name}!</p>
              </div>
              <button onClick={handleLogout} className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100">Logout</button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {adminStats.map((stat, idx) => (
              <div key={idx} className={`${stat.color} rounded-xl p-6`}>
                <div className="flex items-center justify-between">
                  {stat.icon}
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                    <div className="text-gray-600 text-sm">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <p className="text-gray-500">Admin analytics and user management coming soon...</p>
          </div>
        </div>
      </div>
    )
  }

  // Recruiter Dashboard
  if (user.role === 'recruiter') {
    const recruiterStats = [
      { icon: <FiBriefcase className="text-4xl text-teal-600" />, value: '12', label: 'Active Jobs', color: 'bg-teal-50' },
      { icon: <FiUsers className="text-4xl text-blue-600" />, value: '156', label: 'Total Applicants', color: 'bg-blue-50' },
      { icon: <FiCheckCircle className="text-4xl text-green-600" />, value: '45', label: 'Shortlisted', color: 'bg-green-50' },
      { icon: <FiClock className="text-4xl text-orange-600" />, value: '8', label: 'Pending Review', color: 'bg-orange-50' },
    ]

    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-gradient-to-r from-teal-600 to-teal-800 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
                <p className="text-teal-100 mt-1">Welcome back, {user.name}!</p>
              </div>
              <button onClick={handleLogout} className="bg-white text-teal-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100">Logout</button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {recruiterStats.map((stat, idx) => (
              <div key={idx} className={`${stat.color} rounded-xl p-6`}>
                <div className="flex items-center justify-between">
                  {stat.icon}
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                    <div className="text-gray-600 text-sm">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Recent Job Posts</h2>
              <p className="text-gray-500">Your job postings will appear here...</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Recent Applicants</h2>
              <p className="text-gray-500">Recent applications will appear here...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Job Seeker Dashboard
  const seekerStats = [
    { icon: <FiFileText className="text-4xl text-blue-600" />, value: '8', label: 'Applied Jobs', color: 'bg-blue-50' },
    { icon: <FiBookmark className="text-4xl text-green-600" />, value: '12', label: 'Saved Jobs', color: 'bg-green-50' },
    { icon: <FiCheckCircle className="text-4xl text-purple-600" />, value: '3', label: 'Shortlisted', color: 'bg-purple-50' },
    { icon: <FiClock className="text-4xl text-orange-600" />, value: '2', label: 'In Progress', color: 'bg-orange-50' },
  ]

  const recentApplications = [
    { title: 'Frontend Developer', company: 'Tech Corp', status: 'Pending', date: '2024-01-15', statusColor: 'bg-yellow-100 text-yellow-700' },
    { title: 'Backend Engineer', company: 'Software Inc', status: 'Shortlisted', date: '2024-01-10', statusColor: 'bg-green-100 text-green-700' },
    { title: 'UI/UX Designer', company: 'Creative Studio', status: 'Rejected', date: '2024-01-05', statusColor: 'bg-red-100 text-red-700' },
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">My Dashboard</h1>
              <p className="text-blue-100 mt-1">Welcome back, {user.name}!</p>
            </div>
            <button onClick={handleLogout} className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100">Logout</button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {seekerStats.map((stat, idx) => (
            <div key={idx} className={`${stat.color} rounded-xl p-6 transition hover:scale-105 duration-300`}>
              <div className="flex items-center justify-between">
                {stat.icon}
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">Recent Applications</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentApplications.map((app, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{app.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{app.company}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{app.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${app.statusColor}`}>{app.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommended Jobs */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recommended For You</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <h3 className="font-bold text-lg text-gray-800 mb-2">Senior Developer</h3>
                <p className="text-gray-500 text-sm mb-2">Tech Corp • New York</p>
                <p className="text-gray-600 text-sm mb-4">$120k - $150k • Full-time</p>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">Apply Now</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage