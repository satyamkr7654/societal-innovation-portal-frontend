import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import BarList from '../components/charts/BarList';
import TrendChart from '../components/charts/TrendChart';
import SimilarProblems from '../components/citizen/SimilarProblems';
import { AuthContext } from '../context/AuthContextValue';
import { announceNotificationChange, useUnreadCount } from '../hooks/useUnreadCount';
import Notifications from '../pages/Notifications';
import * as notifications from '../services/notificationService';
import { findSimilarProblems } from '../services/problemService';
import { axisTicks, monthLabel } from '../utils/charts';

vi.mock('../services/notificationService');
vi.mock('../services/problemService');

beforeEach(() => vi.resetAllMocks());
afterEach(() => vi.useRealTimers());

const months = Array.from({ length: 12 }, (_, i) => ({
  month: `2026-${String(i + 1).padStart(2, '0')}`,
  reported: i,
  solved: 0,
}));

describe('Notifications', () => {
  const show = (role, items) => {
    notifications.listNotifications.mockResolvedValue(items);
    render(
      <AuthContext.Provider value={{ role }}>
        <MemoryRouter initialEntries={['/notifications']}>
          <Routes>
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/:role/problems/:id" element={<p>problem page</p>} />
            <Route path="/admin/accounts" element={<p>accounts page</p>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };
  const item = (changes) => ({
    id: 1,
    message: 'Verified',
    problemId: 'P1',
    createdAt: '2026-01-01T00:00:00Z',
    read: false,
    ...changes,
  });

  it('marks one as read and opens its problem', async () => {
    show('citizen', [item()]);
    await userEvent.click(await screen.findByRole('button', { name: /verified/i }));
    expect(notifications.markRead).toHaveBeenCalledWith(1);
    expect(await screen.findByText('problem page')).toBeTruthy();
  });

  it('opens accounts for an admin notice without a problem', async () => {
    show('admin', [item({ problemId: null, read: true })]);
    await userEvent.click(await screen.findByRole('button', { name: /verified/i }));
    expect(notifications.markRead).not.toHaveBeenCalled();
    expect(await screen.findByText('accounts page')).toBeTruthy();
  });

  it('marks all as read only when the server agrees', async () => {
    show('citizen', [item()]);
    notifications.markAllRead.mockRejectedValueOnce(new Error('Offline'));
    const all = await screen.findByRole('button', { name: /mark all/i });
    await userEvent.click(all);
    expect((await screen.findByRole('alert')).textContent).toBe('Offline');
    expect(screen.getByText(/1 unread/)).toBeTruthy();
    await userEvent.click(all);
    expect(await screen.findByText(/up to date/)).toBeTruthy();
  });
});

it('the unread count refreshes on demand and survives a failure', async () => {
  function Bell() {
    return <p>count {useUnreadCount('/x')}</p>;
  }
  notifications.getUnreadCount.mockResolvedValueOnce(3);
  render(<Bell />);
  expect(await screen.findByText('count 3')).toBeTruthy();
  notifications.getUnreadCount.mockRejectedValueOnce(new Error('x'));
  await act(async () => announceNotificationChange());
  expect(screen.getByText('count 3')).toBeTruthy();
  notifications.getUnreadCount.mockResolvedValueOnce(0);
  await act(async () => announceNotificationChange());
  expect(await screen.findByText('count 0')).toBeTruthy();
});

describe('SimilarProblems', () => {
  const at = (lat) => ({ lat, lng: 85 });
  const ui = (location, category = 'Water') => (
    <MemoryRouter>
      <SimilarProblems category={category} location={location} />
    </MemoryRouter>
  );
  const found = [
    { id: 'P1', title: 'Broken pipe', status: 'SUBMITTED', distanceMeters: 40 },
  ];

  it('asks nothing without a pin', () => {
    render(ui(null));
    expect(findSimilarProblems).not.toHaveBeenCalled();
  });

  it('warns, and drops the warning when the pin moves', async () => {
    findSimilarProblems.mockResolvedValueOnce(found).mockResolvedValue([]);
    const { rerender } = render(ui(at(23)));
    expect(await screen.findByText('Broken pipe')).toBeTruthy();
    rerender(ui(at(24)));
    expect(screen.queryByText('Broken pipe')).toBeNull();
  });

  it('stays silent when the check fails', async () => {
    findSimilarProblems.mockRejectedValue(new Error('x'));
    render(ui(at(23)));
    await vi.waitFor(() => expect(findSimilarProblems).toHaveBeenCalled(), 2000);
    expect(screen.queryByRole('status')).toBeNull();
  });
});

describe('charts', () => {
  it.each([
    [0, [0, 1]],
    [3, [0, 1, 2, 3]],
    [7, [0, 2, 4, 6, 8]],
    [100, [0, 50, 100]],
  ])('axis for a maximum of %d', (max, expected) => {
    expect(axisTicks(max)).toEqual(expected);
  });

  it('labels months', () => expect(monthLabel('2026-01')).toMatch(/Jan.* 2026/));

  it('shows a tooltip on focus and the same numbers in a table', async () => {
    render(<TrendChart months={months} />);
    await userEvent.tab();
    await userEvent.tab();
    expect(screen.getByRole('tooltip').textContent).toContain('0Reported');
    await userEvent.click(screen.getByRole('button', { name: 'Show table' }));
    expect(screen.getAllByRole('row')).toHaveLength(13);
  });

  it('says so when there is nothing to show', () => {
    render(<BarList title="By district" label="District" rows={[]} />);
    expect(screen.getByText(/no problems reported/i)).toBeTruthy();
  });
});
