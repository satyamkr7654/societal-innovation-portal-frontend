import React, { useCallback, useEffect, useState } from 'react';
import LoadState from '../components/ui/LoadState';
import { useAsync } from '../hooks/useAsync';
import { setUnauthorizedHandler } from '../services/apiClient';
import * as authService from '../services/authService';
import { AuthContext } from './AuthContextValue';

/** Provides the current user plus login, register and logout. */
export function AuthProvider({ children }) {
  const {
    data: user,
    error,
    isLoading,
    reload,
    setData: setUser,
  } = useAsync(authService.restoreSession);
  // Lets the login page tell "you signed out" apart from "you need to sign in"
  const [justLoggedOut, setJustLoggedOut] = useState(false);

  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null)); // the session expired
    return () => setUnauthorizedHandler(() => {});
  }, [setUser]);

  const login = useCallback(
    async (credentials) => {
      const signedIn = await authService.login(credentials);
      setJustLoggedOut(false);
      setUser(signedIn);
      return signedIn;
    },
    [setUser]
  );

  const logout = useCallback(async () => {
    await authService.logout();
    setJustLoggedOut(true);
    setUser(null);
  }, [setUser]);

  // Server unreachable: do not pretend the user is signed out
  if (error) return <LoadState error={error} onRetry={reload} />;

  const value = {
    user,
    role: user?.role || null,
    isAuthenticated: Boolean(user),
    isLoading,
    justLoggedOut,
    login,
    register: authService.register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
