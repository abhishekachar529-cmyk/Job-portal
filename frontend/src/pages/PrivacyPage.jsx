import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiShield, FiLock, FiEye, FiDatabase, FiMail, FiUserCheck } from 'react-icons/fi';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link to="/register" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <FiArrowLeft className="mr-2" /> Back to Registration
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
            <p className="text-purple-100 mt-2">Last updated: June 9, 2025</p>
          </div>

          <div className="p-8">
            <div className="bg-purple-50 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Your Privacy Matters</h2>
              <p className="text-gray-600">At JobPortal, we are committed to protecting your personal information and your privacy.</p>
            </div>

            {/* Section 1 */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <FiDatabase className="text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">1. Information We Collect</h2>
              </div>
              <p className="text-gray-600 mb-3">We collect the following types of information:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li><strong>Personal Information:</strong> Name, email address, phone number, location</li>
                <li><strong>Professional Information:</strong> Resume, work experience, education, skills, portfolio links</li>
                <li><strong>Account Information:</strong> Login credentials, account preferences</li>
                <li><strong>Usage Data:</strong> How you interact with our platform, job searches, applications</li>
                <li><strong>Device Information:</strong> IP address, browser type, device type</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <FiEye className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">2. How We Use Your Information</h2>
              </div>
              <p className="text-gray-600 mb-3">We use your information to:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Create and manage your account</li>
                <li>Match you with relevant job opportunities</li>
                <li>Process job applications</li>
                <li>Communicate with you about applications and platform updates</li>
                <li>Improve our services and user experience</li>
                <li>Prevent fraud and ensure platform security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                  <FiUserCheck className="text-yellow-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">3. Information Sharing</h2>
              </div>
              <p className="text-gray-600 mb-3">We share your information with:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li><strong>Employers/Recruiters:</strong> When you apply for a job, your profile and resume are shared with the employer</li>
                <li><strong>Service Providers:</strong> Third-party vendors who help us operate our platform</li>
                <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
              </ul>
              <p className="text-gray-600 mt-3">We never sell your personal information to third parties.</p>
            </div>

            {/* Section 4 */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <FiLock className="text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">4. Data Security</h2>
              </div>
              <p className="text-gray-600 mb-3">We implement industry-standard security measures to protect your information:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and authentication measures</li>
                <li>Secure data centers with physical security</li>
                <li>Employee training on data protection</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                  <FiShield className="text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">5. Your Rights</h2>
              </div>
              <p className="text-gray-600 mb-3">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and data</li>
                <li>Opt-out of marketing communications</li>
                <li>Export your data</li>
                <li>Withdraw consent for data processing</li>
              </ul>
            </div>

            {/* Section 6 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Cookies and Tracking</h2>
              <p className="text-gray-600 mb-3">We use cookies and similar technologies to:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Remember your preferences and login status</li>
                <li>Analyze platform usage and improve performance</li>
                <li>Personalize your experience</li>
                <li>Serve relevant job recommendations</li>
              </ul>
              <p className="text-gray-600 mt-3">You can control cookie settings through your browser preferences.</p>
            </div>

            {/* Section 7 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Data Retention</h2>
              <p className="text-gray-600 mb-3">We retain your information as long as your account is active. When you delete your account, we will remove your personal information within 30 days, except where we are required to retain it for legal purposes.</p>
            </div>

            {/* Section 8 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Children's Privacy</h2>
              <p className="text-gray-600 mb-3">Our services are not intended for individuals under 16 years of age. We do not knowingly collect information from children under 16.</p>
            </div>

            {/* Section 9 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">9. International Data Transfers</h2>
              <p className="text-gray-600 mb-3">Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.</p>
            </div>

            {/* Section 10 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Updates to This Policy</h2>
              <p className="text-gray-600 mb-3">We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.</p>
            </div>

            {/* Contact */}
            <div className="bg-gray-50 rounded-xl p-6 mt-8">
              <div className="flex items-center mb-4">
                <FiMail className="text-blue-600 text-xl mr-2" />
                <h2 className="text-xl font-bold text-gray-800">Contact Us</h2>
              </div>
              <p className="text-gray-600">If you have questions about this Privacy Policy or your data, please contact our Data Protection Officer:</p>
              <p className="text-blue-600 mt-2">📧 privacy@jobportal.com</p>
              <p className="text-blue-600">📞 +1 (555) 123-4567</p>
              <p className="text-gray-500 text-sm mt-4">© 2025 JobPortal. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;