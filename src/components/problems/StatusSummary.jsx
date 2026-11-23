import React from 'react';
import { STATUS_CONFIG, WORKFLOW_STAGES } from '../../constants/statusConfig';

/** Clickable count cards, one per workflow stage. */
export default function StatusSummary({ counts, selected, onSelect }) {
  const items = [
    {
      key: 'ALL',
      label: 'Total Tracked',
      style: 'bg-white border-slate-200 text-slate-900',
    },
    ...WORKFLOW_STAGES.map((key) => {
      const { display, bgColor, borderColor, textColor } = STATUS_CONFIG[key];
      return { key, label: display, style: `${bgColor} ${borderColor} ${textColor}` };
    }),
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {items.map(({ key, label, style }) => (
        <button
          key={key}
          type="button"
          aria-pressed={selected === key}
          onClick={() => onSelect(key)}
          className={`p-3.5 rounded-lg border text-left transition-all duration-200 ${style} ${
            selected === key
              ? 'ring-2 ring-primary-500 shadow-md -translate-y-0.5'
              : 'hover:border-slate-400 hover:shadow-sm'
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            {label}
          </div>
          <div className="text-2xl font-heading font-black">{counts[key]}</div>
        </button>
      ))}
    </div>
  );
}
