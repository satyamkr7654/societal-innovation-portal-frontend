import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * AuthContext - Global Authentication and Stakeholder Role State
 * Provides central access to user profile, JWT token, login, and logout.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage on application load
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Mock Login Function
   * Swapped with real Axios API call in Phase F8 without altering consuming components.
   */
  const login = async ({ email, role: explicitRole }) => {
    // Determine role (either passed explicitly or deduced from email)
    let role = explicitRole || 'citizen';
    if (!explicitRole) {
      if (email.includes('admin') || email.includes('gov.in')) {
        role = 'admin';
      } else if (email.includes('bit') || email.includes('univ') || email.includes('.ac.in')) {
        role = 'university';
      } else if (email.includes('tata') || email.includes('csr') || email.includes('industry')) {
        role = 'industry';
      }
    }

    const mockToken = `mock_jwt_token_for_${role}_sih26043`;
    const mockUser = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email,
      role,
      organizationName:
        role === 'university'
          ? 'BIT Mesra R&D Cell'
          : role === 'industry'
          ? 'Tata Steel Foundation'
          : role === 'admin'
          ? 'Govt. Higher Education Dept'
          : 'Resident Citizen',
    };

    // Persist in localStorage
    localStorage.setItem('auth_token', mockToken);
    localStorage.setItem('auth_user', JSON.stringify(mockUser));

    // Update global state
    setToken(mockToken);
    setUser(mockUser);

    return { user: mockUser, token: mockToken };
  };

  /**
   * Logout Function
   * Clears session storage and resets state.
   */
  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    role: user?.role || null,
    isAuthenticated: Boolean(token && user),
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to consume AuthContext cleanly in any component
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
