import React, { useState } from 'react';
import Button from '../ui/Button';
import DecisionPanel from '../ui/DecisionPanel';
import Field from '../ui/Field';
import { useDecision } from '../../hooks/useDecision';
import { completeMilestone } from '../../services/projectService';

export default function MilestoneForm({ problem, milestone, onSaved }) {
  const [note, setNote] = useState('');
  const { error, setError, pending, decide } = useDecision(onSaved);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!note.trim()) setError('Please describe what was done.');
    else decide('milestone', () => completeMilestone(problem.id, milestone.id, note));
  };

  return (
    <DecisionPanel title={`Next milestone: ${milestone.title}`} error={error}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field
          label="What was done?"
          rows={3}
          maxLength={500}
          value={note}
          onChange={setNote}
        />
        <Button type="submit" isLoading={pending !== null}>
          Mark as Complete
        </Button>
      </form>
    </DecisionPanel>
  );
}
