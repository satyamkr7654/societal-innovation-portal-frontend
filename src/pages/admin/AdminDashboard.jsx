import React from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-slate-900">
            Government Administration Console
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            State-level monitoring of societal problems across Jharkhand districts.
          </p>
        </div>
        <Link to="/admin/review">
          <Button variant="primary" size="sm">
            Review Pending Submissions &rarr;
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hover={true}>
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Pending Review</span>
            <div className="text-3xl font-heading font-bold text-amber-600">14</div>
            <p className="text-xs text-slate-500">Awaiting Govt Validation</p>
          </div>
        </Card>
        <Card hover={true}>
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Assigned to Univ</span>
            <div className="text-3xl font-heading font-bold text-primary">38</div>
            <p className="text-xs text-slate-500">Active engineering projects</p>
          </div>
        </Card>
        <Card hover={true}>
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Industry Funded</span>
            <div className="text-3xl font-heading font-bold text-purple-600">19</div>
            <p className="text-xs text-slate-500">₹42.5L CSR funding committed</p>
          </div>
        </Card>
        <Card hover={true}>
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Successfully Solved</span>
            <div className="text-3xl font-heading font-bold text-emerald-600">27</div>
            <p className="text-xs text-slate-500">Verified and closed</p>
          </div>
        </Card>
      </div>

      <Card
        header={
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-slate-800">
              Analytics & Recharts Integration (Phase F4)
            </h3>
            <Badge status="validated" size="sm">
              Phase F4 Target
            </Badge>
          </div>
        }
      >
        <p className="text-xs text-slate-600 leading-relaxed font-sans py-2">
          In <strong>Phase F4</strong>, this admin screen will feature interactive <strong>Recharts</strong> data visualizations (problem breakdown by district, resolution time trends, and university performance scorecards).
        </p>
      </Card>
    </div>
  );
}
