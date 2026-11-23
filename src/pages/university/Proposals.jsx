import React from 'react';
import LoadState from '../../components/ui/LoadState';
import AssignmentList from '../../components/university/AssignmentList';
import { useAsync } from '../../hooks/useAsync';
import { listAssignments } from '../../services/projectService';
import { PROPOSAL_STATUS } from '../../utils/proposal';

export default function Proposals() {
  const { data, error, isLoading, reload } = useAsync(listAssignments);
  if (isLoading || error) return <LoadState error={error} onRetry={reload} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-slate-900">
          Proposals &amp; Milestones
        </h2>
        <p className="text-sm text-slate-500">Projects in progress at your university.</p>
      </div>
      <AssignmentList
        rows={data.filter((r) => r.problem.status === 'IN_PROGRESS')}
        describe={(r) =>
          `Proposal: ${PROPOSAL_STATUS[r.proposalStatus] || 'Not submitted'} • ${r.milestonesDone} of ${r.milestonesTotal} milestones`
        }
        empty="No projects are in progress."
      />
    </div>
  );
}
