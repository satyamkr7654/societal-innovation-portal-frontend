import { formatRupees } from './money';

export const PLEDGE_TYPES = {
  FUNDING: 'Funding',
  EQUIPMENT: 'Equipment',
  MENTORSHIP: 'Mentorship',
};

export const PLEDGE_STATUS = {
  PENDING: 'Waiting for the university',
  ACCEPTED: 'Accepted',
  DECLINED: 'Declined',
  WITHDRAWN: 'Withdrawn',
};

/** "Funding of ₹50,000" or "Equipment" */
export const describePledge = ({ type, amount }) =>
  amount ? `${PLEDGE_TYPES[type]} of ${formatRupees(amount)}` : PLEDGE_TYPES[type];

/** The first problem with an offer, or null. The server repeats these checks. */
export function pledgeError({ type, amount, description }, remaining) {
  if (!description) return 'Please describe the support.';
  if (type !== 'FUNDING') return null;
  if (!Number.isInteger(amount) || amount < 1) {
    return 'Amount must be a whole number of rupees.';
  }
  if (amount > remaining) return `Only ${formatRupees(remaining)} is still needed.`;
  return null;
}
