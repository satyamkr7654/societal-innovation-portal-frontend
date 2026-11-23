import React, { useState } from 'react';
import Card from '../ui/Card';

/** A titled chart with the same numbers available as a table. */
export default function ChartCard({ title, columns, rows, isEmpty, children }) {
  const [showTable, setShowTable] = useState(false);
  return (
    <Card
      className="overflow-visible"
      header={
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-heading font-bold text-sm text-slate-800">{title}</h3>
          {!isEmpty && (
            <button
              type="button"
              aria-pressed={showTable}
              onClick={() => setShowTable(!showTable)}
              className="text-xs font-semibold text-primary-700 hover:underline shrink-0"
            >
              {showTable ? 'Show chart' : 'Show table'}
            </button>
          )}
        </div>
      }
    >
      {isEmpty && <p className="text-sm text-slate-500">No problems reported yet.</p>}
      {!isEmpty && !showTable && children}
      {!isEmpty && showTable && (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-500">
              {columns.map((column, i) => (
                <th
                  key={column}
                  scope="col"
                  className={`pb-2 font-semibold ${i === 0 ? 'text-left' : 'text-right'}`}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map(([name, ...values]) => (
              <tr key={name}>
                <td className="py-1.5 text-slate-700">{name}</td>
                {values.map((value, i) => (
                  <td
                    key={columns[i + 1]}
                    className="py-1.5 text-right tabular-nums text-slate-900"
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}
