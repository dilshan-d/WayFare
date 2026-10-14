import React from 'react';

export const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 animate-pulse">
    <div className="h-48 bg-slate-200 w-full"></div>
    <div className="p-5 space-y-3">
      <div className="h-5 bg-slate-200 rounded w-3/4"></div>
      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
      <div className="pt-2 flex justify-between items-center">
        <div className="h-6 bg-slate-200 rounded w-1/3"></div>
        <div className="h-9 bg-slate-200 rounded-xl w-24"></div>
      </div>
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default SkeletonGrid;
