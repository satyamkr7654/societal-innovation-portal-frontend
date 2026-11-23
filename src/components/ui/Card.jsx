import React from 'react';

/**
 * Card - Standard container adhering to civic design tokens
 * @param {boolean} hover - Adds hover elevation
 * @param {'none' | 'sm' | 'md' | 'lg'} padding - Inner spacing scale
 */
export default function Card({
  children,
  header = null,
  footer = null,
  hover = false,
  padding = 'md',
  className = '',
  ...props
}) {
  const paddingMap = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  return (
    <div
      className={`
        bg-white rounded-lg border border-slate-200/90 shadow-card overflow-hidden
        ${hover ? 'hover:shadow-card-hover hover:-translate-y-0.5 transition duration-200' : ''}
        ${className}
      `}
      {...props}
    >
      {header && (
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">{header}</div>
      )}

      <div className={paddingMap[padding] || paddingMap.md}>{children}</div>

      {footer && (
        <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/50">
          {footer}
        </div>
      )}
    </div>
  );
}
