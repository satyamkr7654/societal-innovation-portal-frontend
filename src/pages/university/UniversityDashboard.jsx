import React from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';

export default function UniversityDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-slate-900">
            University Innovation Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage assigned civic challenges, student project teams, and proposal milestones.
          </p>
        </div>
        <Link to="/university/assignments">
          <Button variant="primary" size="sm">
            View Assigned Problems &rarr;
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card hover={true}>
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Assigned Challenges</span>
            <div className="text-3xl font-heading font-bold text-purple-700">5</div>
            <p className="text-xs text-slate-500">Awaiting proposal submission</p>
          </div>
        </Card>
        <Card hover={true}>
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Active Proposals</span>
            <div className="text-3xl font-heading font-bold text-primary">3</div>
            <p className="text-xs text-slate-500">Submitted for industry funding</p>
          </div>
        </Card>
        <Card hover={true}>
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Milestones Completed</span>
            <div className="text-3xl font-heading font-bold text-emerald-600">8 / 12</div>
            <p className="text-xs text-slate-500">Field prototypes deployed</p>
          </div>
        </Card>
      </div>

      <Card
        header={
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-slate-800">
              University R&D Roadmap (Phase F5)
            </h3>
            <Badge status="assigned" size="sm">
              Phase F5 Target
            </Badge>
          </div>
        }
      >
        <p className="text-xs text-slate-600 leading-relaxed py-2">
          In <strong>Phase F5</strong>, universities will have proposal drafting editors (budget breakdown, hardware/software specs, timeline), team member assignment, and milestone status reporting.
        </p>
      </Card>
    </div>
  );
}
