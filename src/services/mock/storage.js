/** Safe localStorage helpers for the demo data layer. */

export function readJson(key, isValid, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const value = JSON.parse(raw);
    return isValid(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

/** Throws an Error with a user-friendly message when the browser refuses the write. */
export function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    throw new Error(
      'Your browser could not save this data. Its storage may be full or blocked.'
    );
  }
}

export function removeKey(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Nothing to remove when storage is unavailable
  }
}
