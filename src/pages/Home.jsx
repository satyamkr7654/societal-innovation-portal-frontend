import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function Home() {
  const { role } = useAuth();
  const primaryAction =
    !role
      ? { to: '/register', label: 'Report a Problem' }
      : role === 'citizen'
        ? { to: '/citizen/submit', label: 'Report a Problem' }
        : { to: `/${role}/dashboard`, label: 'Go to Dashboard' };

  const steps = [
    {
      role: '1. CITIZEN',
      title: 'Report Local Problem',
      desc: 'Submit civic issues regarding water, sanitation, health, or roads with geo-location and photo evidence.',
      badge: 'submitted',
    },
    {
      role: '2. GOVT ADMIN',
      title: 'Validate & Assign',
      desc: 'Government officials verify authenticity and assign verified problems to accredited university R&D cells.',
      badge: 'assigned',
    },
    {
      role: '3. UNIVERSITY',
      title: 'Innovate & Build',
      desc: 'Faculty & student engineering teams formulate actionable technical proposals, budgets, and milestone roadmaps.',
      badge: 'progress',
    },
    {
      role: '4. INDUSTRY',
      title: 'CSR Funding & Support',
      desc: 'Corporate and startup partners discover vetted proposals and provide financial sponsorship, material, or mentorship.',
      badge: 'solved',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Civic Hero Section */}
      <section className="bg-primary rounded-2xl p-8 sm:p-12 text-white shadow-lg border border-primary-light relative overflow-hidden">
        {/* Subtle background emblem accent */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-96 h-96 bg-primary-light/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 bg-accent/20 text-accent-light text-xs font-semibold rounded-full border border-accent/30 tracking-wider uppercase">
              SIH 2026 • SIH26043
            </span>
            <span className="text-xs font-medium text-slate-300">
              Department of Higher & Technical Education, Govt. of Jharkhand
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight leading-tight">
            Connecting Citizens, Universities & Industries for Civic Innovation.
          </h1>

          <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-2xl font-sans">
            A collaborative platform where local societal problems are reported by citizens, engineered by university students and faculty, supported by industry CSR, and monitored transparently by government officers.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link to={primaryAction.to}>
              <Button variant="accent" size="lg">
                {primaryAction.label}
              </Button>
            </Link>
            {!role && (
              <Link to="/login">
                <Button variant="outline" size="lg" className="border-slate-400 text-white hover:bg-white/10 hover:text-white">
                  Stakeholder Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* 4-Pillar Collaborative Architecture */}
      <section className="space-y-6 scroll-mt-20" id="how-it-works">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold font-mono uppercase tracking-wider text-accent-dark">
            Collaborative Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 tracking-tight">
            How Societal Problems Get Solved
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            End-to-end lifecycle tracked in real-time from citizen submission to university implementation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <Card key={idx} hover={true} className="flex flex-col justify-between h-full">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-slate-400">
                    {s.role}
                  </span>
                  <Badge status={s.badge} size="sm" />
                </div>
                <h3 className="font-heading font-bold text-slate-900 text-base">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {s.desc}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
