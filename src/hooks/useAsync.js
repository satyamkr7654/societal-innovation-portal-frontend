import { useCallback, useEffect, useState } from 'react';

/**
 * Runs an async loader and tracks its state. The loader must be stable: a module-level
 * function, or one wrapped in useCallback.
 */
export function useAsync(loader) {
  const [state, setState] = useState({ data: null, error: null, isLoading: true });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let isActive = true; // ignore results that arrive after unmount or a newer request
    loader().then(
      (data) => isActive && setState({ data, error: null, isLoading: false }),
      (error) => isActive && setState({ data: null, error, isLoading: false })
    );
    return () => {
      isActive = false;
    };
  }, [loader, attempt]);

  const reload = useCallback(() => {
    setState({ data: null, error: null, isLoading: true });
    setAttempt((n) => n + 1);
  }, []);

  const setData = useCallback((data) => {
    setState({ data, error: null, isLoading: false });
  }, []);

  return { ...state, reload, setData };
}
