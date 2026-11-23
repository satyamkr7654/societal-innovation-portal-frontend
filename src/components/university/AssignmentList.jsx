import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';

/** Rows linking to the university's problems. `describe` adds a line to each. */
export default function AssignmentList({ rows, describe, empty }) {
  if (rows.length === 0) {
    return (
      <p className="bg-white rounded-xl border border-slate-200 p-10 text-center text-sm text-slate-500">
        {empty}
      </p>
    );
  }
  return (
    <ul className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
      {rows.map((row) => (
        <li key={row.problem.id}>
          <Link
            to={`/university/problems/${row.problem.id}`}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 hover:bg-slate-50"
          >
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-slate-900">
                {row.problem.title}
              </span>
              <span className="block text-xs text-slate-500 mt-0.5">
                {row.problem.id} • {row.problem.district} • {describe(row)}
              </span>
            </span>
            <span className="shrink-0">
              <Badge status={row.problem.status} size="sm" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
