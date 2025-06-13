import React, { useState, useEffect } from 'react';
import { FiClock, FiCheckCircle, FiXCircle, FiEye, FiRefreshCw } from 'react-icons/fi';
import type { LoanApplication } from '../types/index.tsx';
import { apiService } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EnhancedAlert } from '../components/EnhancedAlert';

export const ApplicationHistory: React.FC = () => {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getAllApplications();
      setApplications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch applications');
    } finally {
      setLoading(false);
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
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your applications..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Application History</h1>
            <button
              onClick={fetchApplications}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>

          {error && (
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
          )}

          {applications.length === 0 ? (
            <div className="text-center py-12">
              <FiClock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600">No Applications Found</h3>
              <p className="text-gray-500 mt-2">You haven't submitted any loan applications yet.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedApp(app)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">{app.applicantName}</h3>
                      <p className="text-gray-600 text-sm">Applied: {new Date(app.appliedDate).toLocaleDateString()}</p>
                    </div>
                    {getStatusIcon(app.status)}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">₹{app.loanAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Income:</span>
                      <span className="font-medium">₹{app.annualIncome.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Credit Score:</span>
                      <span className="font-medium">{app.creditScore}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                      {app.status.replace('_', ' ')}
                    </span>
                    <button className="text-blue-600 hover:text-blue-800 transition-colors">
                      <FiEye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Application Detail Modal */}
          {selectedApp && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Application Details</h2>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiXCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Application ID</label>
                      <p className="text-gray-800">{selectedApp.id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Status</label>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedApp.status)}`}>
                        {selectedApp.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Applicant Name</label>
                      <p className="text-gray-800">{selectedApp.applicantName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-800">{selectedApp.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-gray-800">{selectedApp.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Age</label>
                      <p className="text-gray-800">{selectedApp.age} years</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Annual Income</label>
                      <p className="text-gray-800">₹{selectedApp.annualIncome.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Loan Amount</label>
                      <p className="text-gray-800">₹{selectedApp.loanAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Credit Score</label>
                      <p className="text-gray-800">{selectedApp.creditScore}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Employment Type</label>
                      <p className="text-gray-800">{selectedApp.employmentType}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">Eligibility Reason</label>
                    <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{selectedApp.reason}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Applied Date</label>
                      <p className="text-gray-800">{new Date(selectedApp.appliedDate).toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Last Updated</label>
                      <p className="text-gray-800">{new Date(selectedApp.lastUpdated).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};