import React from 'react';
import { GraduationCap, Brain } from 'lucide-react';

interface LogoProps {
  size?: 'small' | 'large';
}

export const Logo: React.FC<LogoProps> = ({ size = 'small' }) => {
  if (size === 'large') {
    return (
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <GraduationCap size={32} className="text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <Brain size={12} className="text-white" />
            </div>
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Tutorly AI
            </h1>
            <p className="text-gray-400 text-sm font-medium">Intelligent Tutoring</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
          <GraduationCap size={20} className="text-white" />
        </div>
        <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
          <Brain size={8} className="text-white" />
        </div>
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
        Tutorly AI
      </span>
    </div>
  );
};