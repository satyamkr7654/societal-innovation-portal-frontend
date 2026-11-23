import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

/** The university working on a problem. */
export default function UniversityCard({ university }) {
  return (
    <Card
      header={
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-1.5">
            <span>🏛️</span> University R&amp;D Assignee
          </h3>
          <Badge status={university ? 'assigned' : 'submitted'} size="sm" />
        </div>
      }
    >
      {university ? (
        <div className="space-y-3 text-xs">
          <div>
            <h4 className="font-heading font-bold text-slate-900 text-sm">
              {university.name}
            </h4>
            <p className="text-slate-500 text-xs mt-0.5">{university.department}</p>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between text-slate-600">
              <span>Faculty Lead:</span>
              <strong className="text-slate-900">
                {university.facultyLead || 'Assigned Faculty'}
              </strong>
            </div>

            {university.studentsCount && (
              <div className="flex items-center justify-between text-slate-600">
                <span>Student Researchers:</span>
                <strong className="text-slate-900">
                  {university.studentsCount} Students Enrolled
                </strong>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-2 text-xs text-slate-500">
          <p>This problem has not yet been assigned to a university innovation cell.</p>
          <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-600">
            Government nodal officers review submitted grievances and match them with
            Jharkhand university departments (BIT Mesra, IIT ISM Dhanbad, NIT Jamshedpur,
            etc.).
          </div>
        </div>
      )}
    </Card>
  );
}
