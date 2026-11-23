import React from 'react';
import { CHART_COLORS } from '../../utils/charts';
import ChartCard from './ChartCard';

/** Ranked horizontal bars: one series, so one colour and no legend. */
export default function BarList({ title, label, rows }) {
  const max = Math.max(1, ...rows.map((row) => row.count));
  return (
    <ChartCard
      title={title}
      columns={[label, 'Problems']}
      rows={rows.map((row) => [row.name, row.count])}
      isEmpty={rows.length === 0}
    >
      <ul className="space-y-2">
        {rows.map((row) => (
          <li
            key={row.name}
            title={`${row.count} ${row.count === 1 ? 'problem' : 'problems'} – ${row.name}`}
            className="grid grid-cols-[8rem_1fr] items-center gap-3 text-xs group"
          >
            <span className="text-slate-600 truncate">{row.name}</span>
            <span className="flex items-center gap-2 border-l border-slate-200">
              <span
                className="h-4 rounded-r group-hover:opacity-80"
                style={{
                  width: `${(row.count / max) * 85}%`,
                  backgroundColor: CHART_COLORS.primary,
                }}
              />
              <span className="font-semibold text-slate-900 tabular-nums">
                {row.count}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </ChartCard>
  );
}
