import React from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function Proposals() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-slate-900">
          Innovation Proposals & Milestone Updates
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Technical solutions, estimated budgets, and milestone progress trackers.
        </p>
      </div>

      <Card
        header={
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-slate-800">
              Proposal Builder & Milestone Lifecycle (Phase F5)
            </h3>
            <Badge status="progress" size="sm">
              Phase F5 Target
            </Badge>
          </div>
        }
      >
        <div className="space-y-4 py-2">
          <p className="text-xs text-slate-600 leading-relaxed">
            In <strong>Phase F5</strong>, universities will submit solutions formatted for
            Industry CSR review:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <strong>Proposal Formulation:</strong> Technical abstract, methodology, bill
              of materials, and total funding required.
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <strong>Milestone Tracking:</strong> Step 1 (Design), Step 2 (Prototype),
              Step 3 (Field Deployment), Step 4 (Citizen Handover).
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
