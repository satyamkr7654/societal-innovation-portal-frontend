import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import BarList from '../../components/charts/BarList';
import TrendChart from '../../components/charts/TrendChart';
import Button from '../../components/ui/Button';
import LoadState from '../../components/ui/LoadState';
import { useAsync } from '../../hooks/useAsync';
import { getStats } from '../../services/adminService';
import { formatRupees } from '../../utils/money';

export default function AdminDashboard() {
  const { data: stats, error, isLoading, reload } = useAsync(getStats);
  if (isLoading || error) return <LoadState error={error} onRetry={reload} />;

  const { byStatus } = stats;
  const tiles = [
    {
      label: 'Awaiting review',
      value: byStatus.SUBMITTED,
      note: `of ${stats.total} reported`,
      to: '/admin/review?status=SUBMITTED',
    },
    {
      label: 'Ready to assign',
      value: byStatus.VALIDATED,
      note: 'Validated problems',
      to: '/admin/review?status=VALIDATED',
    },
    {
      label: 'With universities',
      value: byStatus.ASSIGNED + byStatus.IN_PROGRESS,
      note: 'Assigned or in progress',
    },
    {
      label: 'Solved',
      value: byStatus.SOLVED,
      note:
        stats.averageDaysToSolve === null
          ? 'None solved yet'
          : `${stats.averageDaysToSolve.toFixed(1)} days on average`,
      to: '/admin/review?status=SOLVED',
    },
    {
      label: 'Project decisions',
      value: stats.proposalsToReview + stats.completionsToConfirm,
      note: 'Proposals and completions',
      to: '/admin/review?status=DECISION',
    },
    {
      label: 'Overdue',
      value: stats.overdue,
      note: 'Waiting too long in a stage',
      to: '/admin/review?status=OVERDUE',
    },
    {
      label: 'Accounts to approve',
      value: stats.pendingAccounts,
      note: 'Universities and companies',
      to: '/admin/accounts',
    },
    {
      label: 'Industry funding',
      value: formatRupees(stats.fundingInr),
      note: `${stats.fundedProblems} problems funded`,
    },
    {
      label: 'Citizen rating',
      value: stats.averageRating === null ? '–' : `${stats.averageRating.toFixed(1)} / 5`,
      note: 'Average of all feedback',
    },
    {
      label: 'Rejected',
      value: byStatus.REJECTED,
      note: 'With a recorded reason',
      to: '/admin/review?status=REJECTED',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-slate-900">
            Government Administration Console
          </h2>
          <p className="text-sm text-slate-500">Live figures from the portal database.</p>
        </div>
        <Link to="/admin/review">
          <Button size="sm">Review Pending Submissions &rarr;</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {tiles.map(({ label, value, note, to }) => {
          const tile = (
            <Card hover={Boolean(to)} padding="sm" className="h-full">
              <span className="text-xs font-semibold text-slate-500">{label}</span>
              <div className="text-2xl font-heading font-bold text-primary mt-1 break-words">
                {value}
              </div>
              <p className="text-xs text-slate-500 mt-1">{note}</p>
            </Card>
          );
          return to ? (
            <Link key={label} to={to}>
              {tile}
            </Link>
          ) : (
            <div key={label}>{tile}</div>
          );
        })}
      </div>

      <TrendChart months={stats.monthly} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <BarList title="Problems by district" label="District" rows={stats.byDistrict} />
        <BarList title="Problems by category" label="Category" rows={stats.byCategory} />
      </div>
    </div>
  );
}
