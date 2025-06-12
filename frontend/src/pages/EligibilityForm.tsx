// src/pages/EligibilityForm.tsx
import React, { useState } from "react";
import { FiUser, FiDollarSign, FiCalendar, FiCreditCard, FiLoader } from "react-icons/fi";

// API configuration
const API_BASE_URcdL = 'http://localhost:53789'; // Update with your actual port

interface LoanEligibilityResponse {
  applicantName: string;
  eligible: boolean;
  reason: string;
  income: number;
  loanAmount: number;
  creditScore: number;
}

const LoanEligibilityForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    income: "",
    age: "",
    loanAmount: "",
    creditScore: "", // Added credit score field
  });

  const [result, setResult] = useState<LoanEligibilityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  setResult(null);

  try {
    // Mock API response for testing (remove this when backend is ready)
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    const income = Number(formData.income);
    const loanAmount = Number(formData.loanAmount);
    const creditScore = Number(formData.creditScore);
    const age = Number(formData.age);
    
    // Mock eligibility logic
    let eligible = true;
    let reason = '';
    
    if (creditScore < 650) {
      eligible = false;
      reason = 'Credit score too low. Minimum required: 650';
    } else if (income < 300000) {
      eligible = false;
      reason = 'Annual income too low. Minimum required: ₹3,00,000';
    } else if (age < 18 || age > 65) {
      eligible = false;
      reason = 'Age must be between 18 and 65 years';
    } else if (loanAmount > (income * 5)) {
      eligible = false;
      reason = 'Loan amount too high compared to income (max 5x annual income)';
    } else if (loanAmount < 10000) {
      eligible = false;
      reason = 'Minimum loan amount is ₹10,000';
    } else {
      reason = 'Congratulations! You are eligible for the loan.';
    }
    
    const mockResponse = {
      applicantName: formData.name,
      eligible: eligible,
      reason: reason,
      income: income,
      loanAmount: loanAmount,
      creditScore: creditScore
    };
    
    setResult(mockResponse);
    
    /* 
    // Original API call - uncomment when backend is ready
    const response = await fetch(`${API_BASE_URL}/api/check-eligibility`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: LoanEligibilityResponse = await response.json();
    setResult(data);
    */
    
  } catch (err) {
    console.error('Error checking loan eligibility:', err);
    setError('Failed to check loan eligibility. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const getAgeGroup = (age: number) => {
    if (age < 18) {
      return "Teenager";
    } else if (age >= 18 && age < 60) {
      return "Adult";
    } else {
      return "Senior";
    }
  };

  return (
    <div className="min-w-screen min-h-screen">
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-fade-in-down transition duration-700 ease-out">
          <p className="text-3xl text-center text-gray-800 mb-6">
            Loan Eligibility Form
          </p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="flex items-center border border-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-blue-500">
                <FiUser className="text-gray-500 mr-2" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full outline-none text-black"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700">
                Annual Income (₹)
              </label>
              <div className="flex items-center border border-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-blue-500">
                <FiDollarSign className="text-gray-500 mr-2" />
                <input
                  type="number"
                  name="income"
                  value={formData.income}
                  onChange={handleChange}
                  className="w-full outline-none text-black"
                  placeholder="e.g., 500000"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700">
                Age
              </label>
              <div className="flex items-center border border-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-blue-500">
                <FiCalendar className="text-gray-500 mr-2" />
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full outline-none text-black"
                  min="18"
                  max="80"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700">
                Credit Score
              </label>
              <div className="flex items-center border border-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-blue-500">
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
              <label className="block text-lg font-medium text-gray-700">
                Loan Amount (₹)
              </label>
              <div className="flex items-center border border-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-blue-500">
                <FiCreditCard className="text-gray-500 mr-2" />
                <input
                  type="number"
                  name="loanAmount"
                  value={formData.loanAmount}
                  onChange={handleChange}
                  className="w-full outline-none text-black"
                  placeholder="e.g., 1000000"
                  required
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-6 rounded-lg font-medium transition duration-300 flex items-center justify-center ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Checking...
                  </>
                ) : (
                  'Check Eligibility'
                )}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 rounded-lg text-center font-medium bg-red-100 text-red-800 border border-red-400">
              {error}
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
                  {result.eligible ? "✅ Congratulations!" : "❌ Sorry"}
                </p>
                <p>{result.reason}</p>
              </div>

              {/* Detailed Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Application Details:</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Applicant:</strong> {result.applicantName}</p>
                  <p><strong>Annual Income:</strong> ₹{result.income.toLocaleString()}</p>
                  <p><strong>Loan Amount:</strong> ₹{result.loanAmount.toLocaleString()}</p>
                  <p><strong>Credit Score:</strong> {result.creditScore}</p>
                  <p><strong>Age Group:</strong> {getAgeGroup(Number(formData.age))}</p>
                </div>
              </div>
            </div>
          )}

          {/* Age Group Display */}
          <div className="mt-6">
            {formData.age && (
              <p className="text-gray-600 text-center">
                Age Group: <strong>{getAgeGroup(Number(formData.age))}</strong>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanEligibilityForm;