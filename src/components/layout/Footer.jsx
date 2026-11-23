import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto font-sans">
      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Portal Identity */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-primary flex items-center justify-center text-white font-heading font-black text-xs">
                JH
              </div>
              <span className="font-heading font-bold text-slate-900 text-base">
                Societal Innovation Portal
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              Smart India Hackathon 2026 Problem Statement SIH26043. Connecting Citizens,
              Universities, and Industry partners to resolve local societal challenges in
              Jharkhand.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded text-[11px] font-semibold text-slate-700 border border-slate-200">
              Academic prototype
            </div>
          </div>

          {/* Column 2: Stakeholder Portals */}
          <div>
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-800 mb-3">
              Stakeholders
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/login" className="hover:text-primary transition">
                  Citizen Reporting Portal
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary transition">
                  University R&D Cell
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary transition">
                  Industry / CSR Partners
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary transition">
                  Administration Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links & Transparency */}
          <div>
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-800 mb-3">
              Governance & Info
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/#how-it-works" className="hover:text-primary transition">
                  Workflow Guidelines
                </Link>
              </li>
              <li>
                <Link to="/problems" className="hover:text-primary transition">
                  Public Problems
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Sub-footer Bar */}
      <div className="border-t border-slate-100 bg-slate-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>
            Student project for demonstration. Not an official government website and not
            affiliated with the Government of Jharkhand.
          </p>
          <p className="flex items-center gap-2 shrink-0">
            <span>Built for SIH 2026</span>
            <span>•</span>
            <span className="font-mono text-[11px] text-slate-400">SIH26043</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
