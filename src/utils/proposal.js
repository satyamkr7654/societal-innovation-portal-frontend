const MAX_AMOUNT = 100_000_000;

/** The first problem with a proposal, or null. The server repeats these checks. */
export function proposalError({ summary, approach, durationWeeks, items }) {
  if (summary.length < 50) return 'Summary must be at least 50 characters.';
  if (approach.length < 50) return 'Technical approach must be at least 50 characters.';
  if (!Number.isInteger(durationWeeks) || durationWeeks < 1 || durationWeeks > 104) {
    return 'Duration must be 1 to 104 weeks.';
  }
  if (items.some((item) => !item.label)) return 'Every budget item needs a name.';
  const badAmount = ({ amount }) =>
    !Number.isInteger(amount) || amount < 1 || amount > MAX_AMOUNT;
  if (items.some(badAmount)) {
    return 'Every amount must be a whole number from ₹1 to ₹10 crore.';
  }
  return null;
}

export const PROPOSAL_STATUS = {
  SUBMITTED: 'Waiting for admin review',
  CHANGES_REQUESTED: 'Changes requested',
  APPROVED: 'Approved',
};
