import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import FeedbackCard from '../components/problems/FeedbackCard';
import LoadState from '../components/ui/LoadState';
import { AuthProvider } from '../context/AuthContext';
import { useAsync } from '../hooks/useAsync';
import Login from '../pages/auth/Login';
import ProtectedRoute from '../routes/ProtectedRoute';
import { request, setUnauthorizedHandler } from '../services/apiClient';
import { login, restoreSession } from '../services/authService';

vi.mock('../services/authService');

const userWithRole = (role) => ({ id: 'u1', name: 'Test', role });

beforeEach(() => restoreSession.mockResolvedValue(null));

const renderAt = (path) =>
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/review" element={<p>admin area</p>} />
          </Route>
          <Route path="/citizen/dashboard" element={<p>citizen home</p>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
const loginAs = (role) => restoreSession.mockResolvedValue(userWithRole(role));

describe('ProtectedRoute', () => {
  it('sends visitors to login', async () => {
    renderAt('/admin/review');
    expect(await screen.findByText(/please sign in to access/i)).toBeTruthy();
  });
  it('sends the wrong role to its own dashboard', async () => {
    loginAs('citizen');
    renderAt('/admin/review');
    expect(await screen.findByText('citizen home')).toBeTruthy();
    expect(screen.queryByText('admin area')).toBeNull();
  });
  it('lets the right role in', async () => {
    loginAs('admin');
    renderAt('/admin/review');
    expect(await screen.findByText('admin area')).toBeTruthy();
  });
});

describe('session', () => {
  it('returns to login when the server ends the session', async () => {
    loginAs('admin');
    renderAt('/admin/review');
    await screen.findByText('admin area');
    vi.stubGlobal('fetch', async () => new Response('{"message":"no"}', { status: 401 }));
    await act(() => request('/problems').catch(() => {}));
    vi.unstubAllGlobals();
    expect(await screen.findByText(/please sign in to access/i)).toBeTruthy();
    setUnauthorizedHandler(() => {});
  });
  it('shows a retry when the server is down, not the login page', async () => {
    restoreSession.mockRejectedValueOnce(new Error('Server down'));
    renderAt('/admin/review');
    expect(await screen.findByText('Server down')).toBeTruthy();
    loginAs('admin');
    await userEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(await screen.findByText('admin area')).toBeTruthy();
  });
});

describe('Login page', () => {
  it('shows an error for a wrong password, then signs in', async () => {
    const user = userEvent.setup();
    login
      .mockRejectedValueOnce(new Error('Incorrect email or password.'))
      .mockResolvedValueOnce(userWithRole('citizen'));
    renderAt('/login');
    await user.type(screen.getByLabelText(/email/i), 'citizen.ramesh@gmail.com');
    await user.type(screen.getByLabelText(/password/i), 'wrong');
    await user.click(screen.getByRole('button', { name: /sign in to dashboard/i }));
    expect((await screen.findByRole('alert')).textContent).toMatch(/incorrect/i);

    await user.clear(screen.getByLabelText(/password/i));
    await user.type(screen.getByLabelText(/password/i), 'right');
    await user.click(screen.getByRole('button', { name: /sign in to dashboard/i }));
    expect(await screen.findByText('citizen home')).toBeTruthy();
  });
});

describe('FeedbackCard', () => {
  const problem = { id: 'P1', status: 'SOLVED', feedback: null };
  it('hides the form from non-owners', () => {
    render(<FeedbackCard problem={problem} isOwner={false} onSaved={() => {}} />);
    expect(screen.queryByRole('button', { name: /submit/i })).toBeNull();
  });
  it('requires a rating', async () => {
    const onSaved = vi.fn();
    render(<FeedbackCard problem={problem} isOwner onSaved={onSaved} />);
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(screen.getByRole('alert').textContent).toMatch(/star rating/i);
    expect(onSaved).not.toHaveBeenCalled();
  });
  it('only claims a site inspection when the citizen confirmed one', () => {
    const feedback = { rating: 4, submittedAt: '2026-01-01', verifiedOnGround: false };
    render(
      <FeedbackCard problem={{ ...problem, feedback }} isOwner onSaved={() => {}} />
    );
    expect(screen.queryByText(/confirmed inspecting/i)).toBeNull();
  });
});

describe('loading', () => {
  it('shows an error and recovers on retry', async () => {
    const loader = vi
      .fn()
      .mockRejectedValueOnce(new Error('Network down'))
      .mockResolvedValue('loaded');
    function Probe() {
      const { data, error, isLoading, reload } = useAsync(loader);
      if (isLoading || error) return <LoadState error={error} onRetry={reload} />;
      return <p>{data}</p>;
    }
    render(<Probe />);
    expect(await screen.findByText('Network down')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(await screen.findByText('loaded')).toBeTruthy();
  });
});
