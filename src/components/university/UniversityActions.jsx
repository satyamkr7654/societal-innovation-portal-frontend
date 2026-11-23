import React from 'react';
import Button from '../ui/Button';
import DecisionPanel from '../ui/DecisionPanel';
import { useDecision } from '../../hooks/useDecision';
import { requestCompletion } from '../../services/projectService';
import PledgeResponses from './PledgeResponses';
import MilestoneForm from './MilestoneForm';
import ProposalForm from './ProposalForm';
import RespondForm from './RespondForm';

/** What the assigned university can do next. */
export default function UniversityActions({ problem, project, onSaved }) {
  if (!project?.canManage) return null;
  const shared = { problem, project, onSaved };

  if (problem.status === 'ASSIGNED') return <RespondForm {...shared} />;
  if (problem.status !== 'IN_PROGRESS') return null;

  const needsProposal =
    !project.proposal || project.proposal.status === 'CHANGES_REQUESTED';
  const next = project.milestones.find((m) => !m.done);

  return (
    <div className="space-y-6">
      <PledgeResponses {...shared} />
      {needsProposal && <ProposalForm {...shared} />}
      {next ? (
        <MilestoneForm key={next.id} milestone={next} {...shared} />
      ) : (
        <Completion {...shared} />
      )}
    </div>
  );
}

function Completion({ problem, project, onSaved }) {
  const { error, pending, decide } = useDecision(onSaved);
  if (project.completionRequestedAt) {
    return (
      <DecisionPanel title="Completion requested">
        <p className="text-sm text-slate-600">
          Waiting for an admin to confirm the work.
        </p>
      </DecisionPanel>
    );
  }
  if (project.proposal?.status !== 'APPROVED') {
    return (
      <DecisionPanel title="All milestones are complete">
        <p className="text-sm text-slate-600">
          You can request completion once an admin approves the proposal.
        </p>
      </DecisionPanel>
    );
  }
  return (
    <DecisionPanel title="All milestones are complete" error={error}>
      <p className="text-sm text-slate-600">
        Ask an admin to check the site and mark the problem as solved.
      </p>
      <Button
        isLoading={pending !== null}
        onClick={() => decide('request', () => requestCompletion(problem.id))}
      >
        Request Completion
      </Button>
    </DecisionPanel>
  );
}
