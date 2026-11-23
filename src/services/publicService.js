import { request } from './apiClient';

/** Verified problems with rounded locations. Works without signing in. */
export const listPublicProblems = () => request('/public/problems');
