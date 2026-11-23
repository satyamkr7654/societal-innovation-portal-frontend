import React, { useCallback, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import LoadState from '../../components/ui/LoadState';
import StatusStepper from '../../components/ui/StatusStepper';
import AuditTimeline from '../../components/problems/AuditTimeline';
import EvidenceCard from '../../components/problems/EvidenceCard';
import FeedbackCard from '../../components/problems/FeedbackCard';
import LocationCard from '../../components/problems/LocationCard';
import ReporterCard from '../../components/problems/ReporterCard';
import SponsorCard from '../../components/problems/SponsorCard';
import UniversityCard from '../../components/problems/UniversityCard';
import { getCategory } from '../../constants/categories';
import { useAsync } from '../../hooks/useAsync';
import { useAuth } from '../../hooks/useAuth';
import { getProblem } from '../../services/problemService';
import { isProblemOwner } from '../../utils/problems';

export default function ProblemDetail() {
  const { id } = useParams();
  // The key resets all state when the URL points to another problem
  return <ProblemDossier key={id} id={id} />;
}

function ProblemDossier({ id }) {
  const { user } = useAuth();
  const load = useCallback(() => getProblem(id), [id]);
  const { data: problem, error, isLoading, reload, setData } = useAsync(load);
  const [copiedId, setCopiedId] = useState(false);

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(problem.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } catch {
      // Clipboard blocked: the ID is still visible on the page
    }
  };

  if (isLoading || error) return <LoadState error={error} onRetry={reload} />;

  if (!problem) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-3xl mx-auto">
          ⚠️
        </div>
        <h2 className="text-xl font-heading font-bold text-slate-900">
          Problem Record Not Found
        </h2>
        <p className="text-sm text-slate-500">
          No grievance matches Case ID{' '}
          <code className="font-mono font-bold text-slate-700">{id}</code>. It may have
          been archived or removed.
        </p>
        <Link to="/citizen/problems">
          <Button variant="primary" size="sm">
            &larr; Back to My Problems
          </Button>
        </Link>
      </div>
    );
  }

  const categoryMeta = getCategory(problem.category);
  const isOwner = isProblemOwner(problem, user);
  const showFeedback = problem.status === 'SOLVED' || Boolean(problem.feedback);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex items-center justify-between">
        <Link
          to="/citizen/problems"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-700 hover:text-primary-900 hover:underline transition"
        >
          <span>&larr;</span> Back to My Reported Problems
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyId}
            className="text-xs px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono transition flex items-center gap-1"
          >
            <span>{copiedId ? '✓ Copied' : '📋 Copy ID'}</span>
          </button>
        </div>
      </div>

      {/* Case Header Card */}
      <div className="bg-white p-6 sm:p-7 rounded-xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-black tracking-wide px-2.5 py-0.5 bg-primary-50 text-primary-800 rounded border border-primary-200">
                CASE #{problem.id}
              </span>
              <Badge status={problem.status} size="md" />
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full">
                <span>{categoryMeta?.icon || '📌'}</span>
                <span>{categoryMeta?.id || problem.category}</span>
              </span>
              {problem.district && (
                <span className="text-xs text-slate-600 font-medium">
                  📍 {problem.district}, Jharkhand
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 tracking-tight leading-snug">
              {problem.title}
            </h1>
          </div>

          <div className="text-left md:text-right shrink-0 text-xs text-slate-500 space-y-1">
            <div>
              Lodged On:{' '}
              <strong className="text-slate-800">
                {new Date(problem.submittedAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </strong>
            </div>
            <div>
              Citizen Reporter:{' '}
              <strong className="text-slate-800">
                {problem.citizen?.name || 'Citizen'}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Stage Lifecycle Stepper Component */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Lifecycle Milestone Progression
          </h2>
          <span className="text-xs text-slate-400">SIH26043 Civic Workflow</span>
        </div>
        <StatusStepper
          currentStatus={problem.status}
          statusHistory={problem.statusHistory || []}
          rejectionReason={problem.rejectionReason}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <EvidenceCard problem={problem} />
          <AuditTimeline history={problem.statusHistory} />
          {showFeedback && (
            <FeedbackCard problem={problem} isOwner={isOwner} onSaved={setData} />
          )}
        </div>

        <div className="space-y-6">
          <LocationCard problem={problem} />
          <UniversityCard university={problem.assignedUniversity} />
          <SponsorCard support={problem.industrySupport} />
          <ReporterCard citizen={problem.citizen} phone={isOwner ? user.phone : null} />
        </div>
      </div>
    </div>
  );
}
