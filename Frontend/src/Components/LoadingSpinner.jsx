import React from 'react';

export const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-10 h-10 border-3',
    large: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div
        className={`${sizeClasses[size]} border-cyan-500 border-t-transparent rounded-full animate-spin`}
      ></div>
      {text && <p className="mt-3 text-sm text-slate-500 font-medium">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
