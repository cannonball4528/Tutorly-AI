import React, { useState } from 'react';
import { Logo } from './Logo';
import { ArrowRight } from 'lucide-react';

interface OnboardingPageProps {
  onComplete: (data: OnboardingData) => void;
}

export interface OnboardingData {
  name: string;
  businessName: string;
  industry: string;
  goals: string[];
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    businessName: '',
    industry: '',
    goals: [],
  });
  const [error, setError] = useState('');

  const commonGoals = [
    'Improve student engagement',
    'Track academic progress',
    'Personalize learning paths',
    'Enhance parent communication',
    'Streamline grading process',
    'Identify learning gaps',
    'Boost student performance',
    'Manage classroom efficiently'
  ];

  const handleNext = () => {
    setError('');
    
    switch (step) {
      case 1:
        if (!data.name.trim()) {
          setError('Please tell us your name');
          return;
        }
        break;
      case 2:
        if (!data.businessName.trim()) {
          setError('Please enter your school or institution name');
          return;
        }
        break;
      case 3:
        if (!data.industry.trim()) {
          setError('Please select your education level');
          return;
        }
        break;
      case 4:
        if (data.goals.length === 0) {
          setError('Please select at least one teaching goal');
          return;
        }
        onComplete(data);
        return;
    }
    
    setStep(step + 1);
  };

  const toggleGoal = (goal: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-2xl text-gray-200 font-light tracking-wide text-center">
              Welcome to Tutorly AI! What should I call you?
            </h2>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              placeholder="Your name"
              className="bg-white/5 block w-full px-4 py-3 border border-gray-700 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-200 text-lg text-center"
              autoFocus
            />
          </>
        );
      
      case 2:
        return (
          <>
            <h2 className="text-2xl text-gray-200 font-light tracking-wide text-center">
              What school or institution do you teach at?
            </h2>
            <input
              type="text"
              value={data.businessName}
              onChange={(e) => setData({ ...data, businessName: e.target.value })}
              placeholder="School or institution name"
              className="bg-white/5 block w-full px-4 py-3 border border-gray-700 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-200 text-lg text-center"
              autoFocus
            />
          </>
        );
      
      case 3:
        return (
          <>
            <h2 className="text-2xl text-gray-200 font-light tracking-wide text-center">
              What education level do you primarily teach?
            </h2>
            <select
              value={data.industry}
              onChange={(e) => setData({ ...data, industry: e.target.value })}
              className="bg-white/5 block w-full px-4 py-3 border border-gray-700 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-200 text-lg text-center"
            >
              <option value="">Select education level</option>
              <option value="primary">Primary School (P1-P6)</option>
              <option value="secondary">Secondary School (Sec 1-4)</option>
              <option value="junior-college">Junior College (JC1-2)</option>
              <option value="university">University</option>
              <option value="mixed">Mixed Levels</option>
              <option value="other">Other</option>
            </select>
          </>
        );
      
      case 4:
        return (
          <>
            <h2 className="text-2xl text-gray-200 font-light tracking-wide text-center">
              What are your teaching goals?
            </h2>
            <p className="text-gray-400 text-center mb-6">
              Select all that apply
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {commonGoals.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => toggleGoal(goal)}
                  className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                    data.goals.includes(goal)
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                      : 'border-gray-700 bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 px-4 py-12">
      <div className="w-full max-w-md space-y-12">
        <div className="flex flex-col items-center justify-center space-y-12">
          <Logo />
          
          <div className="w-full">
            <div className="flex justify-center space-x-2 mb-12">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === step ? 'w-8 bg-emerald-500' : 'w-4 bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/10">
          <div className="space-y-6">
            {renderStep()}
            
            {error && (
              <p className="text-sm text-red-500 text-center mt-2">{error}</p>
            )}

            <button
              onClick={handleNext}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 font-medium"
            >
              <span className="flex items-center">
                {step === 4 ? 'Complete Setup' : 'Next'}
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};