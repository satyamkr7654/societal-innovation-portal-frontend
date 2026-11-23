import React from 'react';
import { formatRupees } from '../../utils/money';

/** Accepted funding against the budget. */
export default function FundingBar({ funding }) {
  const { needed, accepted, remaining } = funding;
  const percent = Math.min(100, Math.floor((accepted / needed) * 100));
  return (
    <div className="space-y-1.5 text-sm">
      <div
        role="progressbar"
        aria-label="Funding received"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 rounded-full bg-slate-200 overflow-hidden"
      >
        <div className="h-full bg-emerald-600" style={{ width: `${percent}%` }} />
      </div>
      <p className="text-slate-600">
        <strong className="text-slate-900">{formatRupees(accepted)}</strong> of{' '}
        {formatRupees(needed)} accepted •{' '}
        {remaining > 0 ? `${formatRupees(remaining)} still needed` : 'fully funded'}
      </p>
    </div>
  );
}
