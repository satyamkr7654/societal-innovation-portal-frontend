import * as store from './mock/authStore';

/** The only module the app uses for accounts. Phase 4 swaps the bodies for HTTP calls. */
export async function restoreSession() {
  return store.getSessionUser();
}

export async function login(credentials) {
  return store.signIn(credentials);
}

export async function register(details) {
  return store.registerAccount(details);
}

export async function logout() {
  store.signOut();
}

export { DEMO_ACCOUNTS, DEMO_PASSWORD } from './mock/authStore';
