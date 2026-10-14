import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <FiChevronLeft className="w-5 h-5" />
      </button>

      {Array.from({ length: totalPages }).map((_, index) => {
        const pageNum = index + 1;
        const isActive = pageNum === currentPage;
        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`w-10 h-10 rounded-xl font-medium text-sm transition ${
              isActive
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {pageNum}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <FiChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;
