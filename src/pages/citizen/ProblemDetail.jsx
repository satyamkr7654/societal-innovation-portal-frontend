import React from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Link, useParams } from 'react-router-dom';

export default function ProblemDetail() {
  const { id } = useParams();

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-2">
        <Link to="/citizen/problems" className="text-xs text-primary font-semibold hover:underline">
          &larr; Back to My Problems
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs font-bold text-slate-400">
            CASE ID: {id || 'JH-2026-WTR-01'}
          </span>
          <h2 className="text-2xl font-heading font-bold text-slate-900 mt-1">
            Problem Lifecycle & Milestone Tracker
          </h2>
        </div>
        <Badge status="progress" size="md" />
      </div>

      <Card
        header={
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-slate-800">
              Interactive Timeline & Feedback (Phase F3)
            </h3>
            <Badge status="validated" size="sm">
              Phase F3 Target
            </Badge>
          </div>
        }
      >
        <div className="space-y-4 py-2">
          <p className="text-xs text-slate-600 leading-relaxed">
            In <strong>Phase F3</strong>, this page will display:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <strong>1. Leaflet Map Coordinates:</strong> Pinpoint exact GPS location where the problem was flagged.
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <strong>2. Photo Evidence Gallery:</strong> High-res citizen upload and university milestone progress images.
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <strong>3. Status Audit History:</strong> Audit trail of SUBMITTED &rarr; VALIDATED &rarr; ASSIGNED &rarr; IN_PROGRESS &rarr; SOLVED.
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <strong>4. Citizen Feedback & Star Rating:</strong> Post-resolution citizen satisfaction review.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
