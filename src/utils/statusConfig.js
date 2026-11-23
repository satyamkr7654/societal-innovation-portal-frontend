/**
 * statusConfig.js
 * Single source of truth for problem lifecycle workflow in SIH26043.
 * Defines workflow ordering, display labels, design token badges, and descriptions.
 */

export const WORKFLOW_STAGES = [
  'SUBMITTED',
  'VALIDATED',
  'ASSIGNED',
  'IN_PROGRESS',
  'SOLVED',
];

export const STATUS_CONFIG = {
  SUBMITTED: {
    key: 'submitted',
    label: 'SUBMITTED',
    display: 'Submitted',
    order: 1,
    badgeStatus: 'submitted',
    desc: 'Reported by citizen, awaiting verification by district officer',
    colorHex: '#475569',
    bgColor: 'bg-status-submitted-bg',
    textColor: 'text-status-submitted-text',
    borderColor: 'border-status-submitted-border',
  },
  VALIDATED: {
    key: 'validated',
    label: 'VALIDATED',
    display: 'Validated',
    order: 2,
    badgeStatus: 'validated',
    desc: 'Verified by government admin as legitimate and eligible for innovation',
    colorHex: '#1d4ed8',
    bgColor: 'bg-status-validated-bg',
    textColor: 'text-status-validated-text',
    borderColor: 'border-status-validated-border',
  },
  ASSIGNED: {
    key: 'assigned',
    label: 'ASSIGNED',
    display: 'Assigned',
    order: 3,
    badgeStatus: 'assigned',
    desc: 'Assigned to university faculty and student innovation teams',
    colorHex: '#7e22ce',
    bgColor: 'bg-status-assigned-bg',
    textColor: 'text-status-assigned-text',
    borderColor: 'border-status-assigned-border',
  },
  IN_PROGRESS: {
    key: 'progress',
    label: 'IN PROGRESS',
    display: 'In Progress',
    order: 4,
    badgeStatus: 'progress',
    desc: 'University engineering team formulating prototypes and executing milestones',
    colorHex: '#b45309',
    bgColor: 'bg-status-progress-bg',
    textColor: 'text-status-progress-text',
    borderColor: 'border-status-progress-border',
  },
  SOLVED: {
    key: 'solved',
    label: 'SOLVED',
    display: 'Solved',
    order: 5,
    badgeStatus: 'solved',
    desc: 'Field testing successful, solution deployed and verified on-site',
    colorHex: '#047857',
    bgColor: 'bg-status-solved-bg',
    textColor: 'text-status-solved-text',
    borderColor: 'border-status-solved-border',
  },
  REJECTED: {
    key: 'rejected',
    label: 'REJECTED',
    display: 'Rejected',
    order: -1,
    badgeStatus: 'rejected',
    desc: 'Rejected by nodal administration with mandatory documented justification',
    colorHex: '#b91c1c',
    bgColor: 'bg-status-rejected-bg',
    textColor: 'text-status-rejected-text',
    borderColor: 'border-status-rejected-border',
  },
};

/**
 * Normalizes any status input (case-insensitive, handles hyphens/underscores)
 */
export function getStatusConfig(status = 'SUBMITTED') {
  const normalized = String(status).toUpperCase().replace(/[\s-]+/g, '_');
  return STATUS_CONFIG[normalized] || STATUS_CONFIG.SUBMITTED;
}
