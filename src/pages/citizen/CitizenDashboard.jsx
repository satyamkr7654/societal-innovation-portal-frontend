import React from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';

export default function CitizenDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-slate-900">
            Citizen Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Overview of your reported local issues and community resolution status in Jharkhand.
          </p>
        </div>
        <Link to="/citizen/submit">
          <Button variant="primary" size="md">
            + Report New Problem
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hover={true}>
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Total Reported
            </span>
            <div className="text-3xl font-heading font-black text-primary">3</div>
            <p className="text-xs text-slate-500">Civic issues lodged by you</p>
          </div>
        </Card>
        <Card hover={true}>
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              In Progress
            </span>
            <div className="text-3xl font-heading font-black text-amber-600">2</div>
            <p className="text-xs text-slate-500">Assigned to university R&D</p>
          </div>
        </Card>
        <Card hover={true}>
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Resolved & Closed
            </span>
            <div className="text-3xl font-heading font-black text-emerald-600">1</div>
            <p className="text-xs text-slate-500">Verified by municipal admin</p>
          </div>
        </Card>
      </div>

      <Card
        header={
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-slate-800 text-sm">
              Citizen Module Roadmap
            </h3>
            <Badge status="progress" size="sm">
              Phase F3 Target
            </Badge>
          </div>
        }
      >
        <p className="text-xs text-slate-600 leading-relaxed font-sans">
          In <strong>Phase F3</strong>, this dashboard will feature interactive problem tracking cards, category-wise breakdowns (Water, Roads, Sanitation, Electricity, Health), and live status alerts.
        </p>
      </Card>
    </div>
  );
}
