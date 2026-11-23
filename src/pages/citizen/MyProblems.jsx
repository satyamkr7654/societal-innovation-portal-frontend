import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { getMockProblems, CIVIC_CATEGORIES } from '../../utils/mockData';
import { WORKFLOW_STAGES, getStatusConfig } from '../../utils/statusConfig';
import { useAuth } from '../../context/AuthContext';

export default function MyProblems() {
  const { user } = useAuth();
  const [problems] = useState(() => getMockProblems());

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  const [scope, setScope] = useState('all'); // 'all' or 'mine'

  // Extract unique districts from problems
  const districts = useMemo(() => {
    const set = new Set(problems.map((p) => p.district).filter(Boolean));
    return Array.from(set).sort();
  }, [problems]);

  // Status count metrics for summary bar & status tabs
  const statusCounts = useMemo(() => {
    const counts = {
      ALL: problems.length,
      SUBMITTED: 0,
      VALIDATED: 0,
      ASSIGNED: 0,
      IN_PROGRESS: 0,
      SOLVED: 0,
      REJECTED: 0,
    };
    problems.forEach((p) => {
      const norm = String(p.status).toUpperCase().replace(/[\s-]+/g, '_');
      if (counts[norm] !== undefined) {
        counts[norm] += 1;
      }
    });
    return counts;
  }, [problems]);

  // Filtered & sorted problems
  const filteredProblems = useMemo(() => {
    return problems
      .filter((p) => {
        // Scope filter
        if (scope === 'mine' && user?.name) {
          const isOwner =
            p.citizen?.name?.toLowerCase().includes(user.name.toLowerCase()) ||
            p.citizen?.phone === user.phone;
          if (!isOwner) return false;
        }

        // Status filter
        if (selectedStatus !== 'ALL') {
          const norm = String(p.status).toUpperCase().replace(/[\s-]+/g, '_');
          if (norm !== selectedStatus) return false;
        }

        // Category filter
        if (selectedCategory !== 'ALL' && p.category !== selectedCategory) {
          return false;
        }

        // District filter
        if (selectedDistrict !== 'ALL' && p.district !== selectedDistrict) {
          return false;
        }

        // Search query (Title, ID, District, Address, Description)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = p.title?.toLowerCase().includes(q);
          const matchId = p.id?.toLowerCase().includes(q);
          const matchDistrict = p.district?.toLowerCase().includes(q);
          const matchAddress = p.location?.address?.toLowerCase().includes(q);
          const matchDesc = p.description?.toLowerCase().includes(q);
          const matchUniv = p.assignedUniversity?.name?.toLowerCase().includes(q);
          return matchTitle || matchId || matchDistrict || matchAddress || matchDesc || matchUniv;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.submittedAt) - new Date(a.submittedAt);
        }
        if (sortBy === 'oldest') {
          return new Date(a.submittedAt) - new Date(b.submittedAt);
        }
        if (sortBy === 'status') {
          const orderA = getStatusConfig(a.status).order;
          const orderB = getStatusConfig(b.status).order;
          return orderB - orderA;
        }
        return 0;
      });
  }, [problems, scope, user, selectedStatus, selectedCategory, selectedDistrict, searchQuery, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedStatus !== 'ALL' ||
    selectedCategory !== 'ALL' ||
    selectedDistrict !== 'ALL' ||
    scope !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedStatus('ALL');
    setSelectedCategory('ALL');
    setSelectedDistrict('ALL');
    setSortBy('newest');
    setScope('all');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">📋</span>
            <h1 className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight">
              My Reported Problems & Grievances
            </h1>
          </div>
          <p className="text-sm text-slate-600 max-w-2xl">
            Live lifecycle tracking for civic problems submitted across Jharkhand districts. Track verification,
            university R&amp;D assignments, and on-ground deployment milestones.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link to="/citizen/submit">
            <Button variant="primary" size="md" className="shadow-md shadow-primary-500/20">
              <span className="mr-1.5 font-bold">+</span> Lodge New Problem
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards (Clickable Filter Triggers) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { key: 'ALL', label: 'Total Tracked', count: statusCounts.ALL, color: 'text-slate-900', bg: 'bg-white', border: 'border-slate-200' },
          { key: 'SUBMITTED', label: 'Submitted', count: statusCounts.SUBMITTED, color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-300' },
          { key: 'VALIDATED', label: 'Validated', count: statusCounts.VALIDATED, color: 'text-blue-700', bg: 'bg-blue-50/50', border: 'border-blue-200' },
          { key: 'ASSIGNED', label: 'Assigned', count: statusCounts.ASSIGNED, color: 'text-purple-700', bg: 'bg-purple-50/50', border: 'border-purple-200' },
          { key: 'IN_PROGRESS', label: 'In Progress', count: statusCounts.IN_PROGRESS, color: 'text-amber-700', bg: 'bg-amber-50/50', border: 'border-amber-200' },
          { key: 'SOLVED', label: 'Solved', count: statusCounts.SOLVED, color: 'text-emerald-700', bg: 'bg-emerald-50/50', border: 'border-emerald-200' },
        ].map((item) => {
          const isActive = selectedStatus === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setSelectedStatus(item.key)}
              className={`p-3.5 rounded-lg border text-left transition-all duration-200 ${item.bg} ${item.border} ${
                isActive
                  ? 'ring-2 ring-primary-500 shadow-md -translate-y-0.5'
                  : 'hover:border-slate-400 hover:shadow-sm'
              }`}
            >
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                {item.label}
              </div>
              <div className={`text-2xl font-heading font-black ${item.color}`}>
                {item.count}
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter & Search Bar */}
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
              placeholder="Search by Problem ID, Title, District (e.g. JH-2026, Harmu, Ranchi)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white text-slate-800 placeholder-slate-400 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
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
              onClick={() => setScope('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                scope === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Portal Reports ({problems.length})
            </button>
            <button
              type="button"
              onClick={() => setScope('mine')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                scope === 'mine'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Submissions Only
            </button>
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
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
            <label className="font-semibold text-slate-600 block">Civic Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
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
            <label className="font-semibold text-slate-600 block">Jharkhand District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
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
            <label className="font-semibold text-slate-600 block">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs"
            >
              <option value="newest">Newest Lodged First</option>
              <option value="oldest">Oldest Lodged First</option>
              <option value="status">Status Priority (Solved → Submitted)</option>
            </select>
          </div>
        </div>

        {/* Row 3: Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-slate-100 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Status:
          </span>
          {['ALL', ...WORKFLOW_STAGES, 'REJECTED'].map((st) => {
            const isSelected = selectedStatus === st;
            const count = statusCounts[st] !== undefined ? statusCounts[st] : 0;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-primary-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{st === 'ALL' ? 'All' : st.replace('_', ' ')}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
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

      {/* Results Count & Quick Filter Active Tags */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-800 font-bold">{filteredProblems.length}</strong> of{' '}
          {problems.length} problems
        </span>
        {hasActiveFilters && (
          <span className="text-accent-700 font-medium">Filtered results active</span>
        )}
      </div>

      {/* Problems List */}
      {filteredProblems.length > 0 ? (
        <div className="space-y-4">
          {filteredProblems.map((problem) => {
            const statusMeta = getStatusConfig(problem.status);
            const latestHistory = problem.statusHistory?.[problem.statusHistory.length - 1];
            const categoryMeta = CIVIC_CATEGORIES.find((c) => c.id === problem.category);

            return (
              <Card
                key={problem.id}
                hover={true}
                padding="none"
                className="transition-all border-slate-200 hover:border-slate-300"
              >
                <div className="p-5 sm:p-6 flex flex-col md:flex-row gap-5 items-start justify-between">
                  {/* Left Column: Details */}
                  <div className="space-y-3 flex-1">
                    {/* Header Chips */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                        {problem.id}
                      </span>
                      <Badge status={problem.status} size="sm" />
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full">
                        <span>{categoryMeta?.icon || '📌'}</span>
                        <span>{categoryMeta?.id || problem.category}</span>
                      </span>
                      {problem.district && (
                        <span className="text-xs text-slate-500 font-medium flex items-center gap-0.5">
                          <span>📍</span> {problem.district}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <div>
                      <Link
                        to={`/citizen/problems/${problem.id}`}
                        className="font-heading font-bold text-base sm:text-lg text-slate-900 hover:text-primary-600 transition line-clamp-2"
                      >
                        {problem.title}
                      </Link>
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                        {problem.description}
                      </p>
                    </div>

                    {/* Meta Row: Assigned University & Industry */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs border-t border-slate-100">
                      {/* University Assignment */}
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className="text-base shrink-0">🏛️</span>
                        <div className="truncate">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                            R&amp;D Assignee
                          </span>
                          <span className="font-medium text-slate-800 truncate block">
                            {problem.assignedUniversity?.name || (
                              <span className="text-slate-400 italic">
                                Pending Nodal University Allocation
                              </span>
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Industry Support */}
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className="text-base shrink-0">💼</span>
                        <div className="truncate">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                            Industry / CSR Sponsor
                          </span>
                          <span className="font-medium text-slate-800 truncate block">
                            {problem.industrySupport?.sponsor ? (
                              <span className="text-emerald-700 font-semibold">
                                {problem.industrySupport.sponsor} ({problem.industrySupport.amount})
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">No CSR Partner Pledged Yet</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Latest Status Remark Snippet */}
                    {latestHistory && (
                      <div className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 flex items-start gap-2 text-slate-600">
                        <span className="text-slate-400 font-bold shrink-0">Latest Audit:</span>
                        <span className="italic line-clamp-1 flex-1">
                          &quot;{latestHistory.remarks}&quot;
                        </span>
                        <span className="text-[11px] text-slate-400 shrink-0">
                          {new Date(latestHistory.changedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Photo Thumbnail + Action CTA */}
                  <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-44 shrink-0 gap-3 border-t md:border-t-0 pt-3 md:pt-0">
                    {/* Thumbnail if photo exists */}
                    {problem.photoUrl ? (
                      <div className="w-20 h-16 sm:w-28 sm:h-20 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                        <img
                          src={problem.photoUrl}
                          alt={problem.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-16 sm:w-28 sm:h-20 rounded-lg border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-400 text-[10px]">
                        <span>📷</span>
                        <span>No Photo</span>
                      </div>
                    )}

                    <div className="text-right space-y-1.5 w-full">
                      <Link to={`/citizen/problems/${problem.id}`} className="block w-full">
                        <Button variant="outline" size="sm" className="w-full text-xs font-bold">
                          Track Status &rarr;
                        </Button>
                      </Link>
                      <span className="text-[11px] text-slate-400 block text-center md:text-right">
                        Lodged{' '}
                        {new Date(problem.submittedAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Optional Status Banner for Solved or Rejected */}
                {problem.status === 'SOLVED' && (
                  <div className="bg-emerald-50 px-5 py-2.5 border-t border-emerald-100 flex items-center justify-between text-xs text-emerald-800">
                    <span className="font-semibold flex items-center gap-1.5">
                      <span>✅</span> Solution deployed and validated on-site.
                    </span>
                    <Link
                      to={`/citizen/problems/${problem.id}#feedback`}
                      className="text-emerald-900 font-bold hover:underline"
                    >
                      {problem.feedback ? 'Feedback Submitted ★' : 'Submit Citizen Feedback →'}
                    </Link>
                  </div>
                )}

                {problem.status === 'REJECTED' && (
                  <div className="bg-red-50 px-5 py-2.5 border-t border-red-100 flex items-center justify-between text-xs text-red-800">
                    <span className="font-semibold flex items-center gap-1.5">
                      <span>⚠️</span> Rejected: {problem.rejectionReason || 'Did not meet civic criteria'}
                    </span>
                    <Link
                      to={`/citizen/problems/${problem.id}`}
                      className="text-red-900 font-bold hover:underline"
                    >
                      View Review Notes →
                    </Link>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-xl border border-slate-200/90 p-12 text-center max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
            🔍
          </div>
          <h3 className="text-lg font-heading font-bold text-slate-900 mb-1">
            No Problems Found
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mb-6 max-w-md mx-auto">
            {hasActiveFilters
              ? 'No civic grievances match your current search and filter combination. Try resetting your filters to see all reported problems.'
              : 'You have not reported any civic problems yet. Lodge your first problem to connect with Jharkhand university innovation labs.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {hasActiveFilters ? (
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Clear All Filters
              </Button>
            ) : null}
            <Link to="/citizen/submit">
              <Button variant="primary" size="sm">
                + Lodge a New Problem
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
