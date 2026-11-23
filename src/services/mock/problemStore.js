import { getCategory } from '../../constants/categories';
import { isProblemOwner } from '../../utils/problems';
import { SAMPLE_PROBLEMS } from './sampleProblems';
import { readJson, writeJson } from './storage';

/** Demo problem store, kept in this browser only. Phase 4 replaces it. */
// v2: citizen ids are stable and photos are stored with the record
const STORAGE_KEY = 'sih26043_problems_v2';

const isProblem = (p) =>
  Boolean(p) &&
  ['id', 'title', 'description', 'category', 'status', 'submittedAt'].every(
    (field) => typeof p[field] === 'string'
  ) &&
  typeof p.citizen?.id === 'string' &&
  Array.isArray(p.statusHistory);

/** Returns the saved problems, or the sample data when nothing valid is stored. */
export function getProblems() {
  return readJson(STORAGE_KEY, Array.isArray, SAMPLE_PROBLEMS).filter(isProblem);
}

export function getProblemById(id) {
  return getProblems().find((p) => p.id === id) || null;
}

export function createProblem(problemData, user) {
  const all = getProblems();
  const now = new Date();
  const lastNumber = Math.max(100, ...all.map((p) => Number(p.id.split('-').pop()) || 0));
  const code = getCategory(problemData.category)?.code || 'GEN';
  const submittedAt = now.toISOString();

  const newProblem = {
    ...problemData,
    id: `JH-${now.getFullYear()}-${code}-${String(lastNumber + 1).padStart(4, '0')}`,
    citizen: { id: user.id, name: user.name },
    status: 'SUBMITTED',
    rejectionReason: null,
    submittedAt,
    assignedUniversity: null,
    industrySupport: null,
    statusHistory: [
      {
        stage: 'SUBMITTED',
        changedAt: submittedAt,
        changedBy: `Citizen ${user.name}`,
        remarks:
          'Problem registered through Jharkhand Societal Innovation Collaboration Portal.',
      },
    ],
    feedback: null,
  };

  writeJson(STORAGE_KEY, [newProblem, ...all]);
  return newProblem;
}

/** Only the citizen who reported a solved problem may review it, and only once. */
export function saveFeedback(id, feedback, user) {
  const all = getProblems();
  const problem = all.find((p) => p.id === id);
  if (!problem) throw new Error('This problem no longer exists.');
  if (!isProblemOwner(problem, user)) {
    throw new Error('Only the citizen who reported this problem can review it.');
  }
  if (problem.status !== 'SOLVED') {
    throw new Error('Feedback opens once the problem is solved.');
  }
  if (problem.feedback) throw new Error('Feedback has already been submitted.');

  const updated = {
    ...problem,
    feedback: {
      ...feedback,
      citizenName: user.name,
      submittedAt: new Date().toISOString(),
    },
  };
  writeJson(
    STORAGE_KEY,
    all.map((p) => (p.id === id ? updated : p))
  );
  return updated;
}
