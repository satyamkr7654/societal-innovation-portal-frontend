import React from 'react';
import Card from '../ui/Card';

/** Industry or CSR support pledged. */
export default function SponsorCard({ support }) {
  return (
    <Card
      header={
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-1.5">
            <span>💼</span> Industry / CSR Partner
          </h3>
          <span className="text-[11px] font-bold text-slate-400 uppercase">
            Funding &amp; Hardware
          </span>
        </div>
      }
    >
      {support?.sponsor ? (
        <div className="space-y-3 text-xs">
          <div>
            <h4 className="font-heading font-bold text-slate-900 text-sm">
              {support.sponsor}
            </h4>
            <p className="text-emerald-700 font-semibold text-xs mt-0.5">
              Funding Pledged: {support.amount}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 text-slate-600">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Sponsorship Scope
            </span>
            <p className="mt-0.5 text-slate-800">{support.type}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-2 text-xs text-slate-500">
          <p>No private sector or CSR sponsor has adopted this research proposal yet.</p>
          <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-600">
            Corporates like Tata Steel, Coal India, and JSPL browse vetted academic
            proposals in their dashboard to fund prototyping costs.
          </div>
        </div>
      )}
    </Card>
  );
}
