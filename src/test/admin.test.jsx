import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ReviewActions from '../components/admin/ReviewActions';
import Accounts from '../pages/admin/Accounts';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ReviewProblems from '../pages/admin/ReviewProblems';
import * as admin from '../services/adminService';
import { listProblems } from '../services/problemService';
import { SAMPLE_PROBLEMS } from './sampleProblems';

vi.mock('../services/adminService');
vi.mock('../services/problemService');

const button = (name) => screen.getByRole('button', { name });
let confirm;
beforeEach(() => {
  vi.resetAllMocks();
  confirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
});
afterEach(() => vi.restoreAllMocks());

describe('ReviewActions', () => {
  const submitted = { id: 'P1', status: 'SUBMITTED' };

  it('validates with remarks', async () => {
    const onSaved = vi.fn();
    admin.validateProblem.mockResolvedValue({ id: 'P1', status: 'VALIDATED' });
    render(<ReviewActions problem={submitted} onSaved={onSaved} />);
    await userEvent.type(screen.getByLabelText(/remarks/i), 'Checked');
    await userEvent.click(button(/validate/i));
    expect(admin.validateProblem).toHaveBeenCalledWith('P1', 'Checked');
    expect(onSaved).toHaveBeenCalledWith({ id: 'P1', status: 'VALIDATED' });
  });

  it('needs a reason and a confirmation to reject', async () => {
    render(<ReviewActions problem={submitted} onSaved={() => {}} />);
    await userEvent.click(button(/reject/i));
    expect(screen.getByRole('alert').textContent).toMatch(/reason/i);
    confirm.mockReturnValue(false);
    await userEvent.type(screen.getByLabelText(/remarks/i), 'Duplicate');
    await userEvent.click(button(/reject/i));
    expect(admin.rejectProblem).not.toHaveBeenCalled();
  });

  it('shows a conflict and stays usable', async () => {
    admin.validateProblem.mockRejectedValue(new Error('Status has changed'));
    render(<ReviewActions problem={submitted} onSaved={() => {}} />);
    await userEvent.click(button(/validate/i));
    expect((await screen.findByRole('alert')).textContent).toBe('Status has changed');
    expect(button(/validate/i).disabled).toBe(false);
  });

  it('assigns the chosen university', async () => {
    admin.listUniversities.mockResolvedValue([{ id: 7, name: 'BIT Mesra' }]);
    admin.assignProblem.mockResolvedValue({});
    render(
      <ReviewActions problem={{ id: 'P1', status: 'VALIDATED' }} onSaved={() => {}} />
    );
    await screen.findByText('BIT Mesra');
    await userEvent.click(button(/assign/i));
    expect(screen.getByRole('alert').textContent).toMatch(/choose a university/i);
    await userEvent.selectOptions(screen.getByLabelText('University'), '7');
    await userEvent.click(button(/assign/i));
    expect(admin.assignProblem).toHaveBeenCalledWith('P1', 7, '');
  });

  it.each(['ASSIGNED', 'IN_PROGRESS', 'SOLVED', 'REJECTED'])(
    'offers nothing at %s',
    (status) => {
      const { container } = render(<ReviewActions problem={{ id: 'P1', status }} />);
      expect(container.innerHTML).toBe('');
    }
  );
});

describe('Accounts', () => {
  it('removes an account only after the server accepts', async () => {
    admin.listPendingAccounts.mockResolvedValue([
      {
        id: 'u1',
        name: 'A',
        email: 'a@x.in',
        role: 'university',
        organizationName: 'Uni X',
      },
    ]);
    admin.decideAccount.mockRejectedValueOnce(new Error('Already decided'));
    render(<Accounts />);
    await screen.findByText('Uni X');
    await userEvent.click(button('Approve'));
    expect((await screen.findByRole('alert')).textContent).toBe('Already decided');
    expect(screen.getByText('Uni X')).toBeTruthy();

    admin.decideAccount.mockResolvedValueOnce(null);
    await userEvent.click(button('Approve'));
    expect(await screen.findByText(/no accounts are waiting/i)).toBeTruthy();
    expect(admin.decideAccount).toHaveBeenLastCalledWith('u1', true);
  });
});

describe('ReviewProblems', () => {
  it('starts with reports awaiting review, oldest first', async () => {
    listProblems.mockResolvedValue(SAMPLE_PROBLEMS);
    render(
      <MemoryRouter>
        <ReviewProblems />
      </MemoryRouter>
    );
    const links = await screen.findAllByRole('link');
    expect(links.map((l) => l.getAttribute('href'))).toEqual([
      '/admin/problems/JH-2026-NRG-0108',
      '/admin/problems/JH-2026-EDU-0105',
    ]);
    await userEvent.click(button(/^rejected/i));
    expect(screen.getAllByRole('link')).toHaveLength(1);
  });
});

describe('AdminDashboard', () => {
  it('copes with an empty portal', async () => {
    admin.getStats.mockResolvedValue({
      total: 0,
      byStatus: {
        SUBMITTED: 0,
        VALIDATED: 0,
        ASSIGNED: 0,
        IN_PROGRESS: 0,
        SOLVED: 0,
        REJECTED: 0,
      },
      byDistrict: [],
      byCategory: [],
      fundedProblems: 0,
      fundingInr: 0,
      averageRating: null,
      averageDaysToSolve: null,
      pendingAccounts: 0,
      proposalsToReview: 0,
      completionsToConfirm: 0,
      overdue: 0,
      monthly: [{ month: '2026-01', reported: 0, solved: 0 }],
    });
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );
    expect(await screen.findByText('None solved yet')).toBeTruthy();
    expect(screen.getAllByText('No problems reported yet.')).toHaveLength(3);
  });
});
