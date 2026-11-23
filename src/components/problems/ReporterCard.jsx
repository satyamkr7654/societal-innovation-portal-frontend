import React from 'react';
import Card from '../ui/Card';

/** Who reported the problem. `phone` is passed only for the owner. */
export default function ReporterCard({ citizen, phone }) {
  return (
    <Card
      header={
        <h3 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-1.5">
          <span>👤</span> Lodging Citizen Details
        </h3>
      }
    >
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between text-slate-600">
          <span>Name:</span>
          <strong className="text-slate-900">{citizen?.name || 'Citizen'}</strong>
        </div>
        <div className="flex items-center justify-between text-slate-600">
          <span>Mobile Contact:</span>
          <span className="font-mono text-slate-700">
            {phone ? `+91 ${phone}` : 'Confidential'}
          </span>
        </div>
      </div>
    </Card>
  );
}
