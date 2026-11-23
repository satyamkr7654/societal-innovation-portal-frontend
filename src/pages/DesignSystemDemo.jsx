import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';

export default function DesignSystemDemo() {
  const [btnLoading, setBtnLoading] = useState(false);

  const typographyExamples = [
    {
      tag: 'h1',
      name: 'Heading 1',
      classes:
        'text-3xl lg:text-4xl font-heading font-bold text-slate-900 tracking-tight',
      sample: 'Civic Innovation & Problem Resolution Portal',
    },
    {
      tag: 'h2',
      name: 'Heading 2',
      classes: 'text-2xl font-heading font-bold text-slate-800 tracking-tight',
      sample: 'Assigned Problems & University Action Items',
    },
    {
      tag: 'h3',
      name: 'Heading 3',
      classes: 'text-xl font-heading font-semibold text-slate-800',
      sample: 'Project Milestone 2: Hardware Prototype Deployment',
    },
    {
      tag: 'h4',
      name: 'Heading 4',
      classes: 'text-lg font-heading font-semibold text-slate-700',
      sample: 'Funding Support Received from Tata Steel CSR',
    },
    {
      tag: 'p',
      name: 'Body Text',
      classes: 'text-base font-sans text-slate-600 leading-relaxed',
      sample:
        'Citizens can report local infrastructural issues like water contamination or broken roads with geolocation markers.',
    },
    {
      tag: 'p',
      name: 'Body Small',
      classes: 'text-sm font-sans text-slate-500',
      sample:
        'Last updated 2 hours ago by Department of Higher & Technical Education, Jharkhand.',
    },
    {
      tag: 'span',
      name: 'Caption / Meta',
      classes: 'text-xs font-sans font-semibold text-slate-400 tracking-wider uppercase',
      sample: 'REF ID: JH-2026-WTR-0492 • WARD 14 RANCHI',
    },
  ];

  const radii = [
    { name: 'sm (4px)', class: 'rounded-sm', usage: 'Badges, small status chips' },
    {
      name: 'DEFAULT (6px)',
      class: 'rounded',
      usage: 'Buttons, input fields, dropdowns',
    },
    {
      name: 'md (8px)',
      class: 'rounded-md',
      usage: 'Interactive card items, dialog boxes',
    },
    {
      name: 'lg (12px)',
      class: 'rounded-lg',
      usage: 'Primary content cards, stats containers',
    },
    { name: 'xl (16px)', class: 'rounded-xl', usage: 'Modal overlays, prominent panels' },
    {
      name: 'full (Pill)',
      class: 'rounded-full',
      usage: 'Status tags, user avatar rings',
    },
  ];

  const shadows = [
    {
      name: 'sm',
      class: 'shadow-sm',
      desc: 'Subtle boundary for flat cards on light grey backdrops',
    },
    {
      name: 'card',
      class: 'shadow-card',
      desc: 'Default card elevation for tables and metrics',
    },
    {
      name: 'lg',
      class: 'shadow-lg',
      desc: 'Dropdown menus, popovers, floating headers',
    },
    {
      name: 'card-hover',
      class: 'shadow-card-hover hover:-translate-y-0.5 transition duration-200',
      desc: 'Hover lift for clickable action cards',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Top Header Banner */}
        <header className="bg-primary rounded-xl p-8 text-white shadow-lg border border-primary-light">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="inline-block px-3 py-1 bg-accent/20 text-accent-light text-xs font-semibold rounded-full border border-accent/30 tracking-wider uppercase mb-3">
                Design System v1.0 • SIH26043
              </span>
              <h1 className="text-3xl font-heading font-extrabold tracking-tight">
                Civic-Tech Design System & Component Library
              </h1>
              <p className="text-slate-300 text-sm mt-2 max-w-2xl">
                Official UI foundation & reusable components for the Societal Innovation
                Collaboration Portal. Strictly built on design tokens — no ad-hoc hex
                colors.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <span className="px-3.5 py-2 bg-primary-dark/80 text-xs rounded border border-slate-700 font-mono text-slate-300">
                Heading: Plus Jakarta Sans
              </span>
              <span className="px-3.5 py-2 bg-primary-dark/80 text-xs rounded border border-slate-700 font-mono text-slate-300">
                Body: Inter
              </span>
            </div>
          </div>
        </header>

        {/* 🌟 1. REUSABLE UI COMPONENTS SECTION (Task F0.5) */}
        <section className="bg-white rounded-xl shadow-card border border-slate-200/80 p-8 space-y-8">
          <div className="border-b border-slate-100 pb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-heading font-bold text-slate-900">
                1. Reusable UI Components (
                <code className="text-sm font-mono text-primary">components/ui/</code>)
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Atomic components built using only design tokens:{' '}
                <code className="font-mono text-xs">Button</code>,{' '}
                <code className="font-mono text-xs">Badge</code>,{' '}
                <code className="font-mono text-xs">Card</code>,{' '}
                <code className="font-mono text-xs">Spinner</code>.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBtnLoading(!btnLoading)}
            >
              Toggle Loading State: {btnLoading ? 'ON' : 'OFF'}
            </Button>
          </div>

          {/* (a) Button Variants & Sizes */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Button Variants, Sizes & States
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" size="md" isLoading={btnLoading}>
                Primary Button
              </Button>
              <Button variant="secondary" size="md">
                Secondary Button
              </Button>
              <Button variant="outline" size="md">
                Outline Button
              </Button>
              <Button variant="danger" size="md">
                Reject / Danger
              </Button>
              <Button variant="primary" size="sm">
                Small (sm)
              </Button>
              <Button variant="primary" size="lg">
                Large (lg)
              </Button>
              <Button variant="primary" size="md" disabled>
                Disabled
              </Button>
            </div>
          </div>

          {/* (b) Badge Component with Civic Statuses */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Badge Component (Status Lifecycle)
            </h3>
            <div className="flex flex-wrap gap-3">
              <Badge status="submitted" />
              <Badge status="validated" />
              <Badge status="assigned" />
              <Badge status="progress" />
              <Badge status="solved" />
              <Badge status="rejected" />
              <Badge status="solved" size="sm">
                Small Solved
              </Badge>
            </div>
          </div>

          {/* (c) Card Component & Spinner */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Card Component & Spinners
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Standard with Header/Footer */}
              <Card
                header={
                  <h4 className="font-heading font-semibold text-slate-800 text-sm">
                    Standard Card with Header
                  </h4>
                }
                footer={<span className="text-xs text-slate-500">Footer action bar</span>}
              >
                <p className="text-sm text-slate-600">
                  Standard container wrapping problem descriptions, metrics, or details
                  with structured header/footer slots.
                </p>
              </Card>

              {/* Card 2: Interactive Hover Card */}
              <Card hover={true}>
                <div className="flex items-center justify-between mb-3">
                  <Badge status="progress" size="sm" />
                  <span className="text-xs font-mono text-slate-400">#JH-4012</span>
                </div>
                <h4 className="font-heading font-semibold text-slate-800 text-base mb-1">
                  Solar Micro-Grid for Rural Clinic
                </h4>
                <p className="text-xs text-slate-500 mb-4">
                  Interactive card demonstrating elevation and hover animation (
                  <code className="font-mono">hover=&#123;true&#125;</code>).
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <span className="text-slate-500 font-medium">BIT Mesra Team</span>
                  <span className="text-primary font-semibold">View Details &rarr;</span>
                </div>
              </Card>

              {/* Card 3: Spinner Showcase */}
              <Card>
                <h4 className="font-heading font-semibold text-slate-800 text-sm mb-3">
                  Spinner Sizes & Tints
                </h4>
                <div className="flex items-center justify-around py-4">
                  <div className="text-center">
                    <Spinner size="sm" className="text-primary" />
                    <span className="block text-[11px] text-slate-400 font-mono mt-2">
                      sm
                    </span>
                  </div>
                  <div className="text-center">
                    <Spinner size="md" className="text-accent" />
                    <span className="block text-[11px] text-slate-400 font-mono mt-2">
                      md
                    </span>
                  </div>
                  <div className="text-center">
                    <Spinner size="lg" className="text-emerald-600" />
                    <span className="block text-[11px] text-slate-400 font-mono mt-2">
                      lg
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* 2. Typography Scale */}
        <section className="bg-white rounded-xl shadow-card border border-slate-200/80 p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-heading font-bold text-slate-900">
              2. Typography Scale
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Strict visual hierarchy using{' '}
              <span className="font-semibold text-slate-700">Plus Jakarta Sans</span> for
              titles and <span className="font-semibold text-slate-700">Inter</span> for
              body text.
            </p>
          </div>

          <div className="space-y-6 divide-y divide-slate-100">
            {typographyExamples.map((item, index) => (
              <div
                key={index}
                className="pt-4 first:pt-0 flex flex-col md:flex-row md:items-baseline justify-between gap-4"
              >
                <div className="w-48 shrink-0">
                  <span className="text-xs font-mono font-semibold text-primary uppercase bg-slate-100 px-2 py-0.5 rounded">
                    {item.name} ({item.tag})
                  </span>
                  <div
                    className="text-[11px] font-mono text-slate-400 mt-1 truncate"
                    title={item.classes}
                  >
                    {item.classes}
                  </div>
                </div>
                <div className="flex-1">
                  <div className={item.classes}>{item.sample}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Color Tokens */}
        <section className="bg-white rounded-xl shadow-card border border-slate-200/80 p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-heading font-bold text-slate-900">
              3. Brand & Semantic Color Tokens
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Curated civic palette: Primary Navy Blue for official trust, Saffron Amber
              used sparingly for calls to action.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-slate-200 rounded-lg p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Primary (Navy Blue)
              </h3>
              <div className="space-y-2">
                <div className="h-12 bg-primary rounded flex items-center justify-between px-3 text-white text-xs font-mono">
                  <span>bg-primary</span>
                  <span>#0f2744</span>
                </div>
                <div className="h-10 bg-primary-light rounded flex items-center justify-between px-3 text-white text-xs font-mono">
                  <span>bg-primary-light</span>
                  <span>#1d3557</span>
                </div>
                <div className="h-10 bg-primary-dark rounded flex items-center justify-between px-3 text-white text-xs font-mono">
                  <span>bg-primary-dark</span>
                  <span>#0a192f</span>
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Accent (Saffron / Amber)
              </h3>
              <div className="space-y-2">
                <div className="h-12 bg-accent rounded flex items-center justify-between px-3 text-white text-xs font-mono">
                  <span>bg-accent</span>
                  <span>#d97706</span>
                </div>
                <div className="h-10 bg-accent-light rounded flex items-center justify-between px-3 text-white text-xs font-mono">
                  <span>bg-accent-light</span>
                  <span>#f59e0b</span>
                </div>
                <div className="h-10 bg-accent-dark rounded flex items-center justify-between px-3 text-white text-xs font-mono">
                  <span>bg-accent-dark</span>
                  <span>#b45309</span>
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Neutral Scale (Surfaces & Text)
              </h3>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                <div className="p-2 bg-slate-50 border border-slate-200 rounded text-slate-700">
                  50
                </div>
                <div className="p-2 bg-slate-100 rounded text-slate-700">100</div>
                <div className="p-2 bg-slate-200 rounded text-slate-700">200</div>
                <div className="p-2 bg-slate-300 rounded text-slate-800">300</div>
                <div className="p-2 bg-slate-500 rounded text-white">500</div>
                <div className="p-2 bg-slate-800 rounded text-white">800</div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Radius & Shadow Scales */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-card border border-slate-200/80 p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-heading font-bold text-slate-900">
                4. Radius Scale
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Structured border radii for formal civic interfaces.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {radii.map((r) => (
                <div
                  key={r.name}
                  className="flex flex-col items-center text-center p-3 border border-slate-200 rounded-lg"
                >
                  <div
                    className={`w-14 h-14 bg-primary-light/10 border-2 border-primary ${r.class} mb-2`}
                  ></div>
                  <span className="text-xs font-bold text-slate-800">{r.name}</span>
                  <span className="text-[11px] text-slate-500 mt-1">{r.usage}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-card border border-slate-200/80 p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-heading font-bold text-slate-900">
                5. Elevation & Shadow Scale
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Navy-tinted ambient shadows.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {shadows.map((s) => (
                <div
                  key={s.name}
                  className={`bg-white border border-slate-200/60 p-4 rounded-lg ${s.class} flex flex-col justify-between`}
                >
                  <div>
                    <span className="text-xs font-mono font-bold text-primary">
                      {s.name}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">{s.desc}</p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
                    .{s.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
