/** Civic categories; `code` is used in case IDs. */
export const CIVIC_CATEGORIES = [
  { id: 'Water', code: 'WTR', label: 'Water Contamination & Supply', icon: '💧' },
  { id: 'Sanitation', code: 'SAN', label: 'Drainage & Waste Sanitation', icon: '🧹' },
  { id: 'Health', code: 'HLT', label: 'Healthcare & Medical Access', icon: '🏥' },
  { id: 'Agriculture', code: 'AGR', label: 'Irrigation & Farming Support', icon: '🌾' },
  { id: 'Education', code: 'EDU', label: 'School & Technical Education', icon: '📚' },
  { id: 'Infrastructure', code: 'INF', label: 'Roads, Bridges & Transport', icon: '🛣️' },
  {
    id: 'Environment',
    code: 'ENV',
    label: 'Air, River & Forest Conservation',
    icon: '🌲',
  },
  { id: 'Energy', code: 'NRG', label: 'Rural Solar & Power Supply', icon: '⚡' },
];

export const getCategory = (id) => CIVIC_CATEGORIES.find((c) => c.id === id);
