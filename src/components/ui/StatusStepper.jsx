import React from 'react';

/**
 * StatusStepper - 5-Stage Civic Workflow Progression Stepper
 * Handles standard progression and REJECTED edge-cases with audit timestamps.
 *
 * @param {string} currentStatus - 'SUBMITTED' | 'VALIDATED' | 'ASSIGNED' | 'IN_PROGRESS' | 'SOLVED' | 'REJECTED'
 * @param {Array} statusHistory - History entries [{ stage, changedAt, changedBy, remarks }]
 * @param {string} rejectionReason - Optional rejection justification
 */
export default function StatusStepper({
  currentStatus = 'SUBMITTED',
  statusHistory = [],
  rejectionReason = null,
}) {
  const normStatus = String(currentStatus).toUpperCase().replace(/[\s-]+/g, '_');
  const isRejected = normStatus === 'REJECTED';

  const stages = [
    {
      id: 'SUBMITTED',
      label: 'Submitted',
      stepNum: 1,
      description: 'Lodge & Register',
      shortDesc: 'Problem registered with GPS & photos',
    },
    {
      id: 'VALIDATED',
      label: 'Validated',
      stepNum: 2,
      description: 'Nodal Verification',
      shortDesc: 'Govt admin confirms authenticity',
    },
    {
      id: 'ASSIGNED',
      label: 'Assigned',
      stepNum: 3,
      description: 'University Allocation',
      shortDesc: 'Faculty & student lab assigned',
    },
    {
      id: 'IN_PROGRESS',
      label: 'In Progress',
      stepNum: 4,
      description: 'R&D / Prototyping',
      shortDesc: 'Engineering solution formulated',
    },
    {
      id: 'SOLVED',
      label: 'Solved',
      stepNum: 5,
      description: 'On-Ground Deployed',
      shortDesc: 'Civic solution deployed & verified',
    },
  ];

  // Helper to find date from statusHistory
  const getStageDate = (stageId) => {
    const entry = statusHistory.find(
      (h) => String(h.stage).toUpperCase().replace(/[\s-]+/g, '_') === stageId
    );
    if (!entry) return null;
    try {
      const d = new Date(entry.changedAt);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return null;
    }
  };

  const currentIndex = stages.findIndex((s) => s.id === normStatus);
  const effectiveIndex = isRejected ? 1 : currentIndex >= 0 ? currentIndex : 0;

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200/90 shadow-sm p-5 sm:p-7">
      {/* Rejection Alert Banner if Rejected */}
      {isRejected && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold shrink-0 mt-0.5">
            ✕
          </div>
          <div className="space-y-1">
            <h4 className="font-heading font-bold text-sm text-red-900">
              Grievance Validation Terminated (Rejected)
            </h4>
            <p className="text-xs text-red-700 leading-relaxed">
              <strong>Official Reason:</strong> {rejectionReason || 'The lodged grievance could not be validated against civic jurisdiction or societal innovation criteria.'}
            </p>
            <p className="text-[11px] text-red-600">
              If you believe this is an error, you may lodge a fresh grievance with updated GPS coordinates and clearer documentation.
            </p>
          </div>
        </div>
      )}

      {/* Desktop Stepper (Horizontal Track) */}
      <div className="hidden md:block">
        <div className="relative flex items-start">
          {/* Connecting Background Line */}
          <div className="absolute top-5 left-[10%] right-[10%] h-1 bg-slate-200" />

          {/* Active Progress Fill Line */}
          <div
            className={`absolute top-5 left-[10%] h-1 transition-all duration-500 ${
              isRejected ? 'bg-red-400' : 'bg-primary-600'
            }`}
            style={{
              width: `${(effectiveIndex / (stages.length - 1)) * 80}%`,
            }}
          />

          {/* Stepper Nodes */}
          {stages.map((stage, idx) => {
            const isCompleted = idx < effectiveIndex;
            const isCurrent = !isRejected && idx === effectiveIndex;
            const isStageRejected = isRejected && idx === 1;
            const dateStr = getStageDate(stage.id);

            return (
              <div
                key={stage.id}
                className="flex flex-col items-center text-center relative z-10 flex-1 min-w-0 px-1"
              >
                {/* Node Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    isStageRejected
                      ? 'bg-red-600 text-white ring-4 ring-red-100 shadow-md'
                      : isCompleted
                      ? 'bg-primary-900 text-white ring-4 ring-primary-100'
                      : isCurrent
                      ? stage.id === 'SOLVED'
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-lg'
                        : 'bg-white border-2 border-primary-600 text-primary-700 ring-4 ring-primary-100 shadow-md'
                      : 'bg-white border-2 border-slate-300 text-slate-400'
                  }`}
                >
                  {isStageRejected ? (
                    '✕'
                  ) : isCompleted || (isCurrent && stage.id === 'SOLVED') ? (
                    '✓'
                  ) : (
                    stage.stepNum
                  )}
                </div>

                {/* Stage Title & Subtitle */}
                <div className="mt-3 space-y-0.5">
                  <div
                    className={`font-heading font-bold text-xs uppercase tracking-wider ${
                      isStageRejected
                        ? 'text-red-700'
                        : isCurrent
                        ? stage.id === 'SOLVED'
                          ? 'text-emerald-700'
                          : 'text-primary-800'
                        : isCompleted
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {isStageRejected ? 'Rejected' : stage.label}
                  </div>

                  <div className="text-[11px] text-slate-500 font-medium">
                    {stage.description}
                  </div>

                  {/* Stage Date (if recorded in history) */}
                  {dateStr && (
                    <div className="text-[10px] text-slate-400 font-mono pt-0.5">
                      {dateStr}
                    </div>
                  )}

                  {/* Current Active Badge */}
                  {isCurrent && !isStageRejected && stage.id !== 'SOLVED' && (
                    <span className="inline-block mt-1 px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-primary-50 text-primary-700 border border-primary-200 animate-pulse">
                      Active Stage
                    </span>
                  )}

                  {isCurrent && stage.id === 'SOLVED' && (
                    <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Completed 🎉
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Stepper (Vertical Flow) */}
      <div className="md:hidden space-y-4">
        {stages.map((stage, idx) => {
          const isCompleted = idx < effectiveIndex;
          const isCurrent = !isRejected && idx === effectiveIndex;
          const isStageRejected = isRejected && idx === 1;
          const dateStr = getStageDate(stage.id);

          return (
            <div key={stage.id} className="flex items-start gap-3.5 relative">
              {/* Vertical connector line */}
              {idx < stages.length - 1 && (
                <div
                  className={`absolute left-4 top-8 bottom-0 w-0.5 -ml-px ${
                    isCompleted ? 'bg-primary-600' : 'bg-slate-200'
                  }`}
                  style={{ height: 'calc(100% + 1rem)' }}
                />
              )}

              {/* Circle Indicator */}
              <div
                className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs z-10 ${
                  isStageRejected
                    ? 'bg-red-600 text-white ring-2 ring-red-100'
                    : isCompleted
                    ? 'bg-primary-900 text-white'
                    : isCurrent
                    ? stage.id === 'SOLVED'
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                      : 'bg-primary-600 text-white ring-4 ring-primary-100'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                {isStageRejected
                  ? '✕'
                  : isCompleted || (isCurrent && stage.id === 'SOLVED')
                    ? '✓'
                    : stage.stepNum}
              </div>

              {/* Stage Content */}
              <div className="flex-1 pb-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`font-heading font-bold text-xs uppercase tracking-wide ${
                      isStageRejected
                        ? 'text-red-700'
                        : isCurrent
                        ? 'text-primary-800'
                        : isCompleted
                        ? 'text-slate-900'
                        : 'text-slate-400'
                    }`}
                  >
                    {isStageRejected ? 'Stage 2: Validation Rejected' : stage.label}
                  </span>
                  {dateStr && (
                    <span className="text-[10px] text-slate-400 font-mono">{dateStr}</span>
                  )}
                </div>

                <p className="text-xs text-slate-500 mt-0.5">{stage.shortDesc}</p>

                {isCurrent && !isStageRejected && (
                  <span className="inline-block mt-1 px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-primary-100 text-primary-700">
                    {stage.id === 'SOLVED' ? 'Completed' : 'Current Milestone'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
