import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon, Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../contexts/AuthContext';

interface SignUpPageProps {
  onComplete: (data: { email: string; password: string }) => void;
  onBack: () => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onComplete, onBack }) => {
  const { signup, loading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear auth error when user starts typing
    if (error) {
      clearError();
    }
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await signup(formData.email, formData.password);
        // Call onComplete to proceed to onboarding
        onComplete({
          email: formData.email,
          password: formData.password,
        });
      } catch (err) {
        // Error is handled by the auth context
        console.error('Signup failed:', err);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 px-4 py-12">
      <div className="w-full max-w-md space-y-12">
        <div className="flex flex-col items-center justify-center space-y-8">
          <Logo />
          <div className="text-center">
            <h2 className="text-2xl text-gray-200 font-light tracking-wide">
              Create your account
            </h2>
            <p className="mt-2 text-gray-400">
              Join thousands of educators using AI for personalized tutoring
            </p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className={`bg-white/5 block w-full pl-10 pr-3 py-2.5 border ${
                    errors.email ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-200`}
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  className={`bg-white/5 block w-full pl-10 pr-10 py-2.5 border ${
                    errors.password ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-200`}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                  {showPassword ? (
                    <EyeOffIcon
                      size={18}
                      className="text-gray-500 hover:text-gray-400 transition-colors"
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <EyeIcon
                      size={18}
                      className="text-gray-500 hover:text-gray-400 transition-colors"
                      onClick={() => setShowPassword(true)}
                    />
                  )}
                </div>
              </div>
              {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password}</p>}
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-500" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  className={`bg-white/5 block w-full pl-10 pr-3 py-2.5 border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-200`}
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              {errors.confirmPassword && <p className="mt-2 text-sm text-red-500">{errors.confirmPassword}</p>}
            </div>

            {/* Show authentication error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
                </span>
                {loading ? 'Creating account...' : 'Continue'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={onBack}
                disabled={loading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-700 rounded-lg shadow-sm bg-white/5 text-sm font-medium text-gray-300 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};