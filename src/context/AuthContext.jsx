import React, { createContext, useContext, useState } from 'react';
import { getSessionUser, registerAccount, signIn, signOut } from '../utils/mockAuth';

const AuthContext = createContext(null);

/**
 * AuthProvider - current user plus login, register and logout.
 * Backed by the browser-only demo store until the Phase 4 backend replaces it.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSessionUser);
  // Lets the login page tell "you signed out" apart from "you need to sign in"
  const [justLoggedOut, setJustLoggedOut] = useState(false);

  const login = async (credentials) => {
    const signedIn = await signIn(credentials);
    setJustLoggedOut(false);
    setUser(signedIn);
    return signedIn;
  };

  const logout = () => {
    signOut();
    setJustLoggedOut(true);
    setUser(null);
  };

  const value = {
    user,
    role: user?.role || null,
    isAuthenticated: Boolean(user),
    justLoggedOut,
    login,
    register: registerAccount,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
