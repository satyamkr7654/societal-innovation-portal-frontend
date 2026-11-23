import React from 'react';
import { Link } from 'react-router-dom';
import LoadState from '../../components/ui/LoadState';
import { useAsync } from '../../hooks/useAsync';
import { listMyPledges } from '../../services/pledgeService';
import { PLEDGE_STATUS, describePledge } from '../../utils/pledges';

export default function MyPledges() {
  const { data, error, isLoading, reload } = useAsync(listMyPledges);
  if (isLoading || error) return <LoadState error={error} onRetry={reload} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-slate-900">My Pledges</h2>
        <p className="text-sm text-slate-500">Every offer your organisation has made.</p>
      </div>
      {data.length === 0 ? (
        <p className="bg-white rounded-xl border border-slate-200 p-10 text-center text-sm text-slate-500">
          No offers yet. Browse proposals to make the first one.
        </p>
      ) : (
        <ul className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
          {data.map(({ problemId, problemTitle, pledge }) => (
            <li
              key={pledge.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="min-w-0 text-sm">
                <Link
                  to={`/industry/problems/${problemId}`}
                  className="font-semibold text-slate-900 hover:underline"
                >
                  {problemTitle}
                </Link>
                <p className="text-xs text-slate-500">
                  {describePledge(pledge)} •{' '}
                  {new Date(pledge.createdAt).toLocaleDateString('en-IN')}
                </p>
                {pledge.responseNote && (
                  <p className="text-xs text-slate-600 break-words">
                    Reason: {pledge.responseNote}
                  </p>
                )}
              </div>
              <span className="text-xs font-semibold text-slate-700 shrink-0">
                {PLEDGE_STATUS[pledge.status]}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
