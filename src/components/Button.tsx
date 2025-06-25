import React from 'react';

interface ButtonProps {
  primary?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  primary = false,
  children,
  onClick,
  type = 'button',
  className = '',
  disabled = false,
}) => {
  const baseClasses = 'py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 font-medium';
  
  const variantClasses = primary
    ? 'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white focus:ring-purple-500 shadow-sm'
    : 'border border-gray-700 bg-transparent text-gray-300 hover:bg-gray-800 focus:ring-gray-500';
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};