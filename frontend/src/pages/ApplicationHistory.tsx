import React, { useState, useEffect } from 'react';
import { FiClock, FiCheckCircle, FiXCircle, FiEye, FiRefreshCw, FiDownload, FiHeadphones, FiZap, FiShield } from 'react-icons/fi';
import type { LoanApplication } from '../types/index.tsx';
import { apiService } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EnhancedAlert } from '../components/EnhancedAlert';

const ApplicationHistory: React.FC = () => {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null);

  useEffect(() => {
    console.log('ApplicationHistory component mounted');
    fetchApplications();
  }, []);  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Starting to fetch applications...');
      
      // Try to fetch from API first
      try {
        console.log('Calling API: GET /api/admin/applications');
        const data = await apiService.getAllApplications();
        console.log('API response received:', data);
        console.log('Number of applications received:', data ? data.length : 0);
        setApplications(data || []);
        console.log('Applications set from API:', data ? data.length : 0, 'items');
      } catch (apiError) {
        // If API fails, use mock data for demonstration
        console.error('API failed, error details:', apiError);
        console.log('Using mock data as fallback');        const mockData: LoanApplication[] = [
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+91 9876543210',
            age: 28,
            annualIncome: 1200000,
            requestedAmount: 500000,
            creditScore: 750,
            monthlyDebtPayments: 15000,
            loanTenure: 36,
            employmentType: 'Salaried',
            loanPurpose: 'Personal',
            eligible: true,
            eligibilityReason: 'Excellent credit score and stable income',
            approvedAmount: 500000,
            interestRate: 7.5,
            monthlyEmi: 15532,
            status: 'APPROVED',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '+91 9876543211',
            age: 32,
            annualIncome: 800000,
            requestedAmount: 300000,
            creditScore: 680,
            monthlyDebtPayments: 8000,
            loanTenure: 48,
            employmentType: 'Self-employed',
            loanPurpose: 'Business',
            eligible: true,
            eligibilityReason: 'Application under review',
            approvedAmount: 280000,
            interestRate: 8.0,
            monthlyEmi: 7320,
            status: 'UNDER_REVIEW',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: '3',
            name: 'Robert Johnson',
            email: 'robert@example.com',
            phone: '+91 9876543212',
            age: 25,
            annualIncome: 500000,
            requestedAmount: 800000,
            creditScore: 580,
            monthlyDebtPayments: 25000,
            loanTenure: 60,
            employmentType: 'Salaried',
            loanPurpose: 'Personal',
            eligible: false,
            eligibilityReason: 'Insufficient income for requested loan amount',
            approvedAmount: 0,
            interestRate: 0,
            monthlyEmi: 0,
            status: 'REJECTED',
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          }
        ];
        setApplications(mockData);
        console.log('Mock data set as fallback:', mockData.length, 'items');
      }
    } catch (err) {
      console.error('Critical error in fetchApplications:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch applications');
    } finally {
      setLoading(false);
      console.log('fetchApplications completed');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED': return <FiCheckCircle className="text-green-600" />;
      case 'REJECTED': return <FiXCircle className="text-red-600" />;
      case 'UNDER_REVIEW': return <FiClock className="text-yellow-600" />;
      default: return <FiClock className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'UNDER_REVIEW': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };  if (loading) {
    console.log('ApplicationHistory: Showing loading spinner');
    return (
      <div className="min-h-screen h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your applications..." />
      </div>
    );
  }

  console.log('ApplicationHistory render - applications:', applications);
  console.log('ApplicationHistory render - applications length:', applications.length);
  console.log('ApplicationHistory render - error:', error);
  console.log('ApplicationHistory render - loading:', loading);  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 p-4 sm:p-6 lg:p-8 pb-16">
          <div className="flex flex-col max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-8 gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white">Latest Application</h1>
                <p className="text-gray-300 mt-2 text-base sm:text-lg">Your most recent loan application</p>
              </div>
              <button
                onClick={fetchApplications}
                className="flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-base sm:text-lg whitespace-nowrap"
              >
                <FiRefreshCw className="w-5 h-5" />
                <span>Refresh</span>
              </button>
            </div>            {error && (
              <div className="mb-6 lg:mb-8">
                <EnhancedAlert
                  type="error"
                  title="Error"
                  message={error}
                  onClose={() => setError(null)}
                  action={{
                    label: 'Retry',
                    onClick: fetchApplications
                  }}
                />
              </div>
            )}            <div className="flex items-center justify-center py-8">
              {applications.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <FiClock className="w-16 sm:w-24 h-16 sm:h-24 text-gray-400 mx-auto mb-4 sm:mb-6" />
                  <h3 className="text-xl sm:text-2xl font-medium text-white">No Applications Found</h3>
                  <p className="text-gray-300 mt-3 text-base sm:text-lg">You haven't submitted any loan applications yet.</p>
                  <p className="text-gray-400 mt-2 text-sm sm:text-base">Submit an eligibility form to see your latest application here.</p>
                </div>
              ) : (
                <div className="w-full">{/* Show only the latest application */}
                  {applications.slice(0, 1).map((app) => (
                    <div
                      key={app.id}
                      className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-gray-600/30 hover:bg-gray-800/80 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 cursor-pointer shadow-2xl max-w-6xl mx-auto animate-fadeInUp"
                      onClick={() => setSelectedApp(app)}><div className="flex flex-col sm:flex-row items-start justify-between mb-6 sm:mb-8 gap-4">
                      <div>
                        <h3 className="font-bold text-2xl sm:text-3xl text-white mb-2">{app.name}</h3>
                        <p className="text-gray-300 text-base sm:text-lg">Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-left sm:text-right">
                        {getStatusIcon(app.status)}
                        <span className={`inline-block mt-2 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(app.status)}`}>
                          {app.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                      <div className="bg-gray-700/50 rounded-xl p-4 sm:p-6 text-center">
                        <span className="text-gray-300 text-xs sm:text-sm block mb-2">Requested Amount</span>
                        <span className="font-bold text-xl sm:text-2xl text-white">₹{app.requestedAmount.toLocaleString()}</span>
                      </div>
                      <div className="bg-gray-700/50 rounded-xl p-4 sm:p-6 text-center">
                        <span className="text-gray-300 text-xs sm:text-sm block mb-2">Annual Income</span>
                        <span className="font-bold text-xl sm:text-2xl text-white">₹{app.annualIncome.toLocaleString()}</span>
                      </div>
                      <div className="bg-gray-700/50 rounded-xl p-4 sm:p-6 text-center">
                        <span className="text-gray-300 text-xs sm:text-sm block mb-2">Credit Score</span>
                        <span className="font-bold text-xl sm:text-2xl text-white">{app.creditScore}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                      <div className="text-center">
                        <span className="text-gray-300 text-xs sm:text-sm block mb-1">Age</span>
                        <span className="font-semibold text-base sm:text-lg text-white">{app.age} years</span>
                      </div>
                      <div className="text-center">
                        <span className="text-gray-300 text-xs sm:text-sm block mb-1">Employment</span>
                        <span className="font-semibold text-base sm:text-lg text-white">{app.employmentType}</span>
                      </div>
                      <div className="text-center">
                        <span className="text-gray-300 text-xs sm:text-sm block mb-1">Loan Tenure</span>
                        <span className="font-semibold text-base sm:text-lg text-white">{app.loanTenure} months</span>
                      </div>
                      <div className="text-center">
                        <span className="text-gray-300 text-xs sm:text-sm block mb-1">Monthly Debt</span>
                        <span className="font-semibold text-base sm:text-lg text-white">₹{app.monthlyDebtPayments.toLocaleString()}</span>
                      </div>
                    </div>                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-700/30 rounded-xl p-4 sm:p-6 gap-4">
                      <div>
                        <span className="text-gray-300 text-xs sm:text-sm block mb-1">Eligibility Status</span>
                        <span className={`font-semibold text-base sm:text-lg ${app.eligible ? 'text-green-400' : 'text-red-400'}`}>
                          {app.eligible ? 'Eligible' : 'Not Eligible'}
                        </span>
                      </div>
                      <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base">
                        <FiEye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                    </div>

                    {/* Additional Information Section */}
                    <div className="mt-6 pt-6 border-t border-gray-600/30">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div className="bg-gray-700/30 rounded-lg p-4">
                          <span className="text-gray-300 text-xs block mb-1">Loan Purpose</span>
                          <span className="text-white font-medium">{app.loanPurpose}</span>
                        </div>
                        {app.eligible && (
                          <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
                            <span className="text-green-300 text-xs block mb-1">Approved Amount</span>
                            <span className="text-green-400 font-bold text-lg">₹{app.approvedAmount?.toLocaleString() || 'Pending'}</span>
                          </div>
                        )}
                        {app.eligible && app.interestRate && (
                          <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
                            <span className="text-blue-300 text-xs block mb-1">Interest Rate</span>
                            <span className="text-blue-400 font-bold text-lg">{app.interestRate}% p.a.</span>
                          </div>
                        )}
                        {app.eligible && app.monthlyEmi && (
                          <div className="bg-purple-900/20 border border-purple-700/30 rounded-lg p-4">
                            <span className="text-purple-300 text-xs block mb-1">Monthly EMI</span>
                            <span className="text-purple-400 font-bold text-lg">₹{app.monthlyEmi?.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Eligibility Reason */}
                      <div className="bg-gray-700/20 rounded-lg p-4 border border-gray-600/20">
                        <span className="text-gray-300 text-xs block mb-2">Eligibility Assessment</span>
                        <p className="text-gray-100 text-sm leading-relaxed">{app.eligibilityReason}</p>
                      </div>
                    </div>

                    {/* Application Timeline */}
                    <div className="mt-6 pt-6 border-t border-gray-600/30">
                      <h4 className="text-white font-semibold mb-4 flex items-center">
                        <FiClock className="w-4 h-4 mr-2" />
                        Application Timeline
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                            <span className="text-gray-300 text-sm">Application Submitted</span>
                          </div>
                          <span className="text-gray-400 text-sm">{new Date(app.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-3 ${
                              app.status === 'APPROVED' ? 'bg-green-500' : 
                              app.status === 'REJECTED' ? 'bg-red-500' : 'bg-yellow-500'
                            }`}></div>
                            <span className="text-gray-300 text-sm">Status: {app.status.replace('_', ' ')}</span>
                          </div>
                          <span className="text-gray-400 text-sm">{new Date(app.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>                </div>              ))}
              
              {/* Information Cards */}
              <div className="mt-12 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700/30 rounded-lg p-6 text-center hover:scale-105 transform transition-all duration-300 cursor-pointer">
                  <FiHeadphones className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                  <div className="text-blue-400 text-3xl font-bold mb-1">24/7</div>
                  <div className="text-blue-300 text-base">Customer Support</div>
                </div>
                <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-700/30 rounded-lg p-6 text-center hover:scale-105 transform transition-all duration-300 cursor-pointer">
                  <FiZap className="w-10 h-10 text-green-400 mx-auto mb-3" />
                  <div className="text-green-400 text-3xl font-bold mb-1">2-3</div>
                  <div className="text-green-300 text-base">Days Processing</div>
                </div>
                <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-700/30 rounded-lg p-6 text-center hover:scale-105 transform transition-all duration-300 cursor-pointer">
                  <FiShield className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                  <div className="text-purple-400 text-3xl font-bold mb-1">99%</div>
                  <div className="text-purple-300 text-base">Approval Rate</div>
                </div>
              </div>
            </div>
          )}{/* Application Detail Modal */}
          {selectedApp && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
              <div className="bg-gray-800/95 backdrop-blur-xl border border-gray-600/50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Application Details</h2>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    <FiXCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Application ID</label>
                      <p className="text-white">{selectedApp.id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Status</label>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedApp.status)}`}>
                        {selectedApp.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Applicant Name</label>
                      <p className="text-white">{selectedApp.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Email</label>
                      <p className="text-white">{selectedApp.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Phone</label>
                      <p className="text-white">{selectedApp.phone}</p>                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Age</label>
                      <p className="text-white">{selectedApp.age} years</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Annual Income</label>
                      <p className="text-white">₹{selectedApp.annualIncome.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Requested Amount</label>
                      <p className="text-white">₹{selectedApp.requestedAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Credit Score</label>
                      <p className="text-white">{selectedApp.creditScore}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Employment Type</label>
                      <p className="text-white">{selectedApp.employmentType}</p>
                    </div>
                  </div>                  <div>
                    <label className="block text-sm font-medium text-gray-300">Eligibility Reason</label>
                    <p className="text-white bg-gray-700/50 p-3 rounded-lg border border-gray-600/50">{selectedApp.eligibilityReason}</p>
                  </div>

                  {selectedApp.eligible && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300">Approved Amount</label>
                        <p className="text-green-400 font-bold text-lg">₹{selectedApp.approvedAmount?.toLocaleString() || 'Pending'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300">Interest Rate</label>
                        <p className="text-blue-400 font-bold text-lg">{selectedApp.interestRate || 'TBD'}% p.a.</p>
                      </div>
                    </div>
                  )}

                  {selectedApp.eligible && selectedApp.monthlyEmi && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300">Monthly EMI</label>
                        <p className="text-purple-400 font-bold text-lg">₹{selectedApp.monthlyEmi.toLocaleString()}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300">Loan Tenure</label>
                        <p className="text-white">{selectedApp.loanTenure} months</p>
                      </div>
                    </div>
                  )}                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Applied Date</label>
                      <p className="text-white">{new Date(selectedApp.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Last Updated</label>
                      <p className="text-white">{new Date(selectedApp.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>                {/* Modal Footer with Actions */}
                <div className="mt-6 pt-6 border-t border-gray-600/50 flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center space-x-2">
                    <FiDownload className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                  <button className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center space-x-2">
                    <FiHeadphones className="w-4 h-4" />
                    <span>Contact Support</span>
                  </button>
                  <button 
                    onClick={() => setSelectedApp(null)}
                    className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center space-x-2"
                  >
                    <FiXCircle className="w-4 h-4" />
                    <span>Close</span>
                  </button>
                </div>
              </div>
            </div>
          )}            </div>
          </div>          {/* Page Footer */}
          <div className="mt-16 pt-10 border-t border-gray-700/30 mb-12">
            <div className="flex flex-col sm:flex-row justify-between items-center text-gray-400 text-sm">
              <div className="mb-4 sm:mb-0">
                <span>© 2025 LoanCheck Pro. Secure & Reliable Loan Processing.</span>
              </div>
              <div className="flex space-x-6">
                <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
                <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
                <span className="hover:text-white cursor-pointer transition-colors">Help Center</span>
              </div>
            </div>
          </div>
          
          {/* Bottom spacing */}
          <div className="pb-16"></div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationHistory;