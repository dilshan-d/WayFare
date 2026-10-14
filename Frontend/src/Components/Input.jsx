import React from 'react';

export const Input = ({
  label,
  error,
  icon: Icon,
  className = '',
  id,
  type = 'text',
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative rounded-xl shadow-xs">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={`w-full bg-slate-50/50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition block py-2.5 ${
            Icon ? 'pl-11' : 'pl-3.5'
          } pr-3.5 placeholder:text-slate-400 ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
};

export default Input;
