import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { getCategory } from '../../constants/categories';

/** One problem in the list. */
export default function ProblemCard({ problem, isOwner }) {
  const categoryMeta = getCategory(problem.category);
  const latestHistory = problem.statusHistory.at(-1);

  return (
    <Card
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
                  {problem.supporters.length > 0 ? (
                    <span className="text-emerald-700 font-semibold">
                      {problem.supporters.map((s) => s.sponsor).join(', ')}
                    </span>
                  ) : (
                    <span className="text-slate-400 italic">
                      No CSR Partner Pledged Yet
                    </span>
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
            <Button
              to={`/citizen/problems/${problem.id}`}
              variant="outline"
              size="sm"
              className="w-full text-xs font-bold"
            >
              Track Status &rarr;
            </Button>
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
            {problem.feedback
              ? 'Feedback Submitted ★'
              : isOwner
                ? 'Submit Citizen Feedback →'
                : 'View Details →'}
          </Link>
        </div>
      )}

      {problem.status === 'REJECTED' && (
        <div className="bg-red-50 px-5 py-2.5 border-t border-red-100 flex items-center justify-between text-xs text-red-800">
          <span className="font-semibold flex items-center gap-1.5">
            <span>⚠️</span> Rejected:{' '}
            {problem.rejectionReason || 'Did not meet civic criteria'}
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
}
