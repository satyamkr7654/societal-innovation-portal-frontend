import { photoToJpeg } from '../utils/image';
import { request } from './apiClient';

/** The only module pages use to read or change problems. The server decides who may. */
export function listProblems() {
  return request('/problems');
}

/** Resolves to null when no such problem exists. */
export async function getProblem(id) {
  try {
    return await request(`/problems/${encodeURIComponent(id)}`);
  } catch (error) {
    if (error.status === 404) return null;
    throw error;
  }
}

export async function createProblem({ photo, ...problem }) {
  const form = new FormData();
  form.append(
    'problem',
    new Blob([JSON.stringify(problem)], { type: 'application/json' })
  );
  if (photo) form.append('photo', await photoToJpeg(photo), 'photo.jpg');
  return request('/problems', { method: 'POST', body: form });
}

export function submitFeedback(problemId, feedback) {
  return request(`/problems/${encodeURIComponent(problemId)}/feedback`, {
    method: 'POST',
    body: feedback,
  });
}
