import React from 'react';
import { CIVIC_CATEGORIES } from '../../constants/categories';
import { ALL_STATUSES, STATUS_CONFIG } from '../../constants/statusConfig';
import { hasActiveFilters } from '../../utils/problems';

/** Search, scope, dropdown and status filters for a problem list. */
export default function ProblemFilters({
  filters,
  onFilterChange,
  onReset,
  scope,
  onScopeChange,
  mineCount,
  totalCount,
  districts,
  statusCounts,
}) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm space-y-4">
      {/* Row 1: Search, Scope Toggle & Reset */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            aria-label="Search problems"
            placeholder="Search by Problem ID, Title, District (e.g. JH-2026, Harmu, Ranchi)..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white text-slate-800 placeholder-slate-400 transition"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onFilterChange('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Scope Selector (All Portal vs My Submissions) */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onScopeChange('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              scope === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Portal Reports ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => onScopeChange('mine')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              scope === 'mine'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Submissions ({mineCount})
          </button>
        </div>

        {/* Reset Filters Button */}
        {hasActiveFilters(filters) && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-semibold text-accent-700 hover:text-accent-800 hover:underline px-2 py-1 shrink-0 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>↺</span> Reset Filters
          </button>
        )}
      </div>

      {/* Row 2: Category, District & Sort Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
        {/* Category Dropdown */}
        <div className="space-y-1">
          <label htmlFor="filter-category" className="font-semibold text-slate-600 block">
            Civic Category
          </label>
          <select
            id="filter-category"
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs"
          >
            <option value="ALL">All Civic Categories</option>
            {CIVIC_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* District Dropdown */}
        <div className="space-y-1">
          <label htmlFor="filter-district" className="font-semibold text-slate-600 block">
            Jharkhand District
          </label>
          <select
            id="filter-district"
            value={filters.district}
            onChange={(e) => onFilterChange('district', e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs"
          >
            <option value="ALL">All Districts</option>
            {districts.map((dist) => (
              <option key={dist} value={dist}>
                📍 {dist}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By Dropdown */}
        <div className="space-y-1">
          <label htmlFor="filter-sort" className="font-semibold text-slate-600 block">
            Sort By
          </label>
          <select
            id="filter-sort"
            value={filters.sort}
            onChange={(e) => onFilterChange('sort', e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs"
          >
            <option value="newest">Newest Lodged First</option>
            <option value="oldest">Oldest Lodged First</option>
            <option value="status">Status Priority (Solved → Submitted)</option>
          </select>
        </div>
      </div>

      {/* Row 3: Status Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-slate-100">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
          Status:
        </span>
        {['ALL', ...ALL_STATUSES].map((st) => {
          const isSelected = filters.status === st;
          const count = statusCounts[st];
          return (
            <button
              key={st}
              type="button"
              onClick={() => onFilterChange('status', st)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-primary-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{st === 'ALL' ? 'All' : STATUS_CONFIG[st].display}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isSelected ? 'bg-primary-800 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
