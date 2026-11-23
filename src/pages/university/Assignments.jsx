import React from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function Assignments() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-slate-900">
          Assigned Societal Problems
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Civic problems routed to your institution by the Government of Jharkhand.
        </p>
      </div>

      <Card
        header={
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-slate-800">
              Assignment Acceptance & Team Formulation (Phase F5)
            </h3>
            <Badge status="assigned" size="sm">
              Phase F5 Target
            </Badge>
          </div>
        }
      >
        <div className="space-y-4 py-2">
          <p className="text-xs text-slate-600 leading-relaxed">
            In <strong>Phase F5</strong>, this module will enable:
          </p>
          <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
            <li>
              <strong>Accept or Decline Assignment:</strong> Review problem severity,
              field location, and accept responsibility.
            </li>
            <li>
              <strong>Faculty Lead & Student Team Tagging:</strong> Form
              inter-disciplinary engineering student squads.
            </li>
            <li>
              <strong>Initial Field Assessment Notes:</strong> Upload preliminary
              feasibility report.
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
