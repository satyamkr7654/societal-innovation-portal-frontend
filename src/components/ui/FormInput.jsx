import React, { forwardRef } from 'react';

/**
 * FormInput - Reusable Form Input Field with React Hook Form ref support
 * Features label, error slot, helper text, and design-token focus rings.
 */
const FormInput = forwardRef(function FormInput(
  {
    label,
    name,
    type = 'text',
    placeholder = '',
    error = null,
    helperText = '',
    required = false,
    icon = null,
    className = '',
    ...props
  },
  ref
) {
  // Support error either as a string or an error object with message property
  const errorMessage = typeof error === 'string' ? error : error?.message;

  return (
    <div className={`space-y-1.5 font-sans ${className}`}>
      {/* Label & Required indicator */}
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={name}
            className="block text-xs font-bold uppercase tracking-wider text-slate-700"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        </div>
      )}

      {/* Input container with optional icon */}
      <div className="relative rounded">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            {icon}
          </div>
        )}

        <input
          ref={ref}
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          aria-invalid={errorMessage ? 'true' : 'false'}
          aria-describedby={errorMessage ? `${name}-error` : undefined}
          className={`
            w-full rounded bg-white text-sm text-slate-900 placeholder:text-slate-400 transition duration-150 ease-in-out
            py-2.5 ${icon ? 'pl-10 pr-3.5' : 'px-3.5'}
            border
            ${
              errorMessage
                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-slate-300 hover:border-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20'
            }
            focus:outline-none
          `}
          {...props}
        />
      </div>

      {/* Real-time Validation Error Message */}
      {errorMessage ? (
        <p
          id={`${name}-error`}
          className="flex items-center gap-1.5 text-xs text-red-600 font-medium animate-in fade-in duration-150"
        >
          <svg
            className="w-3.5 h-3.5 shrink-0 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{errorMessage}</span>
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
});

export default FormInput;
