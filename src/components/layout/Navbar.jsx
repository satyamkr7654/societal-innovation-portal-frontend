import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Button from '../ui/Button';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'How It Works', path: '/#how-it-works' },
    { label: 'Public Problems', path: '/#problems' },
    { label: 'Design Tokens', path: '/design-system' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand Logo & Name (Protected against text-overflow on small devices) */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group min-w-0">
            {/* Civic Emblem Badge */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary shrink-0 flex items-center justify-center text-white shadow-xs border border-primary-light">
              <span className="font-heading font-black text-xs sm:text-sm tracking-wider text-accent-light">
                JH
              </span>
            </div>
            <div className="min-w-0">
              <div className="font-heading font-bold text-slate-900 text-xs sm:text-base leading-tight group-hover:text-primary transition truncate">
                Societal Innovation Portal
              </div>
              <div className="text-[10px] sm:text-[11px] font-sans font-medium text-slate-500 uppercase tracking-wider truncate">
                Govt. of Jharkhand • SIH26043
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 shrink-0">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.path}
                className={({ isActive }) => `
                  px-3 py-2 rounded text-xs font-semibold tracking-wide transition duration-150
                  ${isActive && link.path === '/' 
                    ? 'text-primary bg-slate-100/80 font-bold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}
                `}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Auth Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            <Link to="/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm">
                Citizen Register
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="flex md:hidden shrink-0">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Collapsible Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-primary transition"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
              <Button variant="outline" size="md" className="w-full justify-center">
                Sign In
              </Button>
            </Link>
            <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
              <Button variant="primary" size="md" className="w-full justify-center">
                Citizen Register
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
