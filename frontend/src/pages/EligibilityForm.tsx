import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../services/api";

// Updated interface to match backend
interface EligibilityRequest {
  name: string;
  age: number;
  annualIncome: number;
  creditScore: number;
  monthlyDebtPayments: number;
  requestedAmount: number;
  loanTenure: number;
  employmentType: string;
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
  const navigate = useNavigate();
    const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    annualIncome: "",
    age: "",
    requestedAmount: "",
    creditScore: "",
    employmentType: "",
    monthlyDebtPayments: "",
    loanTenure: "36",
  });

  const [result, setResult] = useState<EligibilityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const totalSteps = 3;

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
      };      // Call the backend API
      console.log('Making API call to:', "http://localhost:8080/api/check-eligibility");
      console.log('Request data:', eligibilityData);
      
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

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Server Error: ${response.status} - ${errorText || 'Unknown error'}`);
      }const apiResult: EligibilityResponse = await response.json();
      setResult(apiResult);

      // Save the application to database after eligibility check
      try {        const applicationData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          age: Number(formData.age),
          annualIncome: Number(formData.annualIncome),
          creditScore: Number(formData.creditScore),
          monthlyDebtPayments: Number(formData.monthlyDebtPayments),
          requestedAmount: Number(formData.requestedAmount),
          loanTenure: Number(formData.loanTenure),
          employmentType: formData.employmentType,
          loanPurpose: 'Personal', // Default purpose
          eligible: apiResult.eligible,
          eligibilityReason: apiResult.reason,
          approvedAmount: apiResult.approvedAmount || 0,
          interestRate: apiResult.interestRate || 0,
          monthlyEmi: apiResult.monthlyEmi || 0
        };        console.log('Attempting to save application with data:', applicationData);
        const saveResponse = await apiService.submitLoanApplication(applicationData);
        console.log('Application save response:', saveResponse);
        console.log('Application saved successfully with ID:', saveResponse.applicationId);
      } catch (saveError) {
        console.error('Failed to save application - Full error:', saveError);
        if (saveError instanceof Error) {
          console.error('Error message:', saveError.message);
        }
        // Don't fail the whole process if save fails
      }

      // Call parent callback if provided and eligible
      if (apiResult.eligible && onEligibilityConfirmed) {
        onEligibilityConfirmed(apiResult);
      }    } catch (err) {
      console.error("Error checking loan eligibility:", err);
      
      let errorMessage = "Failed to check loan eligibility. Please try again.";
      
      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch')) {
          errorMessage = "Cannot connect to server. Please ensure the backend server is running on port 8080.";
        } else if (err.message.includes('Server Error')) {
          errorMessage = err.message;
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
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

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };
  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.name && formData.email && formData.phone && formData.age && formData.annualIncome;
      case 2:
        return formData.employmentType && formData.creditScore && formData.monthlyDebtPayments;
      case 3:
        return formData.requestedAmount && formData.loanTenure;
      default:
        return false;
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6 animate-fadeInUp">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>        <h3 className="text-2xl font-bold text-white mb-2">Personal Information</h3>
        <p className="text-gray-300">Let's start with your basic details</p>
      </div>

      <div className="group">        <label className="block text-sm font-semibold text-gray-200 mb-2 group-focus-within:text-blue-400 transition-colors">
          Full Name
        </label>
        <div className="relative">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-4 pl-12 bg-gray-700 border-2 border-gray-600 rounded-xl focus:border-blue-500 focus:bg-gray-600 transition-all duration-300 text-white placeholder-gray-400"
            placeholder="Enter your full name"
            required
          />          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>

      <div className="group">
        <label className="block text-sm font-semibold text-gray-200 mb-2 group-focus-within:text-blue-400 transition-colors">
          Email Address
        </label>
        <div className="relative">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-4 pl-12 bg-gray-700 border-2 border-gray-600 rounded-xl focus:border-blue-500 focus:bg-gray-600 transition-all duration-300 text-white placeholder-gray-400"
            placeholder="your.email@example.com"
            required
          />
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
          </svg>
        </div>
      </div>

      <div className="group">
        <label className="block text-sm font-semibold text-gray-200 mb-2 group-focus-within:text-blue-400 transition-colors">
          Phone Number
        </label>
        <div className="relative">          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-4 pl-12 bg-gray-700 border-2 border-gray-600 rounded-xl focus:border-blue-500 focus:bg-gray-600 transition-all duration-300 text-white placeholder-gray-400"
            placeholder="xxxxx98765"
            required
          />
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="group">          <label className="block text-sm font-semibold text-gray-200 mb-2 group-focus-within:text-blue-400 transition-colors">
            Age
          </label>
          <div className="relative">
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-4 py-4 pl-12 bg-gray-700 border-2 border-gray-600 rounded-xl focus:border-blue-500 focus:bg-gray-600 transition-all duration-300 text-white"
              placeholder="25"
              min="18"
              max="65"
              required
            />
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <div className="group">          <label className="block text-sm font-semibold text-gray-200 mb-2 group-focus-within:text-blue-400 transition-colors">
            Annual Income
          </label>
          <div className="relative">
            <input
              type="number"
              name="annualIncome"
              value={formData.annualIncome}
              onChange={handleChange}
              className="w-full px-4 py-4 pl-12 bg-gray-700 border-2 border-gray-600 rounded-xl focus:border-blue-500 focus:bg-gray-600 transition-all duration-300 text-white"
              placeholder="60000"
              min="0"
              required
            />            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">₹</span>
          </div>
          {formData.annualIncome && (
            <p className="text-sm text-blue-400 mt-1 animate-fadeIn">
              Monthly: ~₹{calculateMonthlyIncome()}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-fadeInUp">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8zM8 14v.01M12 14v.01M16 14v.01" />
          </svg>
        </div>        <h3 className="text-2xl font-bold text-white mb-2">Financial Profile</h3>
        <p className="text-gray-300">Help us understand your financial situation</p>
      </div>

      <div className="group">        <label className="block text-sm font-semibold text-gray-200 mb-2 group-focus-within:text-blue-400 transition-colors">
          Employment Type
        </label>
        <div className="relative">          <select
            name="employmentType"
            value={formData.employmentType}
            onChange={handleChange}
            className="w-full px-4 py-4 pl-12 bg-gray-700 border-2 border-gray-600 rounded-xl focus:border-blue-500 focus:bg-gray-600 transition-all duration-300 text-white appearance-none"
            required
          >
            <option value="">Select Employment Type</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="SELF_EMPLOYED">Self Employed</option>
            <option value="CONTRACT">Contract</option>
            <option value="UNEMPLOYED">Unemployed</option>
          </select>
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z" />
          </svg>
          <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="group">          <label className="block text-sm font-semibold text-gray-200 mb-2 group-focus-within:text-blue-400 transition-colors">
            Credit Score
          </label>
          <div className="relative">            <input
              type="number"
              name="creditScore"
              value={formData.creditScore}
              onChange={handleChange}
              className="w-full px-4 py-4 pl-12 bg-gray-700 border-2 border-gray-600 rounded-xl focus:border-blue-500 focus:bg-gray-600 transition-all duration-300 text-white"
              placeholder="750"
              min="300"
              max="850"
              required
            />
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div className="mt-2">
            {formData.creditScore && (
              <div className="flex items-center space-x-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      Number(formData.creditScore) >= 750 ? 'bg-green-500' :
                      Number(formData.creditScore) >= 650 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{width: `${(Number(formData.creditScore) - 300) / 550 * 100}%`}}
                  ></div>
                </div>
                <span className={`text-xs font-medium ${
                  Number(formData.creditScore) >= 750 ? 'text-green-600' :
                  Number(formData.creditScore) >= 650 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {Number(formData.creditScore) >= 750 ? 'Excellent' :
                   Number(formData.creditScore) >= 650 ? 'Good' : 'Fair'}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="group">          <label className="block text-sm font-semibold text-gray-200 mb-2 group-focus-within:text-blue-400 transition-colors">
            Monthly Debt
          </label>
          <div className="relative">            <input
              type="number"
              name="monthlyDebtPayments"
              value={formData.monthlyDebtPayments}
              onChange={handleChange}
              className="w-full px-4 py-4 pl-12 bg-gray-700 border-2 border-gray-600 rounded-xl focus:border-blue-500 focus:bg-gray-600 transition-all duration-300 text-white"
              placeholder="500"
              min="0"
              required
            />
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">₹</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Credit cards, car loans, etc.</p>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-fadeInUp">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        </div>        <h3 className="text-2xl font-bold text-white mb-2">Loan Details</h3>
        <p className="text-gray-300">Tell us about your loan requirements</p>
      </div>

      <div className="group">        <label className="block text-sm font-semibold text-gray-200 mb-2 group-focus-within:text-blue-400 transition-colors">
          Requested Loan Amount
        </label>
        <div className="relative">          <input
            type="number"
            name="requestedAmount"
            value={formData.requestedAmount}
            onChange={handleChange}
            className="w-full px-4 py-4 pl-12 bg-gray-700 border-2 border-gray-600 rounded-xl focus:border-blue-500 focus:bg-gray-600 transition-all duration-300 text-white text-lg font-medium"
            placeholder="25000"
            min="1000"
            required
          />
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium text-lg">₹</span>
        </div>
      </div>

      <div className="group">        <label className="block text-sm font-semibold text-gray-200 mb-2 group-focus-within:text-blue-400 transition-colors">
          Loan Tenure
        </label>
        <div className="relative">          <select
            name="loanTenure"
            value={formData.loanTenure}
            onChange={handleChange}
            className="w-full px-4 py-4 pl-12 bg-gray-700 border-2 border-gray-600 rounded-xl focus:border-blue-500 focus:bg-gray-600 transition-all duration-300 text-white appearance-none"
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
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {formData.requestedAmount && formData.loanTenure && (        <div className="bg-gradient-to-r from-gray-700/50 to-gray-600/50 p-6 rounded-2xl border border-gray-600 animate-fadeIn">
          <h4 className="font-semibold text-white mb-3 flex items-center">
            <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Estimated Loan Details
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Amount:</span>
              <span className="font-medium text-white">₹{Number(formData.requestedAmount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Duration:</span>
              <span className="font-medium text-white">{formData.loanTenure} months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Est. Rate:</span>
              <span className="font-medium text-green-400">7.5%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Est. Monthly:</span>
              <span className="font-medium text-blue-400">~₹850</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div><div className="relative z-10 w-full h-full overflow-y-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-full">
          <div className="w-full max-w-2xl my-auto">
          {/* Progress Bar */}
          <div className="mb-8">            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-300">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm font-medium text-gray-300">{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
                style={{width: `${(currentStep / totalSteps) * 100}%`}}
              ></div>
            </div>
          </div>          {/* Main Form Card */}          <div className="bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50 p-8 transition-all duration-300 hover:shadow-3xl">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2 p-10">
                Loan Eligibility Check
              </h1>
              <p className="text-gray-300">Get instant approval in 3 simple steps</p>
            </div><form onSubmit={handleSubmit}>
              <div className="mb-6">
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
              </div>

              {/* Navigation Buttons */}              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-600">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 text-gray-300 font-medium hover:text-white transition-colors flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                ) : <div></div>}

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepValid(currentStep)}
                    className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center ${
                      isStepValid(currentStep)
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Next
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || !isStepValid(currentStep)}
                    className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center ${
                      loading || !isStepValid(currentStep)
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    }`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                        </svg>
                        Checking...
                      </>
                    ) : (
                      <>
                        Check Eligibility
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 rounded-2xl bg-red-50 border border-red-200 animate-fadeIn">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-red-800">Error</h4>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success/Failure Result */}
          {result && (
            <div className="mt-6 space-y-4 animate-fadeIn">
              <div
                className={`p-6 rounded-2xl text-center ${
                  result.eligible
                    ? "bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200"
                    : "bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200"
                }`}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                  result.eligible ? "bg-green-500" : "bg-red-500"
                }`}>
                  {result.eligible ? (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${
                  result.eligible ? "text-green-800" : "text-red-800"
                }`}>
                  {result.eligible ? "Approved" : "Not Eligible"}
                </h3>
                <p className={`text-lg ${
                  result.eligible ? "text-green-700" : "text-red-700"
                }`}>{result.reason}</p>
              </div>

              {/* Detailed Information */}              <div className="bg-gray-700/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-600">
                <h4 className="font-bold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Application Summary
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300 font-medium">Applicant:</span>
                      <span className="text-white">{formData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300 font-medium">Annual Income:</span>
                      <span className="text-white">₹{Number(formData.annualIncome).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300 font-medium">Credit Score:</span>
                      <span className="text-white">{formData.creditScore}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300 font-medium">Requested:</span>
                      <span className="text-white">₹{Number(formData.requestedAmount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300 font-medium">Employment:</span>
                      <span className="text-white">{getEmploymentTypeLabel(formData.employmentType)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300 font-medium">Tenure:</span>
                      <span className="text-white">{formData.loanTenure} months</span>
                    </div>
                  </div>
                </div>

                {result.eligible && (
                  <div className="mt-6 pt-6 border-t border-gray-600">
                    <h5 className="font-semibold text-green-400 mb-3">✅ Approved Details</h5>                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {result.maxLoanAmount && (
                        <div className="flex justify-between">
                          <span className="text-gray-300 font-medium">Max Approved:</span>
                          <span className="text-green-400 font-semibold">₹{result.maxLoanAmount.toLocaleString()}</span>
                        </div>
                      )}
                      {result.approvedAmount && (
                        <div className="flex justify-between">
                          <span className="text-gray-300 font-medium">Approved Amount:</span>
                          <span className="text-green-400 font-semibold">₹{result.approvedAmount.toLocaleString()}</span>
                        </div>
                      )}
                      {result.interestRate && (
                        <div className="flex justify-between">
                          <span className="text-gray-300 font-medium">Interest Rate:</span>
                          <span className="text-blue-400 font-semibold">{result.interestRate}%</span>
                        </div>
                      )}
                      {result.monthlyEmi && (
                        <div className="flex justify-between">
                          <span className="text-gray-300 font-medium">Monthly EMI:</span>
                          <span className="text-purple-400 font-semibold">₹{result.monthlyEmi.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Continue to Application Button */}
              {result.eligible && onEligibilityConfirmed && (
                <button
                  onClick={() => onEligibilityConfirmed(result)}
                  className="w-full py-4 px-6 rounded-2xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
                >
                  Continue to Loan Application
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>                </button>
              )}

              {/* Navigate to Application History Button */}
              {result && (
                <div className="mt-6 flex gap-4">                  <button
                    onClick={() => {
                      console.log('Navigating to application history...');
                      navigate('/application-history');
                    }}
                    className="flex-1 py-4 px-6 rounded-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
                  >
                    View Application History
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => {
                      setResult(null);
                      setCurrentStep(1);                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        annualIncome: "",
                        age: "",
                        requestedAmount: "",
                        creditScore: "",
                        employmentType: "",
                        monthlyDebtPayments: "",
                        loanTenure: "36",
                      });
                    }}
                    className="py-4 px-6 rounded-2xl font-semibold bg-gray-600 hover:bg-gray-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
                  >
                    Check Again
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanEligibilityForm;