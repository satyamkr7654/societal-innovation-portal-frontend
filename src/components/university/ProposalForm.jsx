import React, { useRef, useState } from 'react';
import Button from '../ui/Button';
import DecisionPanel from '../ui/DecisionPanel';
import Field from '../ui/Field';
import { useDecision } from '../../hooks/useDecision';
import { submitProposal } from '../../services/projectService';
import { formatRupees } from '../../utils/money';
import { proposalError } from '../../utils/proposal';

const MAX_ITEMS = 20;

/** New proposal, or a corrected one when the admin asked for changes. */
export default function ProposalForm({ problem, project, onSaved }) {
  const previous = project.proposal;
  const [summary, setSummary] = useState(previous?.summary || '');
  const [approach, setApproach] = useState(previous?.approach || '');
  const [weeks, setWeeks] = useState(previous ? String(previous.durationWeeks) : '');
  const nextKey = useRef(100);
  const [items, setItems] = useState(() =>
    (previous?.items || [{ label: '', amount: '' }]).map((item, key) => ({
      key,
      label: item.label,
      amount: String(item.amount),
    }))
  );
  const { error, setError, pending, decide } = useDecision(onSaved);

  const total = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const changeItem = (key, field, value) =>
    setItems(
      items.map((item) => (item.key === key ? { ...item, [field]: value } : item))
    );
  const addItem = () => {
    nextKey.current += 1;
    setItems([...items, { key: nextKey.current, label: '', amount: '' }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const proposal = {
      summary: summary.trim(),
      approach: approach.trim(),
      durationWeeks: Number(weeks),
      items: items.map(({ label, amount }) => ({
        label: label.trim(),
        amount: Number(amount),
      })),
    };
    const problemFound = proposalError(proposal);
    if (problemFound) setError(problemFound);
    else decide('proposal', () => submitProposal(problem.id, proposal));
  };

  return (
    <DecisionPanel
      title={previous ? 'Correct and resubmit the proposal' : 'Submit a proposal'}
      error={error}
    >
      {previous?.reviewNote && (
        <p className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">
          <strong>Admin asked for changes:</strong> {previous.reviewNote}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Field
          label="Summary (at least 50 characters)"
          rows={3}
          maxLength={2000}
          value={summary}
          onChange={setSummary}
        />
        <Field
          label="Technical approach (at least 50 characters)"
          rows={4}
          maxLength={3000}
          value={approach}
          onChange={setApproach}
        />
        <Field
          label="Duration in weeks"
          type="number"
          min={1}
          max={104}
          value={weeks}
          onChange={setWeeks}
        />

        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-slate-700">Budget</legend>
          {items.map((item, index) => (
            <div key={item.key} className="flex flex-col sm:flex-row sm:items-end gap-3">
              <Field
                label={`Item ${index + 1}`}
                maxLength={100}
                value={item.label}
                onChange={(value) => changeItem(item.key, 'label', value)}
              />
              <Field
                label={`Amount ${index + 1} (₹)`}
                type="number"
                min={1}
                value={item.amount}
                onChange={(value) => changeItem(item.key, 'amount', value)}
              />
              {items.length > 1 && (
                <Button
                  variant="outline"
                  aria-label={`Remove item ${index + 1}`}
                  onClick={() => setItems(items.filter((i) => i.key !== item.key))}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={items.length >= MAX_ITEMS}
              onClick={addItem}
            >
              + Add Item
            </Button>
            <span className="text-sm font-bold text-slate-900">
              Total: {formatRupees(total)}
            </span>
          </div>
        </fieldset>

        <Button type="submit" isLoading={pending !== null}>
          {previous ? 'Resubmit Proposal' : 'Submit Proposal'}
        </Button>
      </form>
    </DecisionPanel>
  );
}
