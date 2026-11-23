import { describe, expect, it } from 'vitest';
import { DEMO_ACCOUNTS, DEMO_PASSWORD, login, logout } from './authService';
import {
  createProblem,
  getProblem,
  listProblems,
  submitFeedback,
} from './problemService';
import { SAMPLE_PROBLEMS } from './mock/sampleProblems';

const KEY = 'sih26043_problems_v2';
const SOLVED_BY_RAMESH = 'JH-2026-INF-0110';
const SOLVED_BY_OTHER = 'JH-2026-INF-0106';

const loginAs = (role) =>
  login({
    email: DEMO_ACCOUNTS.find((a) => a.role === role).email,
    password: DEMO_PASSWORD,
  });

const clearFeedback = () =>
  localStorage.setItem(
    KEY,
    JSON.stringify(SAMPLE_PROBLEMS.map((p) => ({ ...p, feedback: null })))
  );

const draft = {
  title: 'Broken water pipe near school',
  description: 'Water has been leaking here for many days.',
  category: 'Water',
  district: 'Ranchi',
  location: { address: 'Harmu', lat: 23.35, lng: 85.31 },
  photo: null,
};
const review = { rating: 4, remarks: null, verifiedOnGround: false };

describe('createProblem', () => {
  it('requires a signed-in citizen', async () => {
    await expect(createProblem(draft)).rejects.toThrow('sign in');
    await loginAs('university');
    await expect(createProblem(draft)).rejects.toThrow('Only citizens');
  });

  it('records the session user as owner and starts as SUBMITTED', async () => {
    const user = await loginAs('citizen');
    const created = await createProblem({ ...draft, citizen: { id: 'forged' } });
    expect(created.citizen.id).toBe(user.id);
    expect(created.status).toBe('SUBMITTED');
    expect(created.photoUrl).toBeNull();
    expect(await getProblem(created.id)).toEqual(created);
  });

  it('gives each problem a new ID with its category code', async () => {
    await loginAs('citizen');
    const first = await createProblem(draft);
    const second = await createProblem({ ...draft, category: 'Energy' });
    expect(first.id).toMatch(/-WTR-0111$/);
    expect(second.id).toMatch(/-NRG-0112$/);
  });
});

describe('submitFeedback', () => {
  it('accepts the owner of a solved problem, once', async () => {
    clearFeedback();
    await loginAs('citizen');
    const updated = await submitFeedback(SOLVED_BY_RAMESH, review);
    expect(updated.feedback).toMatchObject({ rating: 4, citizenName: 'Ramesh Kumar' });
    await expect(submitFeedback(SOLVED_BY_RAMESH, review)).rejects.toThrow('already');
  });

  it('refuses other citizens, unsolved problems and visitors', async () => {
    clearFeedback();
    await loginAs('citizen');
    await expect(submitFeedback(SOLVED_BY_OTHER, review)).rejects.toThrow('Only the');
    await expect(submitFeedback('JH-2026-WTR-0101', review)).rejects.toThrow('solved');
    await logout();
    await expect(submitFeedback(SOLVED_BY_RAMESH, review)).rejects.toThrow('sign in');
  });
});

describe('damaged storage', () => {
  it.each(['{}', 'not json', 'null'])(
    'falls back to sample data for %s',
    async (value) => {
      localStorage.setItem(KEY, value);
      expect(await listProblems()).toHaveLength(SAMPLE_PROBLEMS.length);
    }
  );

  it('skips invalid records', async () => {
    localStorage.setItem(KEY, JSON.stringify([null, { id: 1 }, SAMPLE_PROBLEMS[0]]));
    expect(await listProblems()).toHaveLength(1);
  });
});
