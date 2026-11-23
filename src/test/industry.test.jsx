import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import IndustryActions from '../components/industry/IndustryActions';
import FundingBar from '../components/problems/FundingBar';
import PledgeResponses from '../components/university/PledgeResponses';
import BrowseProposals from '../pages/industry/BrowseProposals';
import IndustryDashboard from '../pages/industry/IndustryDashboard';
import * as pledges from '../services/pledgeService';
import { pledgeError } from '../utils/pledges';

vi.mock('../services/pledgeService');

const button = (name) => screen.getByRole('button', { name });
const problem = { id: 'P1', status: 'IN_PROGRESS' };
const project = (changes) => ({
  proposal: { status: 'APPROVED' },
  funding: { needed: 100000, accepted: 60000, remaining: 40000 },
  pledges: [],
  completionRequestedAt: null,
  ...changes,
});
const pending = {
  id: 9,
  organization: 'Corp',
  type: 'FUNDING',
  amount: 5000,
  description: 'Pumps',
  status: 'PENDING',
};

beforeEach(() => {
  vi.resetAllMocks();
  vi.spyOn(window, 'confirm').mockReturnValue(true);
});
afterEach(() => vi.restoreAllMocks());

describe('IndustryActions', () => {
  const show = (changes, p = problem) =>
    render(<IndustryActions problem={p} project={project(changes)} onSaved={() => {}} />);

  it.each([
    [{ proposal: null }, problem],
    [{}, { ...problem, status: 'SOLVED' }],
    [{ completionRequestedAt: '2026-01-01' }, problem],
  ])('offers nothing when the project is not open (%#)', (changes, p) => {
    expect(show(changes, p).container.innerHTML).toBe('');
  });

  it('offers funding within the remaining budget', async () => {
    show();
    await userEvent.type(screen.getByLabelText(/amount/i), '40001');
    await userEvent.type(screen.getByLabelText(/describe/i), 'CSR grant');
    await userEvent.click(button(/send offer/i));
    expect(screen.getByRole('alert').textContent).toContain('40,000');
    expect(pledges.offerPledge).not.toHaveBeenCalled();
    await userEvent.clear(screen.getByLabelText(/amount/i));
    await userEvent.type(screen.getByLabelText(/amount/i), '40000');
    await userEvent.click(button(/send offer/i));
    expect(pledges.offerPledge).toHaveBeenCalledWith('P1', {
      type: 'FUNDING',
      amount: 40000,
      description: 'CSR grant',
    });
  });

  it('sends no amount for equipment, and blocks funding when fully funded', async () => {
    show({ funding: { needed: 10, accepted: 10, remaining: 0 } });
    expect(screen.getByLabelText(/fully funded/i).disabled).toBe(true);
    await userEvent.type(screen.getByLabelText(/describe/i), 'Pumps');
    await userEvent.click(button(/send offer/i));
    expect(pledges.offerPledge).toHaveBeenCalledWith('P1', {
      type: 'EQUIPMENT',
      amount: null,
      description: 'Pumps',
    });
  });

  it('shows a waiting offer, which can be withdrawn', async () => {
    show({ pledges: [pending] });
    expect(screen.queryByRole('button', { name: /send offer/i })).toBeNull();
    await userEvent.click(button(/withdraw/i));
    expect(pledges.withdrawPledge).toHaveBeenCalledWith('P1', 9);
  });
});

describe('PledgeResponses', () => {
  const show = (changes) =>
    render(
      <PledgeResponses
        problem={problem}
        project={project({
          pledges: [pending, { ...pending, id: 8, status: 'DECLINED' }],
          ...changes,
        })}
        onSaved={() => {}}
      />
    );

  it('accepts only waiting offers, after confirmation', async () => {
    show();
    expect(screen.getAllByRole('button', { name: /accept/i })).toHaveLength(1);
    window.confirm.mockReturnValueOnce(false);
    await userEvent.click(button(/accept/i));
    expect(pledges.acceptPledge).not.toHaveBeenCalled();
    await userEvent.click(button(/accept/i));
    expect(pledges.acceptPledge).toHaveBeenCalledWith('P1', 9);
  });

  it('needs a reason to decline', async () => {
    show();
    await userEvent.click(button(/decline/i));
    expect(screen.getByRole('alert').textContent).toMatch(/reason/i);
    expect(pledges.declinePledge).not.toHaveBeenCalled();
  });

  it('cannot accept after completion was requested', () => {
    show({ completionRequestedAt: '2026-01-01' });
    expect(screen.queryByRole('button', { name: /accept/i })).toBeNull();
    expect(button(/decline/i)).toBeTruthy();
  });
});

describe('pledgeError', () => {
  it.each([0, -1, 1.5, NaN])('rejects an amount of %s', (amount) => {
    expect(pledgeError({ type: 'FUNDING', amount, description: 'x' }, 100)).toBeTruthy();
  });
  it('rejects an empty description', () => {
    expect(pledgeError({ type: 'EQUIPMENT', description: '' }, 100)).toBeTruthy();
  });
});

it('FundingBar never shows 100% before it is fully funded', () => {
  render(<FundingBar funding={{ needed: 1000, accepted: 999, remaining: 1 }} />);
  expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('99');
});

it('BrowseProposals filters by what still needs funding', async () => {
  const row = (id, remaining) => ({
    problem: {
      id,
      title: id,
      category: 'Water',
      district: 'Ranchi',
      status: 'IN_PROGRESS',
      submittedAt: '2026-01-01',
      assignedUniversity: { name: 'BIT' },
    },
    summary: 's',
    durationWeeks: 4,
    funding: { needed: 10, accepted: 10 - remaining, remaining },
    hasPendingPledge: false,
  });
  pledges.listOpenProposals.mockResolvedValue([row('Open one', 5), row('Full one', 0)]);
  render(
    <MemoryRouter>
      <BrowseProposals />
    </MemoryRouter>
  );
  expect(await screen.findAllByRole('link')).toHaveLength(2);
  await userEvent.click(screen.getByLabelText(/still needs funding/i));
  expect(screen.getAllByRole('link').map((l) => l.textContent)).toEqual(['Open one']);
  await userEvent.type(screen.getByLabelText(/search/i), 'zzz');
  expect(screen.getByText(/no proposals match/i)).toBeTruthy();
});

it('IndustryDashboard counts only accepted offers as committed', async () => {
  pledges.listOpenProposals.mockResolvedValue([]);
  const mine = (problemId, status, amount) => ({ problemId, pledge: { status, amount } });
  pledges.listMyPledges.mockResolvedValue([
    mine('A', 'ACCEPTED', 100000),
    mine('A', 'ACCEPTED', null),
    mine('B', 'PENDING', 900000),
  ]);
  render(
    <MemoryRouter>
      <IndustryDashboard />
    </MemoryRouter>
  );
  expect(await screen.findByText('₹1,00,000')).toBeTruthy();
  expect(screen.getByText('Projects supported').parentElement.textContent).toContain('1');
});
