import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * PublicLayout - Outer frame for all public and authentication pages
 * Hardened with overflow-x-hidden and mobile-adaptive padding.
 */
export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased overflow-x-hidden selection:bg-accent-light selection:text-slate-900">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main Dynamic Content Area (Injected via <Outlet />) */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <Outlet />
      </main>

      {/* Bottom Civic Footer */}
      <Footer />
    </div>
  );
}
