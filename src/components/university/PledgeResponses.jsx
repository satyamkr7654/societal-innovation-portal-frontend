import React, { useState } from 'react';
import Button from '../ui/Button';
import DecisionPanel from '../ui/DecisionPanel';
import Field from '../ui/Field';
import { useDecision } from '../../hooks/useDecision';
import { acceptPledge, declinePledge } from '../../services/pledgeService';
import { describePledge } from '../../utils/pledges';

/** Offers waiting for the university's answer. */
export default function PledgeResponses({ problem, project, onSaved }) {
  const pending = project.pledges.filter((p) => p.status === 'PENDING');
  return pending.map((pledge) => (
    <PledgeResponse
      key={pledge.id}
      pledge={pledge}
      problemId={problem.id}
      canAccept={!project.completionRequestedAt}
      onSaved={onSaved}
    />
  ));
}

function PledgeResponse({ pledge, problemId, canAccept, onSaved }) {
  const [reason, setReason] = useState('');
  const { error, setError, pending, decide } = useDecision(onSaved);

  const handleDecline = () => {
    if (!reason.trim()) setError('Please write the reason for declining.');
    else decide('decline', () => declinePledge(problemId, pledge.id, reason));
  };

  return (
    <DecisionPanel title={`Support offered by ${pledge.organization}`} error={error}>
      <div className="text-sm text-slate-700">
        <p className="font-semibold text-slate-900">{describePledge(pledge)}</p>
        <p className="break-words">{pledge.description}</p>
      </div>
      <Field
        label="Reason (required to decline)"
        rows={2}
        maxLength={500}
        value={reason}
        onChange={setReason}
      />
      <div className="flex flex-wrap gap-3">
        {canAccept && (
          <Button
            isLoading={pending === 'accept'}
            disabled={pending !== null}
            onClick={() => {
              if (window.confirm(`Accept this offer from ${pledge.organization}?`)) {
                decide('accept', () => acceptPledge(problemId, pledge.id));
              }
            }}
          >
            Accept Offer
          </Button>
        )}
        <Button
          variant="danger"
          isLoading={pending === 'decline'}
          disabled={pending !== null}
          onClick={handleDecline}
        >
          Decline Offer
        </Button>
      </div>
    </DecisionPanel>
  );
}
