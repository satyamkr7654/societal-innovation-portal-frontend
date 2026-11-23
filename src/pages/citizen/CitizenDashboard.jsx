import React from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAsync } from '../../hooks/useAsync';
import { listProblems } from '../../services/problemService';
import { isProblemOwner } from '../../utils/problems';
import LoadState from '../../components/ui/LoadState';

export default function CitizenDashboard() {
  const { user } = useAuth();
  const { data, error, isLoading, reload } = useAsync(listProblems);

  if (isLoading || error) return <LoadState error={error} onRetry={reload} />;

  const myProblems = data
    .filter((p) => isProblemOwner(p, user))
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  const countBy = (...statuses) =>
    myProblems.filter((p) => statuses.includes(p.status)).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-slate-900">
            Citizen Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Overview of your reported local issues and community resolution status in
            Jharkhand.
          </p>
        </div>
        <Button to="/citizen/submit" variant="primary" size="md">
          + Report New Problem
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hover={true}>
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Total Reported
            </span>
            <div className="text-3xl font-heading font-black text-primary">
              {myProblems.length}
            </div>
            <p className="text-xs text-slate-500">Civic issues lodged by you</p>
          </div>
        </Card>
        <Card hover={true}>
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              In Progress
            </span>
            <div className="text-3xl font-heading font-black text-amber-600">
              {countBy('ASSIGNED', 'IN_PROGRESS')}
            </div>
            <p className="text-xs text-slate-500">Assigned to university R&D</p>
          </div>
        </Card>
        <Card hover={true}>
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Resolved & Closed
            </span>
            <div className="text-3xl font-heading font-black text-emerald-600">
              {countBy('SOLVED')}
            </div>
            <p className="text-xs text-slate-500">Solved problems</p>
          </div>
        </Card>
      </div>

      <Card
        header={
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-slate-800 text-sm">
              Recent Reports
            </h3>
            <Link
              to="/citizen/problems"
              className="text-xs font-semibold text-primary hover:underline"
            >
              View all
            </Link>
          </div>
        }
      >
        {myProblems.length === 0 ? (
          <p className="text-sm text-slate-600">
            You have not reported any problems yet. Use &quot;Report New Problem&quot; to
            submit your first one.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {myProblems.slice(0, 5).map((p) => (
              <li
                key={p.id}
                className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
              >
                <Link
                  to={`/citizen/problems/${p.id}`}
                  className="min-w-0 truncate text-sm font-medium text-slate-800 hover:text-primary hover:underline"
                >
                  {p.title}
                </Link>
                <span className="shrink-0">
                  <Badge status={p.status} size="sm" />
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
