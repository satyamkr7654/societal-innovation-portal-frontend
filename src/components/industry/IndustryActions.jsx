import React, { useState } from 'react';
import Button from '../ui/Button';
import DecisionPanel from '../ui/DecisionPanel';
import Field from '../ui/Field';
import { useDecision } from '../../hooks/useDecision';
import { offerPledge, withdrawPledge } from '../../services/pledgeService';
import { formatRupees } from '../../utils/money';
import { PLEDGE_TYPES, describePledge, pledgeError } from '../../utils/pledges';

/** Offer support, or manage the offer already waiting. */
export default function IndustryActions({ problem, project, onSaved }) {
  if (!project?.proposal || problem.status !== 'IN_PROGRESS') return null;
  const waiting = project.pledges.find((p) => p.status === 'PENDING');
  if (waiting) {
    return <Waiting problem={problem} pledge={waiting} onSaved={onSaved} />;
  }
  if (project.completionRequestedAt) return null;
  return <OfferForm problem={problem} funding={project.funding} onSaved={onSaved} />;
}

function Waiting({ problem, pledge, onSaved }) {
  const { error, pending, decide } = useDecision(onSaved);
  return (
    <DecisionPanel title="Your offer is waiting for the university" error={error}>
      <div className="text-sm text-slate-700">
        <p className="font-semibold text-slate-900">{describePledge(pledge)}</p>
        <p className="break-words">{pledge.description}</p>
      </div>
      <Button
        variant="outline"
        isLoading={pending !== null}
        onClick={() => {
          if (window.confirm('Withdraw this offer?')) {
            decide('withdraw', () => withdrawPledge(problem.id, pledge.id));
          }
        }}
      >
        Withdraw Offer
      </Button>
    </DecisionPanel>
  );
}

function OfferForm({ problem, funding, onSaved }) {
  const isFunded = funding.remaining === 0;
  const [type, setType] = useState(isFunded ? 'EQUIPMENT' : 'FUNDING');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const { error, setError, pending, decide } = useDecision(onSaved);

  const handleSubmit = (e) => {
    e.preventDefault();
    const pledge = {
      type,
      amount: type === 'FUNDING' ? Number(amount) : null,
      description: description.trim(),
    };
    const found = pledgeError(pledge, funding.remaining);
    if (found) setError(found);
    else decide('offer', () => offerPledge(problem.id, pledge));
  };

  return (
    <DecisionPanel title="Offer support" error={error}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <fieldset>
          <legend className="text-sm font-semibold text-slate-700 mb-1.5">
            Kind of support
          </legend>
          <div className="flex flex-wrap gap-4">
            {Object.entries(PLEDGE_TYPES).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="radio"
                  name="pledge-type"
                  value={key}
                  checked={type === key}
                  disabled={key === 'FUNDING' && isFunded}
                  onChange={() => setType(key)}
                />
                {label}
                {key === 'FUNDING' && isFunded && ' (fully funded)'}
              </label>
            ))}
          </div>
        </fieldset>
        {type === 'FUNDING' && (
          <Field
            label={`Amount in ₹ (up to ${formatRupees(funding.remaining)})`}
            type="number"
            min={1}
            max={funding.remaining}
            value={amount}
            onChange={setAmount}
          />
        )}
        <Field
          label="Describe the support"
          rows={3}
          maxLength={500}
          value={description}
          onChange={setDescription}
        />
        <p className="text-xs text-slate-500">
          This records an offer. The portal does not collect or transfer money.
        </p>
        <Button type="submit" isLoading={pending !== null}>
          Send Offer
        </Button>
      </form>
    </DecisionPanel>
  );
}
