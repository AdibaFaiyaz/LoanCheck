import React from 'react';
import { FiLoader } from 'react-icons/fi';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading...', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <FiLoader className={`animate-spin text-blue-600 ${sizeClasses[size]}`} />
      {text && <span className="text-gray-600">{text}</span>}
    </div>
  );
};

