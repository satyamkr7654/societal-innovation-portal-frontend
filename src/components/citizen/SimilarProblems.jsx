import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import { findSimilarProblems } from '../../services/problemService';

const WAIT_MS = 400;
const NONE = [];

/** Warns about open problems of the same category near the pin. Never blocks. */
export default function SimilarProblems({ category, location }) {
  const key = location ? `${category}|${location.lat}|${location.lng}` : null;
  const [result, setResult] = useState({ key: null, problems: NONE });

  useEffect(() => {
    if (!key) return undefined;
    let isActive = true;
    const timer = setTimeout(() => {
      findSimilarProblems(category, location).then(
        (problems) => isActive && setResult({ key, problems }),
        () => {} // only a hint: reporting must still work
      );
    }, WAIT_MS);
    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, [key, category, location]);

  // Results for an earlier pin or category are ignored
  const problems = result.key === key ? result.problems : NONE;
  if (problems.length === 0) return null;

  return (
    <div
      role="status"
      className="p-4 rounded-lg bg-amber-50 border border-amber-200 space-y-2 text-sm"
    >
      <p className="font-semibold text-amber-900">
        Similar problems are already reported within 500 m. Please check before
        submitting.
      </p>
      <ul className="space-y-1.5">
        {problems.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center gap-2">
            <Link
              to={`/citizen/problems/${p.id}`}
              target="_blank"
              className="text-primary-700 font-medium underline break-words"
            >
              {p.title}
            </Link>
            <span className="text-xs text-slate-600">{p.distanceMeters} m away</span>
            <Badge status={p.status} size="sm" />
          </li>
        ))}
      </ul>
      <p className="text-xs text-amber-900">
        If yours is different, you can still submit it.
      </p>
    </div>
  );
}
