import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ProjectReview from '../components/admin/ProjectReview';
import ProjectCard from '../components/problems/ProjectCard';
import UniversityActions from '../components/university/UniversityActions';
import Assignments from '../pages/university/Assignments';
import * as projects from '../services/projectService';
import { proposalError } from '../utils/proposal';

vi.mock('../services/projectService');

const LONG = 'A clear explanation that is comfortably longer than fifty characters.';
const step = (id, done) => ({
  id,
  title: `Step ${id}`,
  done,
  note: null,
  completedAt: null,
});
const project = (changes) => ({
  canManage: true,
  completionRequestedAt: null,
  pledges: [],
  milestones: [step(1, true), step(2, false)],
  proposal: { status: 'APPROVED', items: [], total: 0 },
  ...changes,
});
const button = (name) => screen.getByRole('button', { name });
const show = (status, changes, onSaved = vi.fn()) => {
  render(
    <UniversityActions
      problem={{ id: 'P1', status }}
      project={project(changes)}
      onSaved={onSaved}
    />
  );
  return onSaved;
};

beforeEach(() => {
  vi.resetAllMocks();
  vi.spyOn(window, 'confirm').mockReturnValue(true);
});
afterEach(() => vi.restoreAllMocks());

describe('UniversityActions', () => {
  it('shows nothing to people who cannot manage the project', () => {
    const { container } = render(
      <UniversityActions
        problem={{ id: 'P1', status: 'IN_PROGRESS' }}
        project={project({ canManage: false })}
      />
    );
    expect(container.innerHTML).toBe('');
  });

  it('accepts with a valid team', async () => {
    const onSaved = show('ASSIGNED', { milestones: [] });
    await userEvent.type(screen.getByLabelText('Department'), 'Civil');
    await userEvent.type(screen.getByLabelText('Faculty lead'), 'Dr Sen');
    await userEvent.type(screen.getByLabelText('Number of students'), '0');
    await userEvent.click(button(/accept/i));
    expect(screen.getByRole('alert').textContent).toMatch(/1 to 100/);
    await userEvent.type(screen.getByLabelText('Number of students'), '{backspace}4');
    await userEvent.click(button(/accept/i));
    expect(projects.acceptAssignment).toHaveBeenCalledWith('P1', {
      department: 'Civil',
      facultyLead: 'Dr Sen',
      studentsCount: 4,
    });
    expect(onSaved).toHaveBeenCalledOnce();
  });

  it('needs a reason to decline', async () => {
    show('ASSIGNED', { milestones: [] });
    await userEvent.click(button(/decline/i));
    expect(screen.getByRole('alert').textContent).toMatch(/reason/i);
    expect(projects.declineAssignment).not.toHaveBeenCalled();
  });

  it('completes the next milestone only', async () => {
    show('IN_PROGRESS');
    expect(screen.getByText('Next milestone: Step 2')).toBeTruthy();
    await userEvent.type(screen.getByLabelText(/what was done/i), 'Built');
    await userEvent.click(button(/mark as complete/i));
    expect(projects.completeMilestone).toHaveBeenCalledWith('P1', 2, 'Built');
  });

  it('keeps the text when the server refuses', async () => {
    projects.completeMilestone.mockRejectedValue(new Error('Out of order'));
    show('IN_PROGRESS');
    await userEvent.type(screen.getByLabelText(/what was done/i), 'Built');
    await userEvent.click(button(/mark as complete/i));
    expect((await screen.findByRole('alert')).textContent).toBe('Out of order');
    expect(screen.getByLabelText(/what was done/i).value).toBe('Built');
  });

  it('offers completion once, when every milestone is done', async () => {
    show('IN_PROGRESS', { milestones: [step(1, true)] });
    await userEvent.click(button(/request completion/i));
    expect(projects.requestCompletion).toHaveBeenCalledWith('P1');
  });

  it('needs an approved proposal before completion', () => {
    show('IN_PROGRESS', {
      milestones: [step(1, true)],
      proposal: { status: 'SUBMITTED', items: [], total: 0 },
    });
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('waits after requesting completion', () => {
    show('IN_PROGRESS', {
      milestones: [step(1, true)],
      completionRequestedAt: '2026-01-01',
    });
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('prefills a returned proposal and resubmits it', async () => {
    show('IN_PROGRESS', {
      proposal: {
        status: 'CHANGES_REQUESTED',
        reviewNote: 'Reduce travel',
        summary: LONG,
        approach: LONG,
        durationWeeks: 8,
        items: [{ label: 'Pump', amount: 5000 }],
      },
    });
    expect(screen.getByText('Reduce travel')).toBeTruthy();
    await userEvent.click(button('+ Add Item'));
    await userEvent.type(screen.getByLabelText('Item 2'), 'Pipe');
    await userEvent.type(screen.getByLabelText(/amount 2/i), '2500');
    expect(screen.getByText(/total/i).textContent).toContain('7,500');
    await userEvent.click(button(/resubmit/i));
    expect(projects.submitProposal).toHaveBeenCalledWith('P1', {
      summary: LONG,
      approach: LONG,
      durationWeeks: 8,
      items: [
        { label: 'Pump', amount: 5000 },
        { label: 'Pipe', amount: 2500 },
      ],
    });
  });
});

describe('proposalError', () => {
  const valid = {
    summary: LONG,
    approach: LONG,
    durationWeeks: 8,
    items: [{ label: 'Pump', amount: 1 }],
  };
  it('accepts a valid proposal', () => expect(proposalError(valid)).toBeNull());
  it.each([
    [{ summary: 'short' }],
    [{ durationWeeks: 0 }],
    [{ durationWeeks: 1.5 }],
    [{ items: [{ label: '', amount: 1 }] }],
    [{ items: [{ label: 'x', amount: 0 }] }],
    [{ items: [{ label: 'x', amount: 1.5 }] }],
    [{ items: [{ label: 'x', amount: NaN }] }],
  ])('rejects %j', (change) =>
    expect(proposalError({ ...valid, ...change })).toBeTruthy()
  );
});

describe('ProjectReview', () => {
  it('needs remarks to return work, and confirms before solving', async () => {
    render(
      <ProjectReview
        problem={{ id: 'P1', pendingDecision: 'COMPLETION' }}
        onSaved={() => {}}
      />
    );
    await userEvent.click(button(/return/i));
    expect(screen.getByRole('alert').textContent).toMatch(/what needs to change/i);
    window.confirm.mockReturnValue(false);
    await userEvent.click(button(/confirm solved/i));
    expect(projects.confirmCompletion).not.toHaveBeenCalled();
  });

  it('approves a proposal', async () => {
    render(
      <ProjectReview
        problem={{ id: 'P1', pendingDecision: 'PROPOSAL' }}
        onSaved={() => {}}
      />
    );
    await userEvent.click(button(/approve/i));
    expect(projects.approveProposal).toHaveBeenCalledWith('P1', '');
  });
});

it('ProjectCard hides the proposal when the server does not send one', () => {
  render(<ProjectCard project={project({ proposal: null })} />);
  expect(screen.getByText('1 of 2 complete')).toBeTruthy();
  expect(screen.queryByText('Proposal')).toBeNull();
});

it('Assignments lists unanswered ones first', async () => {
  const row = (id, status) => ({
    problem: { id, status, title: id, district: 'Ranchi', category: 'Water' },
    milestonesDone: 1,
    milestonesTotal: 4,
  });
  projects.listAssignments.mockResolvedValue([
    row('A', 'IN_PROGRESS'),
    row('B', 'ASSIGNED'),
  ]);
  render(
    <MemoryRouter>
      <Assignments />
    </MemoryRouter>
  );
  const links = await screen.findAllByRole('link');
  expect(links.map((l) => l.getAttribute('href'))).toEqual([
    '/university/problems/B',
    '/university/problems/A',
  ]);
});
