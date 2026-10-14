import React from 'react';
import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'Failed to load data. Please check your network connection and try again.',
  onRetry,
}) => {
  return (
    <div className="bg-red-50/60 rounded-2xl p-8 text-center border border-red-100 max-w-md mx-auto my-8">
      <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
        <FiAlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-red-900 mb-1">{title}</h3>
      <p className="text-red-700 text-sm mb-5 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl text-sm transition"
        >
          <FiRefreshCw className="w-4 h-4" /> Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
