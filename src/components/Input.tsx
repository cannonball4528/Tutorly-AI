import React from 'react';

interface InputProps {
  id: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  error?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  id,
  name,
  type,
  value,
  onChange,
  placeholder,
  icon,
  error,
  className = '',
}) => {
  return (
    <div>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`bg-gray-800/50 block w-full ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border ${
            error ? 'border-red-500' : 'border-gray-700'
          } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-gray-200 ${className}`}
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};