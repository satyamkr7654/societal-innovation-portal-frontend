import {
  ALL_STATUSES,
  getStatusConfig,
  normalizeStatus,
} from '../constants/statusConfig';

export const DEFAULT_FILTERS = {
  search: '',
  status: 'ALL',
  category: 'ALL',
  district: 'ALL',
  sort: 'newest',
};

export const isProblemOwner = (problem, user) =>
  Boolean(user) && problem.citizen.id === user.id;

export function countByStatus(problems) {
  const counts = { ALL: problems.length };
  ALL_STATUSES.forEach((status) => {
    counts[status] = problems.filter((p) => normalizeStatus(p.status) === status).length;
  });
  return counts;
}

export function hasActiveFilters({ search, status, category, district }) {
  return (
    search.trim() !== '' || [status, category, district].some((value) => value !== 'ALL')
  );
}

const comparators = {
  newest: (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt),
  oldest: (a, b) => new Date(a.submittedAt) - new Date(b.submittedAt),
  status: (a, b) => getStatusConfig(b.status).order - getStatusConfig(a.status).order,
};

export function filterProblems(problems, { search, status, category, district, sort }) {
  const query = search.trim().toLowerCase();
  return problems
    .filter(
      (p) =>
        (status === 'ALL' || normalizeStatus(p.status) === status) &&
        (category === 'ALL' || p.category === category) &&
        (district === 'ALL' || p.district === district) &&
        (!query ||
          [
            p.title,
            p.id,
            p.district,
            p.location?.address,
            p.description,
            p.assignedUniversity?.name,
          ].some((text) => text?.toLowerCase().includes(query)))
    )
    .sort(comparators[sort] || comparators.newest);
}
