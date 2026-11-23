/** Single source of truth for the problem lifecycle: order, wording and colours. */

export const WORKFLOW_STAGES = [
  'SUBMITTED',
  'VALIDATED',
  'ASSIGNED',
  'IN_PROGRESS',
  'SOLVED',
];

export const ALL_STATUSES = [...WORKFLOW_STAGES, 'REJECTED'];

// Class names are written in full so Tailwind can find them
export const STATUS_CONFIG = {
  SUBMITTED: {
    display: 'Submitted',
    order: 1,
    stepTitle: 'Lodge & Register',
    stepDescription: 'Problem registered with location details',
    bgColor: 'bg-status-submitted-bg',
    textColor: 'text-status-submitted-text',
    borderColor: 'border-status-submitted-border',
    dotColor: 'bg-slate-400',
  },
  VALIDATED: {
    display: 'Validated',
    order: 2,
    stepTitle: 'Nodal Verification',
    stepDescription: 'Govt admin confirms authenticity',
    bgColor: 'bg-status-validated-bg',
    textColor: 'text-status-validated-text',
    borderColor: 'border-status-validated-border',
    dotColor: 'bg-blue-500',
  },
  ASSIGNED: {
    display: 'Assigned',
    order: 3,
    stepTitle: 'University Allocation',
    stepDescription: 'Faculty & student lab assigned',
    bgColor: 'bg-status-assigned-bg',
    textColor: 'text-status-assigned-text',
    borderColor: 'border-status-assigned-border',
    dotColor: 'bg-purple-500',
  },
  IN_PROGRESS: {
    display: 'In Progress',
    order: 4,
    stepTitle: 'R&D / Prototyping',
    stepDescription: 'Engineering solution formulated',
    bgColor: 'bg-status-progress-bg',
    textColor: 'text-status-progress-text',
    borderColor: 'border-status-progress-border',
    dotColor: 'bg-amber-500',
  },
  SOLVED: {
    display: 'Solved',
    order: 5,
    stepTitle: 'On-Ground Deployed',
    stepDescription: 'Civic solution deployed & verified',
    bgColor: 'bg-status-solved-bg',
    textColor: 'text-status-solved-text',
    borderColor: 'border-status-solved-border',
    dotColor: 'bg-emerald-500',
  },
  REJECTED: {
    display: 'Rejected',
    order: -1,
    stepTitle: 'Validation Rejected',
    stepDescription: 'Rejected with a documented reason',
    bgColor: 'bg-status-rejected-bg',
    textColor: 'text-status-rejected-text',
    borderColor: 'border-status-rejected-border',
    dotColor: 'bg-red-500',
  },
};

const ALIASES = { PROGRESS: 'IN_PROGRESS', INPROGRESS: 'IN_PROGRESS' };

/** Accepts any casing, spaces or hyphens. Unknown values become SUBMITTED. */
export function normalizeStatus(status) {
  const key = String(status)
    .toUpperCase()
    .replace(/[\s-]+/g, '_');
  const resolved = ALIASES[key] || key;
  return Object.hasOwn(STATUS_CONFIG, resolved) ? resolved : 'SUBMITTED';
}

export const getStatusConfig = (status) => STATUS_CONFIG[normalizeStatus(status)];
