import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiShield, FiLock, FiUsers, FiDatabase } from 'react-icons/fi';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link to="/register" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <FiArrowLeft className="mr-2" /> Back to Registration
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
            <p className="text-blue-100 mt-2">Last updated: June 9, 2025</p>
          </div>

          <div className="p-8">
            <div className="prose max-w-none">
              <div className="bg-blue-50 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-3">Welcome to JobPortal!</h2>
                <p className="text-gray-600">By using our platform, you agree to these terms. Please read them carefully.</p>
              </div>

              {/* Section 1 */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <FiUsers className="text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">1. Account Registration</h2>
                </div>
                <p className="text-gray-600 mb-3">To use JobPortal, you must create an account. You agree to:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Provide accurate and complete information</li>
                  <li>Keep your login credentials confidential</li>
                  <li>Notify us immediately of any unauthorized use</li>
                  <li>Be responsible for all activities under your account</li>
                  <li>You must be at least 16 years old to use our services</li>
                </ul>
              </div>

              {/* Section 2 */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <FiBriefcase className="text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">2. Job Seeker Terms</h2>
                </div>
                <p className="text-gray-600 mb-3">As a job seeker, you agree to:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Submit accurate and truthful information in your profile and applications</li>
                  <li>Only apply to jobs you are genuinely interested in and qualified for</li>
                  <li>Respect the intellectual property of employers</li>
                  <li>Not upload malicious content or spam</li>
                  <li>Provide authentic work experience and educational qualifications</li>
                </ul>
              </div>

              {/* Section 3 */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <FiDatabase className="text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">3. Recruiter Terms</h2>
                </div>
                <p className="text-gray-600 mb-3">As a recruiter or employer, you agree to:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Post accurate and legitimate job opportunities</li>
                  <li>Not post fraudulent or misleading job listings</li>
                  <li>Respect candidate privacy and data protection laws</li>
                  <li>Respond to applications in a timely manner</li>
                  <li>Pay any applicable fees for premium services</li>
                </ul>
              </div>

              {/* Section 4 */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                    <FiShield className="text-yellow-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">4. Prohibited Activities</h2>
                </div>
                <p className="text-gray-600 mb-3">You may not use JobPortal for:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Posting false, inaccurate, or misleading information</li>
                  <li>Uploading viruses or malicious code</li>
                  <li>Harassing, abusing, or harming others</li>
                  <li>Impersonating any person or entity</li>
                  <li>Scraping or copying content without permission</li>
                  <li>Engaging in any illegal activities</li>
                </ul>
              </div>

              {/* Section 5 */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                    <FiLock className="text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">5. Content Ownership</h2>
                </div>
                <p className="text-gray-600 mb-3">You retain ownership of content you submit. By submitting content, you grant JobPortal a license to:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Display your profile and applications to employers</li>
                  <li>Use anonymized data for analytics and platform improvement</li>
                  <li>Store and process your data as described in our Privacy Policy</li>
                </ul>
              </div>

              {/* Section 6 */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Termination</h2>
                <p className="text-gray-600 mb-3">We may terminate or suspend your account immediately, without prior notice, for conduct that violates these terms. You may delete your account at any time through your profile settings.</p>
              </div>

              {/* Section 7 */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Disclaimer of Warranties</h2>
                <p className="text-gray-600 mb-3">JobPortal provides the platform "as is" without warranties of any kind. We do not guarantee that you will find a job or that job listings are accurate. Employers are solely responsible for their job postings.</p>
              </div>

              {/* Section 8 */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Limitation of Liability</h2>
                <p className="text-gray-600 mb-3">To the maximum extent permitted by law, JobPortal shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.</p>
              </div>

              {/* Contact */}
              <div className="bg-gray-50 rounded-xl p-6 mt-8">
                <h2 className="text-xl font-bold text-gray-800 mb-3">Contact Us</h2>
                <p className="text-gray-600">If you have any questions about these Terms, please contact us at:</p>
                <p className="text-blue-600 mt-2">📧 legal@jobportal.com</p>
                <p className="text-blue-600">📞 +1 (555) 123-4567</p>
                <p className="text-gray-500 text-sm mt-4">© 2025 JobPortal. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;