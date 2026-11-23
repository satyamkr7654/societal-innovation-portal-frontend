import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import LoadState from '../components/ui/LoadState';
import { useAuth } from '../hooks/useAuth';

/**
 * ProtectedRoute - requires a signed-in user and, optionally, one of allowedRoles.
 * A user with the wrong role is sent to their own dashboard.
 */
export default function ProtectedRoute({ allowedRoles = [] }) {
  const { isAuthenticated, role, isLoading, justLoggedOut } = useAuth();
  const location = useLocation();

  if (isLoading) return <LoadState />;

  if (!isAuthenticated) {
    return (
      <Navigate to="/login" state={justLoggedOut ? null : { from: location }} replace />
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to={`/${role}/dashboard`} replace />;
  }

  return <Outlet />;
}
