// src/pages/LoanEligibilityForm.tsx
import React, { useState } from 'react';

const LoanEligibilityForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    income: '',
    age: '',
    loanAmount: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just log the data to the console
    console.log(formData);
  };

  const getAgeGroup = (age: number) => {
    if (age < 18) {
      return 'Teenager';
    } else if (age >= 18 && age < 60) {
      return 'Adult';
    } else {
      return 'Old-Aged';
    }
  };

  return (
    <div className='min-w-screen min-h-screen'>
    <div className="min-h-1/3 bg-gray-50 flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full bg-white px-4 py-2 rounded-lg shadow-lg">


        <p className=" text-3xl  text-center text-gray-800 mb-6">
          Loan Eligibility Form
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">

          <div>
            <label className="block text-lg font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 p-1 border text-black border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">Income</label>
            <input
              type="number"
              name="income"
              value={formData.income}
              onChange={handleChange}
              className="mt-1 p-1 border text-black border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="mt-1 p-1 border text-black border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">Loan Amount</label>
            <input
              type="number"
              name="loanAmount"
              value={formData.loanAmount}
              onChange={handleChange}
              className="mt-1 p-1 border text-black border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Check Eligibility
            </button>
          </div>
        </form>
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
