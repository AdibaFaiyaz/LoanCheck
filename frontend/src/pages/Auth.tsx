import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService, testBackendConnection } from '../services/api';
import type { LoginData, RegisterData } from '../types/index';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [backendStatus, setBackendStatus] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    // Test backend connection on component mount
    const checkBackend = async () => {
      const isConnected = await testBackendConnection();
      setBackendStatus(isConnected ? 'Connected' : 'Disconnected');
      if (!isConnected) {
        setError('Backend server is not running. Please start the backend server first.');
      }
    };
    checkBackend();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      if (isLogin) {
        // Login
        const loginData: LoginData = {
          email: formData.email,
          password: formData.password
        };
        
        console.log('🔍 Sending login request for:', formData.email);
        
        try {
          const response = await apiService.login(loginData);
          console.log('✅ Login response:', response);
          
          if (response && response.success) {
            setSuccess('Login successful!');
            // Store user data in localStorage (or use context)
            localStorage.setItem('user', JSON.stringify(response.user));
            // Redirect to eligibility form after successful login
            setTimeout(() => navigate('/loan-eligibility'), 1000);
          } else {
            setError(response?.message || 'Invalid email or password');
          }
        } catch (loginError: any) {
          console.error('🚨 Login API Error:', loginError);
          
          // Handle specific login errors
          if (loginError.message && loginError.message.includes('401')) {
            setError('Invalid email or password. Please check your credentials.');
          } else if (loginError.message && loginError.message.includes('404')) {
            setError('User not found. Please sign up first.');
          } else {
            setError(loginError.message || 'Login failed. Please try again.');
          }
        }
      } else {
        // Signup
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        
        const registerData: RegisterData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          phone: '' // Optional for now
        };
        
        console.log('🔍 Sending signup request:', { ...registerData, password: '***' });
        
        try {
          const response = await apiService.register(registerData);
          console.log('✅ Signup response:', response);
          
          if (response && response.success) {
            setSuccess('Account created successfully!');
            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(response.user));
            // Redirect to eligibility form after successful signup
            setTimeout(() => navigate('/loan-eligibility'), 1000);
          } else {
            // If response exists but success is false, show the actual error
            setError(response?.message || 'Signup failed - please try again');
          }
        } catch (signupError: any) {
          console.error('🚨 Signup API Error:', signupError);
          
          // Handle specific signup errors
          if (signupError.message && signupError.message.includes('409')) {
            setError('Account with this email already exists. Please try logging in instead.');
            // Auto-switch to login mode
            setTimeout(() => {
              setIsLogin(true);
              setError('');
            }, 2000);
          } else if (signupError.message && signupError.message.includes('already exists')) {
            setError('Account with this email already exists. Please try logging in instead.');
            setTimeout(() => {
              setIsLogin(true);
              setError('');
            }, 2000);
          } else {
            setError(signupError.message || 'Failed to create account. Please try again.');
          }
        }
      }
    } catch (error: any) {
      console.error('🚨 Authentication error:', error);
      console.error('Error type:', typeof error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      setError(error.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    });
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-x-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="mb-8 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home</span>
          </button>

          {/* Auth Card */}
          <div className="bg-gray-800/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-600/30 overflow-hidden">
            <div className="px-8 py-10">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-gray-400">
                  {isLogin ? 'Sign in to check your loan eligibility' : 'Sign up to get started with loan eligibility'}
                </p>
                {backendStatus && (
                  <div className={`mt-2 text-sm ${backendStatus === 'Connected' ? 'text-green-400' : 'text-red-400'}`}>
                    Backend: {backendStatus}
                  </div>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
                    {error}
                  </div>
                )}
                
                {/* Success Message */}
                {success && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-green-400 text-sm">
                    {success}
                  </div>
                )}
                
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                  />
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Confirm your password"
                    />
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  )}
                </button>

                {/* Toggle Auth Mode */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={toggleAuthMode}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {isLogin ? (
                      <>
                        Don't have an account?{' '}
                        <span className="text-blue-400 hover:text-blue-300 font-medium">
                          Sign up
                        </span>
                      </>
                    ) : (
                      <>
                        Already have an account?{' '}
                        <span className="text-blue-400 hover:text-blue-300 font-medium">
                          Sign in
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Social Login Options */}
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-800/30 text-gray-400">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-3 px-4 border border-gray-600 rounded-xl bg-gray-700/50 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="ml-2">Google</span>
                  </button>

                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-3 px-4 border border-gray-600 rounded-xl bg-gray-700/50 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                    <span className="ml-2">Twitter</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
