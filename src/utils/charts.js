/** Validated pair: distinguishable with colour-vision deficiency, 3:1 on white. */
export const CHART_COLORS = { primary: '#2a78d6', secondary: '#d97706' };

/** Clean axis steps from 0 to at least `max`, in whole numbers. */
export function axisTicks(max) {
  const top = Math.max(1, max);
  const rough = top / 4;
  const power = 10 ** Math.floor(Math.log10(Math.max(1, rough)));
  const step = Math.max(
    1,
    [1, 2, 5, 10].map((m) => m * power).find((s) => s >= rough)
  );
  const ticks = [];
  for (let value = 0; value < top + step; value += step) ticks.push(value);
  return ticks;
}

/** "2026-09" -> "Sep 2026" */
export function monthLabel(month, options = { month: 'short', year: 'numeric' }) {
  const [year, number] = month.split('-').map(Number);
  return new Date(year, number - 1, 1).toLocaleDateString('en-IN', options);
}
