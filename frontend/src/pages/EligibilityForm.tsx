// src/pages/EligibilityForm.tsx - FIXED VERSION
import React, { useState } from "react";
import {
  FiUser,
  FiDollarSign,
  FiCalendar,
  FiCreditCard,
  FiLoader,
  FiBriefcase,
  FiTrendingDown,
} from "react-icons/fi";

// Updated interface to match backend
interface EligibilityRequest {
  name: string;
  age: number;
  annualIncome: number; // Changed from monthlyIncome
  creditScore: number;
  monthlyDebtPayments: number; // Added
  requestedAmount: number; // Changed from loanAmount
  loanTenure: number; // Added
  employmentType: string; // Changed from employmentStatus
}

interface EligibilityResponse {
  eligible: boolean;
  reason: string;
  maxLoanAmount?: number;
  approvedAmount?: number;
  interestRate?: number;
  monthlyEmi?: number;
  timestamp: number;
}

interface EligibilityFormProps {
  onEligibilityConfirmed?: (eligibilityData: EligibilityResponse) => void;
}

const LoanEligibilityForm: React.FC<EligibilityFormProps> = ({
  onEligibilityConfirmed,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    annualIncome: "", // Changed to annual income
    age: "",
    requestedAmount: "", // Changed field name
    creditScore: "",
    employmentType: "", // Changed field name
    monthlyDebtPayments: "", // Added field
    loanTenure: "36", // Added field with default value
  });

  const [result, setResult] = useState<EligibilityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Prepare API request data matching backend DTO
      const eligibilityData: EligibilityRequest = {
        name: formData.name,
        age: Number(formData.age),
        annualIncome: Number(formData.annualIncome),
        creditScore: Number(formData.creditScore),
        monthlyDebtPayments: Number(formData.monthlyDebtPayments),
        requestedAmount: Number(formData.requestedAmount),
        loanTenure: Number(formData.loanTenure),
        employmentType: formData.employmentType,
      };

      // Call the backend API
      const response = await fetch(
        "http://localhost:8080/api/check-eligibility",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eligibilityData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResult: EligibilityResponse = await response.json();
      setResult(apiResult);

      // Call parent callback if provided and eligible
      if (apiResult.eligible && onEligibilityConfirmed) {
        onEligibilityConfirmed(apiResult);
      }
    } catch (err) {
      console.error("Error checking loan eligibility:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to check loan eligibility. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getEmploymentTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      FULL_TIME: "Full Time",
      PART_TIME: "Part Time",
      SELF_EMPLOYED: "Self Employed",
      UNEMPLOYED: "Unemployed",
      CONTRACT: "Contract",
    };
    return typeMap[type] || type;
  };

  const calculateMonthlyIncome = () => {
    const annual = Number(formData.annualIncome);
    return annual > 0 ? (annual / 12).toFixed(0) : "0";
  };

  return (
    <div className="min-w-screen min-h-screen">
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-fade-in-down transition duration-700 ease-out">
          <p className="text-3xl text-center text-gray-800 mb-6">
            Loan Eligibility Check
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="flex items-center border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500">
                <FiUser className="text-gray-500 mr-2" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full outline-none text-black"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">
                Annual Income ($)
              </label>
              <div className="flex items-center border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500">
                <FiDollarSign className="text-gray-500 mr-2" />
                <input
                  type="number"
                  name="annualIncome"
                  value={formData.annualIncome}
                  onChange={handleChange}
                  className="w-full outline-none text-black"
                  placeholder="e.g., 60000"
                  min="0"
                  required
                />
              </div>
              {formData.annualIncome && (
                <p className="text-sm text-gray-500 mt-1">
                  Monthly: ~${calculateMonthlyIncome()}
                </p>
              )}
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">
                Age
              </label>
              <div className="flex items-center border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500">
                <FiCalendar className="text-gray-500 mr-2" />
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full outline-none text-black"
                  placeholder="Enter your age"
                  min="18"
                  max="65"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">
                Employment Type
              </label>
              <div className="flex items-center border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500">
                <FiBriefcase className="text-gray-500 mr-2" />
                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  className="w-full outline-none text-black bg-transparent"
                  required
                >
                  <option value="">Select Employment Type</option>
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="SELF_EMPLOYED">Self Employed</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="UNEMPLOYED">Unemployed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">
                Credit Score
              </label>
              <div className="flex items-center border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500">
                <FiCreditCard className="text-gray-500 mr-2" />
                <input
                  type="number"
                  name="creditScore"
                  value={formData.creditScore}
                  onChange={handleChange}
                  className="w-full outline-none text-black"
                  placeholder="300-850"
                  min="300"
                  max="850"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">
                Monthly Debt Payments ($)
              </label>
              <div className="flex items-center border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500">
                <FiTrendingDown className="text-gray-500 mr-2" />
                <input
                  type="number"
                  name="monthlyDebtPayments"
                  value={formData.monthlyDebtPayments}
                  onChange={handleChange}
                  className="w-full outline-none text-black"
                  placeholder="e.g., 500"
                  min="0"
                  required
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Include credit cards, car loans, other debts
              </p>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">
                Requested Loan Amount ($)
              </label>
              <div className="flex items-center border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500">
                <FiDollarSign className="text-gray-500 mr-2" />
                <input
                  type="number"
                  name="requestedAmount"
                  value={formData.requestedAmount}
                  onChange={handleChange}
                  className="w-full outline-none text-black"
                  placeholder="e.g., 10000"
                  min="1000"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">
                Loan Tenure (months)
              </label>
              <div className="flex items-center border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500">
                <FiCalendar className="text-gray-500 mr-2" />
                <select
                  name="loanTenure"
                  value={formData.loanTenure}
                  onChange={handleChange}
                  className="w-full outline-none text-black bg-transparent"
                  required
                >
                  <option value="12">12 months (1 year)</option>
                  <option value="24">24 months (2 years)</option>
                  <option value="36">36 months (3 years)</option>
                  <option value="48">48 months (4 years)</option>
                  <option value="60">60 months (5 years)</option>
                  <option value="84">84 months (7 years)</option>
                  <option value="120">120 months (10 years)</option>
                  <option value="180">180 months (15 years)</option>
                  <option value="240">240 months (20 years)</option>
                  <option value="360">360 months (30 years)</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-6 rounded-lg font-medium transition duration-300 flex items-center justify-center ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                } text-white`}
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Checking Eligibility...
                  </>
                ) : (
                  "Check Eligibility"
                )}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 rounded-lg text-center font-medium bg-red-100 text-red-800 border border-red-400">
              <p className="font-semibold mb-1">⚠️ Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Success/Failure Result */}
          {result && (
            <div className="mt-6 space-y-4">
              <div
                className={`p-4 rounded-lg text-center font-medium ${
                  result.eligible
                    ? "bg-green-100 text-green-800 border border-green-400"
                    : "bg-red-100 text-red-800 border border-red-400"
                }`}
              >
                <p className="text-lg font-semibold mb-2">
                  {result.eligible ? "✅ Congratulations!" : "❌ Not Eligible"}
                </p>
                <p className="text-sm">{result.reason}</p>
              </div>

              {/* Detailed Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Application Summary:
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>
                      <strong>Applicant:</strong>
                    </span>
                    <span>{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      <strong>Annual Income:</strong>
                    </span>
                    <span>
                      ${Number(formData.annualIncome).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      <strong>Requested Amount:</strong>
                    </span>
                    <span>
                      ${Number(formData.requestedAmount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      <strong>Credit Score:</strong>
                    </span>
                    <span>{formData.creditScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      <strong>Employment:</strong>
                    </span>
                    <span>
                      {getEmploymentTypeLabel(formData.employmentType)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      <strong>Loan Tenure:</strong>
                    </span>
                    <span>{formData.loanTenure} months</span>
                  </div>

                  {result.eligible && (
                    <>
                      {result.maxLoanAmount && (
                        <div className="flex justify-between text-green-700 font-medium">
                          <span>
                            <strong>Max Approved:</strong>
                          </span>
                          <span>${result.maxLoanAmount.toLocaleString()}</span>
                        </div>
                      )}
                      {result.approvedAmount && (
                        <div className="flex justify-between text-green-700 font-medium">
                          <span>
                            <strong>Approved Amount:</strong>
                          </span>
                          <span>${result.approvedAmount.toLocaleString()}</span>
                        </div>
                      )}
                      {result.interestRate && (
                        <div className="flex justify-between text-green-700 font-medium">
                          <span>
                            <strong>Interest Rate:</strong>
                          </span>
                          <span>{result.interestRate}%</span>
                        </div>
                      )}
                      {result.monthlyEmi && (
                        <div className="flex justify-between text-green-700 font-medium">
                          <span>
                            <strong>Monthly EMI:</strong>
                          </span>
                          <span>${result.monthlyEmi.toLocaleString()}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Continue to Application Button */}
              {result.eligible && onEligibilityConfirmed && (
                <div className="pt-2">
                  <button
                    onClick={() => onEligibilityConfirmed(result)}
                    className="w-full py-3 px-6 rounded-lg font-medium bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500 text-white transition duration-300"
                  >
                    Continue to Loan Application →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanEligibilityForm;
