import React from 'react';

/**
 * Badge - Problem status indicator chip using civic status tokens
 * @param {'submitted' | 'validated' | 'assigned' | 'progress' | 'solved' | 'rejected'} status - Problem workflow state
 * @param {'sm' | 'md'} size - Badge size
 */
export default function Badge({
  status = 'submitted',
  children,
  size = 'md',
  showDot = true,
  className = '',
}) {
  const normalized = String(status).toLowerCase().replace(/[\s_-]+/g, '');

  const statusConfigs = {
    submitted: {
      label: 'SUBMITTED',
      styles: 'bg-status-submitted-bg text-status-submitted-text border-status-submitted-border',
      dotColor: 'bg-slate-400',
    },
    validated: {
      label: 'VALIDATED',
      styles: 'bg-status-validated-bg text-status-validated-text border-status-validated-border',
      dotColor: 'bg-blue-500',
    },
    assigned: {
      label: 'ASSIGNED',
      styles: 'bg-status-assigned-bg text-status-assigned-text border-status-assigned-border',
      dotColor: 'bg-purple-500',
    },
    progress: {
      label: 'IN PROGRESS',
      styles: 'bg-status-progress-bg text-status-progress-text border-status-progress-border',
      dotColor: 'bg-amber-500',
    },
    inprogress: {
      label: 'IN PROGRESS',
      styles: 'bg-status-progress-bg text-status-progress-text border-status-progress-border',
      dotColor: 'bg-amber-500',
    },
    solved: {
      label: 'SOLVED',
      styles: 'bg-status-solved-bg text-status-solved-text border-status-solved-border',
      dotColor: 'bg-emerald-500',
    },
    rejected: {
      label: 'REJECTED',
      styles: 'bg-status-rejected-bg text-status-rejected-text border-status-rejected-border',
      dotColor: 'bg-red-500',
    },
  };

  const current = statusConfigs[normalized] || statusConfigs.submitted;

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-[10px] gap-1.5',
    md: 'px-3 py-1 text-xs gap-2',
  };

  return (
    <span
      className={`
        inline-flex items-center font-bold font-sans rounded-full border tracking-wide uppercase select-none
        ${current.styles}
        ${sizeStyles[size] || sizeStyles.md}
        ${className}
      `}
    >
      {showDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${current.dotColor}`}
          aria-hidden="true"
        />
      )}
      <span>{children || current.label}</span>
    </span>
  );
}
