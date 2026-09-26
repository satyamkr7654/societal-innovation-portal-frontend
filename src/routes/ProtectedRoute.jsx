import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';

/**
 * ProtectedRoute - Route Guard Component
 * 1. Checks if the user is authenticated (redirects to /login if not).
 * 2. Checks if the user's role matches the allowedRoles for that route.
 *    If unauthorized for that specific role, redirects them safely to their own authorized dashboard.
 */
export default function ProtectedRoute({ allowedRoles = [] }) {
  const { isAuthenticated, role, isLoading } = useAuth();
  const location = useLocation();

  // 1. Initial local storage hydration check
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
        <Spinner size="lg" className="text-primary" />
        <span className="text-xs font-semibold text-slate-500 font-sans tracking-wide">
          Verifying security credentials...
        </span>
      </div>
    );
  }

  // 2. Unauthenticated check
  if (!isAuthenticated) {
    // Preserve the intended location so user can be sent back after logging in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Role authorization check
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // User is logged in, but lacks permission for this specific sector.
    // Redirect them to their own authorized role dashboard.
    const fallbackPath = `/${role || 'citizen'}/dashboard`;
    return <Navigate to={fallbackPath} replace />;
  }

  // 4. Authorized: render nested child routes
  return <Outlet />;
}
