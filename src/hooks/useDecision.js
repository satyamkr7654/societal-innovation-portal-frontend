import { useState } from 'react';

/** Runs one action at a time, reporting which is running and why one failed. */
export function useDecision(onSaved) {
  const [error, setError] = useState('');
  const [pending, setPending] = useState(null);

  const decide = async (name, action) => {
    setError('');
    setPending(name);
    try {
      const result = await action();
      setPending(null);
      onSaved(result);
    } catch (err) {
      setPending(null);
      setError(err.message);
    }
  };
  return { error, setError, pending, decide };
}
