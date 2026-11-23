import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from './Sidebar';

/**
 * DashboardLayout - Shell for authenticated role dashboards
 * Connected directly to central AuthContext: uses user.role automatically.
 */
export default function DashboardLayout() {
  const { user, role, logout } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();

  // Page titles based on route
  const getPageTitle = (pathname) => {
    if (pathname.includes('/citizen/dashboard')) return 'Citizen Dashboard';
    if (pathname.includes('/citizen/submit')) return 'Report Problem';
    if (pathname.includes('/citizen/problems')) return 'My Problems';
    if (pathname.includes('/admin/dashboard')) return 'Admin Overview';
    if (pathname.includes('/admin/review')) return 'Review Problems';
    if (pathname.includes('/university/dashboard')) return 'University R&D';
    if (pathname.includes('/university/assignments')) return 'Assigned Problems';
    if (pathname.includes('/university/proposals')) return 'Proposals & Milestones';
    if (pathname.includes('/industry/dashboard')) return 'CSR Dashboard';
    if (pathname.includes('/industry/proposals')) return 'Browse Proposals';
    if (pathname.includes('/notifications')) return 'Notifications';
    return 'Portal';
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans antialiased text-slate-800 flex overflow-x-hidden">
      {/* Role-Aware Sidebar */}
      <Sidebar
        role={role}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0 w-full">
        {/* Top Mini-Header */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-slate-200/90 h-16 flex items-center justify-between px-3 sm:px-6 lg:px-8 shadow-xs gap-2">
          {/* Left: Mobile Drawer Toggle + Page Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-1.5 sm:p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none shrink-0 cursor-pointer"
              aria-label="Open sidebar menu"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div className="min-w-0">
              <h1 className="font-heading font-bold text-slate-900 text-xs sm:text-base lg:text-lg leading-tight truncate">
                {getPageTitle(location.pathname)}
              </h1>
              <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium hidden sm:block truncate">
                Govt. of Jharkhand • SIH26043
              </div>
            </div>
          </div>

          {/* Right: Bell + Avatar + Logout */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Notification Bell */}
            <Link
              to="/notifications"
              className="relative p-1.5 sm:p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition"
              aria-label="Notifications"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute top-1 sm:top-1.5 right-1 sm:right-1.5 w-2 h-2 bg-accent rounded-full ring-2 ring-white"></span>
            </Link>

            {/* User Profile Avatar */}
            <div className="flex items-center gap-2 pl-1.5 sm:pl-2 border-l border-slate-200">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
                {user?.name ? user.name.slice(0, 2) : 'US'}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[120px]">
                  {user?.name || 'Demo User'}
                </div>
                <div className="text-[10px] text-slate-500 capitalize">{role}</div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
              title="Sign Out"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </header>

        {/* Dynamic Nested Content Area */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
