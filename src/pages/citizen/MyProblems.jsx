import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';
import LoadState from '../../components/ui/LoadState';
import ProblemCard from '../../components/problems/ProblemCard';
import ProblemFilters from '../../components/problems/ProblemFilters';
import StatusSummary from '../../components/problems/StatusSummary';
import { useAsync } from '../../hooks/useAsync';
import { useAuth } from '../../hooks/useAuth';
import { listProblems } from '../../services/problemService';
import {
  DEFAULT_FILTERS,
  countByStatus,
  filterProblems,
  hasActiveFilters,
  isProblemOwner,
} from '../../utils/problems';

const NO_PROBLEMS = [];

export default function MyProblems() {
  const { user } = useAuth();
  const createdId = useLocation().state?.createdId;
  const { data, error, isLoading, reload } = useAsync(listProblems);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [scope, setScope] = useState('mine'); // 'mine' or 'all'

  // Everything below (counts, districts, results) follows the selected scope
  const allProblems = data || NO_PROBLEMS;
  const myProblems = useMemo(
    () => allProblems.filter((p) => isProblemOwner(p, user)),
    [allProblems, user]
  );
  const problems = scope === 'mine' ? myProblems : allProblems;

  const districts = useMemo(
    () => [...new Set(problems.map((p) => p.district).filter(Boolean))].sort(),
    [problems]
  );
  const statusCounts = useMemo(() => countByStatus(problems), [problems]);
  const filteredProblems = useMemo(
    () => filterProblems(problems, filters),
    [problems, filters]
  );
  const isFiltered = hasActiveFilters(filters);

  const changeFilter = (name, value) =>
    setFilters((current) => ({ ...current, [name]: value }));
  const resetFilters = () => setFilters(DEFAULT_FILTERS);
  const changeScope = (next) => {
    setScope(next);
    changeFilter('district', 'ALL'); // the district list differs per scope
  };

  if (isLoading || error) return <LoadState error={error} onRetry={reload} />;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">📋</span>
            <h1 className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight">
              My Reported Problems & Grievances
            </h1>
          </div>
          <p className="text-sm text-slate-600 max-w-2xl">
            Live lifecycle tracking for civic problems submitted across Jharkhand
            districts. Track verification, university R&amp;D assignments, and on-ground
            deployment milestones.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            to="/citizen/submit"
            variant="primary"
            size="md"
            className="shadow-md shadow-primary-500/20"
          >
            <span className="mr-1.5 font-bold">+</span> Lodge New Problem
          </Button>
        </div>
      </div>

      {createdId && (
        <div
          role="status"
          className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium"
        >
          Problem submitted successfully. Your Case ID is <strong>{createdId}</strong>.
        </div>
      )}

      <StatusSummary
        counts={statusCounts}
        selected={filters.status}
        onSelect={(status) => changeFilter('status', status)}
      />

      <ProblemFilters
        filters={filters}
        onFilterChange={changeFilter}
        onReset={resetFilters}
        scope={scope}
        onScopeChange={changeScope}
        mineCount={myProblems.length}
        totalCount={allProblems.length}
        districts={districts}
        statusCounts={statusCounts}
      />

      <p className="text-xs text-slate-500 px-1">
        Showing <strong className="text-slate-800">{filteredProblems.length}</strong> of{' '}
        {problems.length} problems
      </p>

      {filteredProblems.length > 0 ? (
        <div className="space-y-4">
          {filteredProblems.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              isOwner={isProblemOwner(problem, user)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/90 p-12 text-center max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
            🔍
          </div>
          <h3 className="text-lg font-heading font-bold text-slate-900 mb-1">
            No Problems Found
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mb-6 max-w-md mx-auto">
            {isFiltered
              ? 'No civic grievances match your current search and filter combination. Try resetting your filters to see all reported problems.'
              : 'You have not reported any civic problems yet. Lodge your first problem to connect with Jharkhand university innovation labs.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {isFiltered ? (
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Clear All Filters
              </Button>
            ) : null}
            <Button to="/citizen/submit" variant="primary" size="sm">
              + Lodge a New Problem
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
