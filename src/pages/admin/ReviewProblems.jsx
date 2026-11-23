import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import LoadState from '../../components/ui/LoadState';
import { ALL_STATUSES, STATUS_CONFIG } from '../../constants/statusConfig';
import { useAsync } from '../../hooks/useAsync';
import { listProblems } from '../../services/problemService';
import { DEFAULT_FILTERS, countByStatus, filterProblems } from '../../utils/problems';

const NO_PROBLEMS = [];
const TAB_LABELS = { ALL: 'All', DECISION: 'Project decisions' };

export default function ReviewProblems() {
  const { data, error, isLoading, reload } = useAsync(listProblems);
  // Kept in the URL, so returning from a problem restores the same list
  const [params, setParams] = useSearchParams();
  const requested = params.get('status');
  const status = ['ALL', 'DECISION', ...ALL_STATUSES].includes(requested)
    ? requested
    : 'SUBMITTED';
  const search = params.get('q') || '';

  const problems = data || NO_PROBLEMS;
  const counts = useMemo(
    () => ({
      ...countByStatus(problems),
      DECISION: problems.filter((p) => p.pendingDecision).length,
    }),
    [problems]
  );
  // Oldest first, so nobody is kept waiting by newer reports
  const shown = useMemo(
    () =>
      filterProblems(
        status === 'DECISION' ? problems.filter((p) => p.pendingDecision) : problems,
        {
          ...DEFAULT_FILTERS,
          status: status === 'DECISION' ? 'ALL' : status,
          search,
          sort: 'oldest',
        }
      ),
    [problems, status, search]
  );

  const update = (next) =>
    setParams({ status, ...(search && { q: search }), ...next }, { replace: true });

  if (isLoading || error) return <LoadState error={error} onRetry={reload} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-slate-900">
          Review Problems
        </h2>
        <p className="text-sm text-slate-500">
          Check each report, then validate, reject or assign it. Oldest reports come
          first.
        </p>
      </div>

      <div className="space-y-3">
        <input
          type="search"
          aria-label="Search problems"
          placeholder="Search by case ID, title, district or address"
          value={search}
          onChange={(e) => update({ q: e.target.value })}
          className="w-full px-4 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['DECISION', ...ALL_STATUSES, 'ALL'].map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={status === key}
              onClick={() => update({ status: key })}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                status === key
                  ? 'bg-primary text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {TAB_LABELS[key] || STATUS_CONFIG[key].display} ({counts[key]})
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="bg-white rounded-xl border border-slate-200 p-10 text-center text-sm text-slate-500">
          No problems here.
        </p>
      ) : (
        <ul className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
          {shown.map((p) => (
            <li key={p.id}>
              <Link
                to={`/admin/problems/${p.id}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 hover:bg-slate-50"
              >
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-900">
                    {p.title}
                  </span>
                  <span className="block text-xs text-slate-500 mt-0.5">
                    {p.pendingDecision && (
                      <strong className="text-accent-700">
                        {p.pendingDecision === 'PROPOSAL'
                          ? 'Proposal to review • '
                          : 'Completion to confirm • '}
                      </strong>
                    )}
                    {p.id} • {p.category} • {p.district} •{' '}
                    {new Date(p.submittedAt).toLocaleDateString('en-IN')}
                  </span>
                </span>
                <span className="shrink-0">
                  <Badge status={p.status} size="sm" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
