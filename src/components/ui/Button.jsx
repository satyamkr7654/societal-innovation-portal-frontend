import React from 'react';
import Spinner from './Spinner';

/**
 * Button - Standard civic-tech interactive button
 * @param {'primary' | 'accent' | 'secondary' | 'outline' | 'danger'} variant - Visual appearance
 * @param {'sm' | 'md' | 'lg'} size - Button scale
 * @param {boolean} isLoading - Loading state with spinner
 * @param {boolean} disabled - Inactive state
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon = null,
  className = '',
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium font-sans rounded transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer select-none';

  const variantMap = {
    primary:
      'bg-primary hover:bg-primary-light text-white shadow-sm focus:ring-primary/50 active:bg-primary-dark',
    accent:
      'bg-accent-700 hover:bg-accent-800 text-white shadow-sm focus:ring-accent/50',
    secondary:
      'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 focus:ring-slate-300 active:bg-slate-300',
    outline:
      'bg-transparent hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400 focus:ring-slate-300 active:bg-slate-100',
    danger:
      'bg-red-600 hover:bg-red-700 text-white shadow-sm focus:ring-red-400 active:bg-red-800',
  };

  const sizeMap = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-2.5 text-base gap-2.5 font-semibold',
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variantMap[variant] || variantMap.primary}
        ${sizeMap[size] || sizeMap.md}
        ${isDisabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner size={size === 'lg' ? 'md' : 'sm'} />
          <span>{children}</span>
        </>
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
