import React, { useState } from 'react';
import Button from '../ui/Button';
import DecisionPanel from '../ui/DecisionPanel';
import Field from '../ui/Field';
import { useDecision } from '../../hooks/useDecision';
import {
  approveProposal,
  confirmCompletion,
  requestProposalChanges,
  returnForWork,
} from '../../services/projectService';

/** Admin decisions on a running project: its proposal, then its completion. */
export default function ProjectReview({ problem, onSaved }) {
  if (problem.pendingDecision === 'PROPOSAL') {
    return (
      <YesNo
        title="Proposal waiting for your review"
        yes="Approve Proposal"
        no="Request Changes"
        onYes={(notes) => approveProposal(problem.id, notes)}
        onNo={(notes) => requestProposalChanges(problem.id, notes)}
        onSaved={onSaved}
      />
    );
  }
  if (problem.pendingDecision === 'COMPLETION') {
    return (
      <YesNo
        title="The university says the work is complete"
        yes="Confirm Solved"
        no="Return for More Work"
        confirmText="Mark this problem as solved? This cannot be undone."
        onYes={(notes) => confirmCompletion(problem.id, notes)}
        onNo={(notes) => returnForWork(problem.id, notes)}
        onSaved={onSaved}
      />
    );
  }
  return null;
}

function YesNo({ title, yes, no, confirmText, onYes, onNo, onSaved }) {
  const [notes, setNotes] = useState('');
  const { error, setError, pending, decide } = useDecision(onSaved);

  return (
    <DecisionPanel title={title} error={error}>
      <Field
        label={`Remarks (required to ${no.toLowerCase()})`}
        rows={3}
        maxLength={500}
        value={notes}
        onChange={setNotes}
      />
      <div className="flex flex-wrap gap-3">
        <Button
          isLoading={pending === 'yes'}
          disabled={pending !== null}
          onClick={() => {
            if (!confirmText || window.confirm(confirmText))
              decide('yes', () => onYes(notes));
          }}
        >
          {yes}
        </Button>
        <Button
          variant="danger"
          isLoading={pending === 'no'}
          disabled={pending !== null}
          onClick={() => {
            if (!notes.trim()) setError('Please write what needs to change.');
            else decide('no', () => onNo(notes));
          }}
        >
          {no}
        </Button>
      </div>
    </DecisionPanel>
  );
}
