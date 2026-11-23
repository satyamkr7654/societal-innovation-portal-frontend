import { request } from './apiClient';

/** Resolves to the signed-in user, or null. */
export function restoreSession() {
  return request('/auth/me');
}

export function login({ email, password }) {
  return request('/auth/login', { method: 'POST', body: { email, password } });
}

export function register({ name, email, password, role, phone, organizationName }) {
  return request('/auth/register', {
    method: 'POST',
    body: { name, email, password, role, phone, organizationName },
  });
}

export function logout() {
  return request('/auth/logout', { method: 'POST' });
}
