import { request } from './apiClient';

const post = (path, body = {}) => request(path, { method: 'POST', body });
const university = (id, action) =>
  `/university/problems/${encodeURIComponent(id)}/${action}`;
const admin = (id, action) => `/admin/problems/${encodeURIComponent(id)}/${action}`;

/** Resolves to null when no university is assigned. */
export const getProject = (id) => request(`/problems/${encodeURIComponent(id)}/project`);

// University
export const listAssignments = () => request('/university/assignments');
export const acceptAssignment = (id, team) => post(university(id, 'accept'), team);
export const declineAssignment = (id, reason) =>
  post(university(id, 'decline'), { reason });
export const submitProposal = (id, proposal) =>
  post(university(id, 'proposal'), proposal);
export const completeMilestone = (id, milestoneId, note) =>
  post(university(id, `milestones/${milestoneId}/complete`), { note });
export const requestCompletion = (id) => post(university(id, 'request-completion'));

// Admin
export const approveProposal = (id, remarks) =>
  post(admin(id, 'proposal/approve'), { remarks });
export const requestProposalChanges = (id, reason) =>
  post(admin(id, 'proposal/request-changes'), { reason });
export const confirmCompletion = (id, remarks) =>
  post(admin(id, 'complete'), { remarks });
export const returnForWork = (id, reason) => post(admin(id, 'return'), { reason });
