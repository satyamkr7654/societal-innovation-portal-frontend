import React, { useEffect, useState } from 'react';
import * as authService from '../services/authService';
import { AuthContext } from './AuthContextValue';

/** Provides the current user plus login, register and logout. */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // Lets the login page tell "you signed out" apart from "you need to sign in"
  const [justLoggedOut, setJustLoggedOut] = useState(false);

  useEffect(() => {
    let isActive = true;
    authService
      .restoreSession()
      .catch(() => null)
      .then((restored) => {
        if (!isActive) return;
        setUser(restored);
        setIsLoading(false);
      });
    return () => {
      isActive = false;
    };
  }, []);

  const login = async (credentials) => {
    const signedIn = await authService.login(credentials);
    setJustLoggedOut(false);
    setUser(signedIn);
    return signedIn;
  };

  const logout = async () => {
    await authService.logout();
    setJustLoggedOut(true);
    setUser(null);
  };

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
