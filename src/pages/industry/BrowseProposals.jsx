import React from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function BrowseProposals() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-slate-900">
          Browse University Innovation Proposals
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Discover verified civic solution proposals looking for industry sponsorship,
          mentorship, or materials.
        </p>
      </div>

      <Card
        header={
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-slate-800">
              Proposal Marketplace & CSR Pledges (Phase F6)
            </h3>
            <Badge status="progress" size="sm">
              Phase F6 Target
            </Badge>
          </div>
        }
      >
        <div className="space-y-4 py-2">
          <p className="text-xs text-slate-600 leading-relaxed">
            In <strong>Phase F6</strong>, this marketplace will feature:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <strong>Financial CSR:</strong> Direct budget sponsorship against
              transparent milestone deliverables.
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <strong>Technical Mentorship:</strong> Senior industry engineers guiding
              university research teams.
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <strong>Equipment & Materials:</strong> In-kind donations of IoT sensors,
              pumps, lab chemicals, or servers.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
