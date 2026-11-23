import React, { useState } from 'react';
import { CHART_COLORS, axisTicks, monthLabel } from '../../utils/charts';
import ChartCard from './ChartCard';

const SERIES = [
  { key: 'reported', name: 'Reported', color: CHART_COLORS.primary },
  { key: 'solved', name: 'Solved', color: CHART_COLORS.secondary },
];
const HEIGHT = 180; // px, plot area

/** Reported and solved problems per month, as paired columns on one axis. */
export default function TrendChart({ months }) {
  const [active, setActive] = useState(null);
  const ticks = axisTicks(Math.max(...months.flatMap((m) => [m.reported, m.solved])));
  const top = ticks.at(-1);
  const isEmpty = months.every((m) => m.reported === 0 && m.solved === 0);

  return (
    <ChartCard
      title="Reported and solved, last 12 months"
      columns={['Month', 'Reported', 'Solved']}
      rows={months.map((m) => [monthLabel(m.month), m.reported, m.solved])}
      isEmpty={isEmpty}
    >
      <ul className="flex gap-4 text-xs text-slate-600 mb-4">
        {SERIES.map((s) => (
          <li key={s.key} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: s.color }} />
            {s.name}
          </li>
        ))}
      </ul>

      <div className="flex">
        <div
          className="relative w-8 shrink-0 text-[11px] text-slate-500 tabular-nums"
          style={{ height: HEIGHT }}
          aria-hidden="true"
        >
          {ticks.map((tick) => (
            <span
              key={tick}
              className="absolute right-2 -translate-y-1/2"
              style={{ top: HEIGHT - (tick / top) * HEIGHT }}
            >
              {tick}
            </span>
          ))}
        </div>

        <div className="flex-1 min-w-0">
          <div className="relative" style={{ height: HEIGHT }}>
            {ticks.map((tick) => (
              <div
                key={tick}
                className={`absolute inset-x-0 border-t ${
                  tick === 0 ? 'border-slate-300' : 'border-slate-100'
                }`}
                style={{ top: HEIGHT - (tick / top) * HEIGHT }}
              />
            ))}
            <div className="absolute inset-0 flex">
              {months.map((m, index) => (
                <button
                  key={m.month}
                  type="button"
                  aria-label={`${monthLabel(m.month)}: ${m.reported} reported, ${m.solved} solved`}
                  onPointerEnter={() => setActive(index)}
                  onPointerLeave={() => setActive(null)}
                  onFocus={() => setActive(index)}
                  onBlur={() => setActive(null)}
                  className={`relative flex-1 flex items-end justify-center gap-0.5 cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                    active === index ? 'bg-slate-100/70' : ''
                  }`}
                >
                  {SERIES.map((s) => (
                    <span
                      key={s.key}
                      className="w-[35%] max-w-[16px] rounded-t"
                      style={{
                        height: (m[s.key] / top) * HEIGHT,
                        backgroundColor: s.color,
                      }}
                    />
                  ))}
                  {active === index && (
                    <span
                      role="tooltip"
                      className={`absolute bottom-full mb-1 z-10 bg-white border border-slate-200 rounded-lg shadow-md p-2 text-left text-xs whitespace-nowrap pointer-events-none ${
                        index < 2 ? 'left-0' : index > 9 ? 'right-0' : ''
                      }`}
                    >
                      <span className="block text-slate-500 mb-1">
                        {monthLabel(m.month)}
                      </span>
                      {SERIES.map((s) => (
                        <span key={s.key} className="flex items-center gap-1.5">
                          <span
                            className="w-3 h-0.5"
                            style={{ backgroundColor: s.color }}
                          />
                          <strong className="text-slate-900">{m[s.key]}</strong>
                          <span className="text-slate-500">{s.name}</span>
                        </span>
                      ))}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
          <div
            className="flex text-[10px] sm:text-[11px] text-slate-500 mt-1.5"
            aria-hidden="true"
          >
            {months.map((m, index) => (
              <span
                key={m.month}
                className={`flex-1 text-center ${index % 2 ? 'hidden sm:block' : 'max-sm:flex-[2]'}`}
              >
                {monthLabel(m.month, { month: 'short' })}
              </span>
            ))}
          </div>
        </div>
      </div>
    </ChartCard>
  );
}
