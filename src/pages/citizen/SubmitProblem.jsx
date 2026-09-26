import React from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function SubmitProblem() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-slate-900">
          Report a Societal Problem
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Provide detailed evidence and location coordinates to help government officers review and assign your issue.
        </p>
      </div>

      <Card
        header={
          <div className="flex items-center justify-between">
            <span className="font-heading font-bold text-slate-800 text-sm">
              Citizen Reporting Interface
            </span>
            <Badge status="progress" size="sm">
              Phase F3 Target
            </Badge>
          </div>
        }
      >
        <div className="space-y-4 py-3">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="font-heading font-semibold text-sm text-slate-800">
              Interactive Form Preview (Coming in Phase F3):
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li>Problem Title & Description (with character validation)</li>
              <li>Civic Category Selector (Water Contamination, Sanitation, Health, Agriculture, Education)</li>
              <li>Photo Upload with thumbnail preview</li>
              <li>Interactive <strong>Leaflet Map Picker</strong> (click to drop pin with latitude/longitude)</li>
            </ul>
          </div>
          <div className="pt-2">
            <Button variant="primary" size="md" disabled>
              Submit Problem Form (Coming in Phase F3)
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
