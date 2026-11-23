import { request } from './apiClient';

/** Admin-only calls. The server checks the role on every one. */
export const getStats = () => request('/admin/stats');

export const listUniversities = () => request('/admin/universities');

export const listPendingAccounts = () => request('/admin/accounts/pending');

export function decideAccount(id, approve) {
  const action = approve ? 'approve' : 'reject';
  return request(`/admin/accounts/${encodeURIComponent(id)}/${action}`, {
    method: 'POST',
  });
}

const decideProblem = (id, action, body) =>
  request(`/admin/problems/${encodeURIComponent(id)}/${action}`, {
    method: 'POST',
    body,
  });

export const validateProblem = (id, remarks) =>
  decideProblem(id, 'validate', { remarks });

export const rejectProblem = (id, reason) => decideProblem(id, 'reject', { reason });

export const assignProblem = (id, organizationId, remarks) =>
  decideProblem(id, 'assign', { organizationId, remarks });
