import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import FundingBar from '../../components/problems/FundingBar';
import LoadState from '../../components/ui/LoadState';
import { CIVIC_CATEGORIES } from '../../constants/categories';
import { useAsync } from '../../hooks/useAsync';
import { listOpenProposals } from '../../services/pledgeService';
import { DEFAULT_FILTERS, filterProblems } from '../../utils/problems';

const selectClass =
  'w-full py-2 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500';

const NO_ROWS = [];

export default function BrowseProposals() {
  const { data, error, isLoading, reload } = useAsync(listOpenProposals);
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS, sort: 'oldest' });
  const [needsFunding, setNeedsFunding] = useState(false);
  const rows = data || NO_ROWS;

  const shown = useMemo(() => {
    const byId = new Map(rows.map((row) => [row.problem.id, row]));
    return filterProblems(
      rows.map((row) => row.problem),
      filters
    )
      .map((problem) => byId.get(problem.id))
      .filter((row) => !needsFunding || row.funding.remaining > 0);
  }, [rows, filters, needsFunding]);

  const change = (name, value) => setFilters((f) => ({ ...f, [name]: value }));
  const districts = [...new Set(rows.map((row) => row.problem.district))].sort();

  if (isLoading || error) return <LoadState error={error} onRetry={reload} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-slate-900">
          Browse Proposals
        </h2>
        <p className="text-sm text-slate-500">
          Approved university proposals that are open for support.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          type="search"
          aria-label="Search proposals"
          placeholder="Search problem or university"
          value={filters.search}
          onChange={(e) => change('search', e.target.value)}
          className={selectClass}
        />
        <select
          aria-label="Category"
          value={filters.category}
          onChange={(e) => change('category', e.target.value)}
          className={selectClass}
        >
          <option value="ALL">All categories</option>
          {CIVIC_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        <select
          aria-label="District"
          value={filters.district}
          onChange={(e) => change('district', e.target.value)}
          className={selectClass}
        >
          <option value="ALL">All districts</option>
          {districts.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={needsFunding}
            onChange={(e) => setNeedsFunding(e.target.checked)}
          />
          Still needs funding
        </label>
      </div>

      {shown.length === 0 ? (
        <p className="bg-white rounded-xl border border-slate-200 p-10 text-center text-sm text-slate-500">
          {rows.length === 0
            ? 'No proposals are open for support yet.'
            : 'No proposals match these filters.'}
        </p>
      ) : (
        <ul className="space-y-4">
          {shown.map(({ problem, summary, durationWeeks, funding, hasPendingPledge }) => (
            <li
              key={problem.id}
              className="bg-white rounded-xl border border-slate-200 p-5 space-y-3"
            >
              <div>
                <Link
                  to={`/industry/problems/${problem.id}`}
                  className="font-heading font-bold text-slate-900 hover:text-primary-600 hover:underline"
                >
                  {problem.title}
                </Link>
                <p className="text-xs text-slate-500 mt-0.5">
                  {problem.assignedUniversity.name} • {problem.category} •{' '}
                  {problem.district} • {durationWeeks} weeks
                </p>
              </div>
              <p className="text-sm text-slate-600 line-clamp-2 break-words">{summary}</p>
              <FundingBar funding={funding} />
              {hasPendingPledge && (
                <p className="text-xs font-semibold text-accent-700">
                  Your offer is waiting for the university.
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
