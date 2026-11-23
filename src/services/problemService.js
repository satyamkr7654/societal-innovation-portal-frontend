import { photoToDataUrl } from '../utils/image';
import { getSessionUser } from './mock/authStore';
import * as store from './mock/problemStore';

/**
 * The only module pages use to read or change problems.
 * Every function is async, and the acting user comes from the session rather than the
 * caller, so the Phase 4 HTTP API can replace the bodies without changing any page.
 */
function requireUser() {
  const user = getSessionUser();
  if (!user) throw new Error('Please sign in to continue.');
  return user;
}

export async function listProblems() {
  return store.getProblems();
}

export async function getProblem(id) {
  return store.getProblemById(id);
}

export async function createProblem({ photo, ...problem }) {
  const user = requireUser();
  if (user.role !== 'citizen') throw new Error('Only citizens can report problems.');
  const photoUrl = photo ? await photoToDataUrl(photo) : null;
  return store.createProblem({ ...problem, photoUrl }, user);
}

export async function submitFeedback(problemId, feedback) {
  return store.saveFeedback(problemId, feedback, requireUser());
}
