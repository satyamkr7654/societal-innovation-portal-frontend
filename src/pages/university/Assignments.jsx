import React from 'react';
import LoadState from '../../components/ui/LoadState';
import AssignmentList from '../../components/university/AssignmentList';
import { useAsync } from '../../hooks/useAsync';
import { listAssignments } from '../../services/projectService';

const describe = ({ problem, milestonesDone, milestonesTotal, completionRequested }) => {
  if (problem.status === 'ASSIGNED') return 'Waiting for your response';
  if (problem.status === 'IN_PROGRESS' && completionRequested) {
    return 'Waiting for admin confirmation';
  }
  return milestonesTotal > 0
    ? `${milestonesDone} of ${milestonesTotal} milestones`
    : problem.category;
};

export default function Assignments() {
  const { data, error, isLoading, reload } = useAsync(listAssignments);
  if (isLoading || error) return <LoadState error={error} onRetry={reload} />;

  // New assignments need an answer, so they come first
  const rows = [
    ...data.filter((r) => r.problem.status === 'ASSIGNED'),
    ...data.filter((r) => r.problem.status !== 'ASSIGNED'),
  ];
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-slate-900">
          Assigned Problems
        </h2>
        <p className="text-sm text-slate-500">
          Open a problem to respond, submit a proposal or record progress.
        </p>
      </div>
      <AssignmentList
        rows={rows}
        describe={describe}
        empty="No problems are assigned to your university yet."
      />
    </div>
  );
}
