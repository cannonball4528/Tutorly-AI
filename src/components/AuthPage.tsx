import React from 'react';
import { Logo } from './Logo';
import { AuthForm } from './AuthForm';

interface AuthPageProps {
  onSignUp: () => void;
  onLogin: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSignUp, onLogin }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 px-4 py-12">
      <div className="w-full max-w-md space-y-12">
        <div className="flex flex-col items-center justify-center space-y-8">
          <Logo size="large" />
          <div className="text-center">
            <h2 className="text-center text-2xl text-gray-200 font-light tracking-wide mb-2">
              AI-Powered Learning Platform
            </h2>
            <p className="text-gray-400 text-sm">
              Upload student worksheets, get AI analysis, and generate personalized questions
            </p>
          </div>
        </div>

        <AuthForm onSignUp={onSignUp} onLogin={onLogin} />
      </div>
    </div>
  );
};