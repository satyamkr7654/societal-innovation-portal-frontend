const rupees = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

/** 250000 -> ₹2,50,000 */
export const formatRupees = (amount) => rupees.format(amount);
