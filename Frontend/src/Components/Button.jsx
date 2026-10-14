import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm';

  const variants = {
    primary:
      'bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white focus:ring-cyan-500 shadow-cyan-500/20',
    secondary:
      'bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white focus:ring-slate-800',
    outline:
      'bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-cyan-500',
    danger:
      'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-red-500/20',
    ghost:
      'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-400 shadow-none',
  };

  const sizes = {
    small: 'px-3 py-1.5 text-xs gap-1.5',
    medium: 'px-5 py-2.5 text-sm gap-2',
    large: 'px-6 py-3.5 text-base gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
