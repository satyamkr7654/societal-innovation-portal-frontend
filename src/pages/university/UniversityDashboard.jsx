import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import LoadState from '../../components/ui/LoadState';
import { useAsync } from '../../hooks/useAsync';
import { listAssignments } from '../../services/projectService';

export default function UniversityDashboard() {
  const { data, error, isLoading, reload } = useAsync(listAssignments);
  if (isLoading || error) return <LoadState error={error} onRetry={reload} />;

  const count = (status) => data.filter((r) => r.problem.status === status).length;
  const running = data.filter((r) => r.problem.status === 'IN_PROGRESS');
  const sum = (field) => running.reduce((total, r) => total + r[field], 0);
  const tiles = [
    ['Waiting for your response', count('ASSIGNED'), 'Accept or decline'],
    ['In progress', running.length, 'Active projects'],
    [
      'Proposals to write',
      running.filter((r) => !r.proposalStatus || r.proposalStatus === 'CHANGES_REQUESTED')
        .length,
      'New or needing changes',
    ],
    [
      'Milestones',
      `${sum('milestonesDone')} / ${sum('milestonesTotal')}`,
      'Across active projects',
    ],
    ['Solved', count('SOLVED'), 'Confirmed by an admin'],
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-slate-900">
            University Dashboard
          </h2>
          <p className="text-sm text-slate-500">Your university&apos;s projects.</p>
        </div>
        <Link to="/university/assignments">
          <Button size="sm">View Assigned Problems &rarr;</Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {tiles.map(([label, value, note]) => (
          <Card key={label} padding="sm">
            <span className="text-xs font-semibold text-slate-500">{label}</span>
            <div className="text-2xl font-heading font-bold text-primary mt-1">
              {value}
            </div>
            <p className="text-xs text-slate-500 mt-1">{note}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
