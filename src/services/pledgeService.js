import { request } from './apiClient';

const post = (path, body = {}) => request(path, { method: 'POST', body });
const path = (role, problemId) =>
  `/${role}/problems/${encodeURIComponent(problemId)}/pledges`;

// Industry
export const listOpenProposals = () => request('/industry/proposals');
export const listMyPledges = () => request('/industry/pledges');
export const offerPledge = (problemId, pledge) =>
  post(path('industry', problemId), pledge);
export const withdrawPledge = (problemId, id) =>
  post(`${path('industry', problemId)}/${id}/withdraw`);

// University
export const acceptPledge = (problemId, id) =>
  post(`${path('university', problemId)}/${id}/accept`);
export const declinePledge = (problemId, id, reason) =>
  post(`${path('university', problemId)}/${id}/decline`, { reason });
