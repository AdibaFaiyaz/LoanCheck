// src/pages/EligibilityForm.tsx
import React, { useState } from "react";
import { FiUser, FiDollarSign, FiCalendar, FiCreditCard } from "react-icons/fi";

const LoanEligibilityForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    income: "",
    age: "",
    loanAmount: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const income = Number(formData.income);
    const age = Number(formData.age);
    const loanAmount = Number(formData.loanAmount);

    let eligibilityMessage = "";

    // Eligibility checks without internal conditions being shown
    if (age < 18) {
      eligibilityMessage =
        "You must be at least 18 years old to apply for a loan.";
    } else if (income < 20000) {
      eligibilityMessage = "Your income is too low to be eligible.";
    } else if (loanAmount > income * 10) {
      eligibilityMessage =
        "Requested loan amount is too high based on your income.";
    } else {
      eligibilityMessage = "You are eligible for the loan!";
    }

    setResult(eligibilityMessage); // This will only show the final eligibility message.
  };

  const getAgeGroup = (age: number) => {
    if (age < 18) {
      return "Teenager";
    } else if (age >= 18 && age < 60) {
      return "Adult";
    } else {
      return "Old-Aged";
    }
  };

  return (
    <div className="min-w-screen min-h-screen">
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-fade-in-down transition duration-700 ease-out">
          <p className=" text-3xl  text-center text-gray-800 mb-6">
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
                Income
              </label>
              <div className="flex items-center border border-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-blue-500">
                <FiDollarSign className="text-gray-500 mr-2" />
                <input
                  type="number"
                  name="income"
                  value={formData.income}
                  onChange={handleChange}
                  className="w-full outline-none text-black"
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
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Loan Amount
              </label>
              <div className="flex items-center border border-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-blue-500">
                <FiCreditCard className="text-gray-500 mr-2" />
                <input
                  type="number"
                  name="loanAmount"
                  value={formData.loanAmount}
                  onChange={handleChange}
                  className="w-full outline-none text-black"
                  required
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition duration-300"
              >
                Check Eligibility
              </button>
            </div>
          </form>
          {result && (
            <div
              className={`mt-6 p-4 rounded-lg text-center font-medium ${
                result.includes("eligible")
                  ? "bg-green-100 text-green-800 border border-green-400"
                  : "bg-red-100 text-red-800 border border-red-400"
              }`}
            >
              {result}
            </div>
          )}
          

          <div className="mt-6">
            {formData.age && (
              <p className="text-gray-600">
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
