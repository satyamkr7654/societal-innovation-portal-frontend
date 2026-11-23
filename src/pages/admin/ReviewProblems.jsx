import React from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function ReviewProblems() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-slate-900">
          Review & Triage Reported Problems
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Validate citizen reports, reject spam with mandatory reason, and assign verified
          issues to universities.
        </p>
      </div>

      <Card
        header={
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-slate-800">
              Admin Action Workflow (Phase F4)
            </h3>
            <Badge status="validated" size="sm">
              Phase F4 Target
            </Badge>
          </div>
        }
      >
        <div className="space-y-4 py-2">
          <p className="text-xs text-slate-600 leading-relaxed">
            In <strong>Phase F4</strong>, this page will host the government review table
            with:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
              <strong className="text-emerald-700">1. VALIDATE:</strong>
              <p>
                Mark verified problem as legitimate and ready for university assignment.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
              <strong className="text-red-700">2. REJECT (With Reason):</strong>
              <p>
                Reject invalid/duplicate problem with mandatory feedback logged in status
                history.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
              <strong className="text-primary">3. ASSIGN UNIVERSITY:</strong>
              <p>
                Select accredited college (e.g. BIT Mesra, NIT Jamshedpur) based on
                expertise.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
