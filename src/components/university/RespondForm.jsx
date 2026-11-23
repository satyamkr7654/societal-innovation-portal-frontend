import React, { useState } from 'react';
import Button from '../ui/Button';
import DecisionPanel from '../ui/DecisionPanel';
import Field from '../ui/Field';
import { useDecision } from '../../hooks/useDecision';
import { acceptAssignment, declineAssignment } from '../../services/projectService';

/** Accept the assignment with a team, or decline it with a reason. */
export default function RespondForm({ problem, onSaved }) {
  const [department, setDepartment] = useState('');
  const [facultyLead, setFacultyLead] = useState('');
  const [students, setStudents] = useState('');
  const [reason, setReason] = useState('');
  const accept = useDecision(onSaved);
  const decline = useDecision(onSaved);
  const isBusy = accept.pending !== null || decline.pending !== null;

  const handleAccept = (e) => {
    e.preventDefault();
    const count = Number(students);
    if (!department.trim() || !facultyLead.trim()) {
      accept.setError('Please enter the department and faculty lead.');
    } else if (!Number.isInteger(count) || count < 1 || count > 100) {
      accept.setError('Number of students must be 1 to 100.');
    } else {
      accept.decide('accept', () =>
        acceptAssignment(problem.id, { department, facultyLead, studentsCount: count })
      );
    }
  };

  const handleDecline = () => {
    if (!reason.trim()) {
      decline.setError('Please write the reason for declining.');
    } else if (window.confirm('Decline this assignment? It returns to the admin.')) {
      decline.decide('decline', () => declineAssignment(problem.id, reason));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <DecisionPanel title="Accept this assignment" error={accept.error}>
        <form onSubmit={handleAccept} className="space-y-4" noValidate>
          <Field
            label="Department"
            maxLength={150}
            value={department}
            onChange={setDepartment}
          />
          <Field
            label="Faculty lead"
            maxLength={100}
            value={facultyLead}
            onChange={setFacultyLead}
          />
          <Field
            label="Number of students"
            type="number"
            min={1}
            max={100}
            value={students}
            onChange={setStudents}
          />
          <Button type="submit" isLoading={accept.pending !== null} disabled={isBusy}>
            Accept Assignment
          </Button>
        </form>
      </DecisionPanel>

      <DecisionPanel title="Or decline it" error={decline.error}>
        <Field
          label="Reason for declining"
          rows={3}
          maxLength={500}
          value={reason}
          onChange={setReason}
        />
        <p className="text-xs text-slate-500">Portal users can read this reason.</p>
        <Button
          variant="danger"
          isLoading={decline.pending !== null}
          disabled={isBusy}
          onClick={handleDecline}
        >
          Decline Assignment
        </Button>
      </DecisionPanel>
    </div>
  );
}
