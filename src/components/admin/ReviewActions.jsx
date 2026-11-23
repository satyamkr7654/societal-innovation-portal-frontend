import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useAsync } from '../../hooks/useAsync';
import {
  assignProblem,
  listUniversities,
  rejectProblem,
  validateProblem,
} from '../../services/adminService';

const fieldClass =
  'w-full text-sm p-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-800';

/** The decision an admin can make at the problem's current status. */
export default function ReviewActions({ problem, onSaved }) {
  if (problem.status === 'SUBMITTED') {
    return <ValidateOrReject problem={problem} onSaved={onSaved} />;
  }
  if (problem.status === 'VALIDATED') {
    return <Assign problem={problem} onSaved={onSaved} />;
  }
  return null;
}

function Panel({ title, error, children }) {
  return (
    <Card
      header={<h2 className="font-heading font-bold text-sm text-slate-900">{title}</h2>}
    >
      <div className="space-y-4">
        {children}
        {error && (
          <p role="alert" className="text-sm text-red-600 font-medium">
            {error}
          </p>
        )}
      </div>
    </Card>
  );
}

/** Runs one decision at a time and reports its failure. */
function useDecision(onSaved) {
  const [error, setError] = useState('');
  const [pending, setPending] = useState(null);

  const decide = async (name, action) => {
    setError('');
    setPending(name);
    try {
      onSaved(await action());
    } catch (err) {
      setError(err.message);
      setPending(null);
    }
  };
  return { error, setError, pending, decide };
}

function ValidateOrReject({ problem, onSaved }) {
  const [notes, setNotes] = useState('');
  const { error, setError, pending, decide } = useDecision(onSaved);

  const handleReject = () => {
    if (!notes.trim()) {
      setError('Please write the reason before rejecting.');
      return;
    }
    if (window.confirm('Reject this problem? This cannot be undone.')) {
      decide('reject', () => rejectProblem(problem.id, notes));
    }
  };

  return (
    <Panel title="Your decision" error={error}>
      <div className="space-y-1.5">
        <label
          htmlFor="decision-notes"
          className="block text-sm font-semibold text-slate-700"
        >
          Remarks (required to reject)
        </label>
        <textarea
          id="decision-notes"
          rows={3}
          maxLength={500}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={fieldClass}
        />
        <p className="text-xs text-slate-500">
          The citizen and other portal users can read this.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button
          isLoading={pending === 'validate'}
          disabled={pending !== null}
          onClick={() => decide('validate', () => validateProblem(problem.id, notes))}
        >
          Validate Problem
        </Button>
        <Button
          variant="danger"
          isLoading={pending === 'reject'}
          disabled={pending !== null}
          onClick={handleReject}
        >
          Reject Problem
        </Button>
      </div>
    </Panel>
  );
}

function Assign({ problem, onSaved }) {
  const { data: universities, error: loadError, isLoading } = useAsync(listUniversities);
  const [universityId, setUniversityId] = useState('');
  const [notes, setNotes] = useState('');
  const { error, setError, pending, decide } = useDecision(onSaved);

  const handleAssign = () => {
    if (!universityId) {
      setError('Please choose a university.');
      return;
    }
    decide('assign', () => assignProblem(problem.id, Number(universityId), notes));
  };

  return (
    <Panel title="Assign to a university" error={error || loadError?.message}>
      {universities?.length === 0 ? (
        <p className="text-sm text-slate-600">
          No approved university accounts yet. Approve one on the Accounts page first.
        </p>
      ) : (
        <>
          <div className="space-y-1.5">
            <label
              htmlFor="university"
              className="block text-sm font-semibold text-slate-700"
            >
              University
            </label>
            <select
              id="university"
              value={universityId}
              disabled={isLoading}
              onChange={(e) => setUniversityId(e.target.value)}
              className={fieldClass}
            >
              <option value="">{isLoading ? 'Loading...' : 'Choose a university'}</option>
              {universities?.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="assign-notes"
              className="block text-sm font-semibold text-slate-700"
            >
              Remarks (optional)
            </label>
            <textarea
              id="assign-notes"
              rows={2}
              maxLength={500}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={fieldClass}
            />
          </div>
          <Button
            isLoading={pending === 'assign'}
            disabled={isLoading}
            onClick={handleAssign}
          >
            Assign Problem
          </Button>
        </>
      )}
    </Panel>
  );
}
