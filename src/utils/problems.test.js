import { describe, expect, it } from 'vitest';
import { getStatusConfig, normalizeStatus } from '../constants/statusConfig';
import { SAMPLE_PROBLEMS } from '../test/sampleProblems';
import { JHARKHAND_DISTRICTS, findDistrict } from './jharkhand';
import {
  DEFAULT_FILTERS,
  countByStatus,
  filterProblems,
  isProblemOwner,
} from './problems';

const ids = (filters) =>
  filterProblems(SAMPLE_PROBLEMS, { ...DEFAULT_FILTERS, ...filters }).map((p) => p.id);

describe('ownership', () => {
  const problem = { citizen: { id: 'usr_1', name: 'Ramesh Kumar' } };
  it('compares IDs, never names', () => {
    expect(isProblemOwner(problem, { id: 'usr_1', name: 'Other' })).toBe(true);
    expect(isProblemOwner(problem, { id: 'usr_2', name: 'Ramesh Kumar' })).toBe(false);
    expect(isProblemOwner(problem, null)).toBe(false);
  });
});

describe('filterProblems', () => {
  it('combines filters', () => {
    expect(ids({ district: 'Ranchi', status: 'SOLVED' })).toEqual(['JH-2026-INF-0110']);
  });
  it('searches IDs and text in any casing', () => {
    expect(ids({ search: ' wtr-0101 ' })).toEqual(['JH-2026-WTR-0101']);
    expect(ids({ search: 'VACCINE' })).toEqual(['JH-2026-HLT-0103']);
  });
  it('sorts without changing the original list', () => {
    const before = SAMPLE_PROBLEMS.map((p) => p.id);
    expect(ids({ sort: 'oldest' })).toEqual(ids({ sort: 'newest' }).reverse());
    expect(SAMPLE_PROBLEMS.map((p) => p.id)).toEqual(before);
  });
});

describe('status', () => {
  it('counts add up', () => {
    const { ALL, ...rest } = countByStatus(SAMPLE_PROBLEMS);
    expect(Object.values(rest).reduce((a, b) => a + b, 0)).toBe(ALL);
  });
  it.each([
    ['in progress', 'IN_PROGRESS'],
    ['In-Progress', 'IN_PROGRESS'],
    ['progress', 'IN_PROGRESS'],
    ['solved', 'SOLVED'],
    ['constructor', 'SUBMITTED'],
  ])('normalizes %s', (input, expected) => {
    expect(normalizeStatus(input)).toBe(expected);
    expect(getStatusConfig(input).display).toBeTruthy();
  });
});

describe('sample data', () => {
  it('uses known districts', () => {
    expect(JHARKHAND_DISTRICTS).toHaveLength(24);
    SAMPLE_PROBLEMS.forEach((p) => expect(findDistrict(p.district)).toBeTruthy());
  });
});
