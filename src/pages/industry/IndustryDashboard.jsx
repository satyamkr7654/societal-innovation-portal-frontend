import React from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';

export default function IndustryDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-slate-900">
            Industry & CSR Partner Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Sponsor civic technology solutions and empower university innovators in Jharkhand.
          </p>
        </div>
        <Link to="/industry/proposals">
          <Button variant="primary" size="sm">
            Browse University Proposals &rarr;
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card hover={true}>
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Available Proposals</span>
            <div className="text-3xl font-heading font-bold text-primary">12</div>
            <p className="text-xs text-slate-500">Vetted by Govt. Admin</p>
          </div>
        </Card>
        <Card hover={true}>
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">My Active Sponsorships</span>
            <div className="text-3xl font-heading font-bold text-amber-600">3</div>
            <p className="text-xs text-slate-500">₹14.2 Lakhs committed</p>
          </div>
        </Card>
        <Card hover={true}>
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Impact Generated</span>
            <div className="text-3xl font-heading font-bold text-emerald-600">4,200+</div>
            <p className="text-xs text-slate-500">Citizens positively impacted</p>
          </div>
        </Card>
      </div>

      <Card
        header={
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-slate-800">
              CSR Support Roadmap (Phase F6)
            </h3>
            <Badge status="progress" size="sm">
              Phase F6 Target
            </Badge>
          </div>
        }
      >
        <p className="text-xs text-slate-600 leading-relaxed py-2">
          In <strong>Phase F6</strong>, industries can browse university proposals by SDG/category, make funding commitments, offer expert mentorship, or provide lab hardware/machinery support.
        </p>
      </Card>
    </div>
  );
}
