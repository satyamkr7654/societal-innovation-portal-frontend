import React from 'react';
import { getStatusConfig } from '../../constants/statusConfig';

/**
 * Badge - Problem status indicator chip using civic status tokens
 * @param {string} status - Any lifecycle status, in any casing
 * @param {'sm' | 'md'} size - Badge size
 */
export default function Badge({
  status = 'submitted',
  children,
  size = 'md',
  showDot = true,
  className = '',
}) {
  const config = getStatusConfig(status);

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-[10px] gap-1.5',
    md: 'px-3 py-1 text-xs gap-2',
  };

  return (
    <span
      className={`
        inline-flex items-center font-bold font-sans rounded-full border tracking-wide uppercase select-none
        ${config.bgColor} ${config.textColor} ${config.borderColor}
        ${sizeStyles[size] || sizeStyles.md}
        ${className}
      `}
    >
      {showDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dotColor}`}
          aria-hidden="true"
        />
      )}
      <span>{children || config.display}</span>
    </span>
  );
}
