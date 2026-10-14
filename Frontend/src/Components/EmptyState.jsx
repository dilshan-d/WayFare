import React from 'react';
import { FiInbox } from 'react-icons/fi';

export const EmptyState = ({
  title = 'No items found',
  message = 'Try adjusting your filters or search terms to find what you are looking for.',
  actionText,
  onAction,
}) => {
  return (
    <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm max-w-md mx-auto my-8">
      <div className="w-16 h-16 bg-sky-50 text-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <FiInbox className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm mb-6 leading-relaxed">{message}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-xl text-sm transition"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
