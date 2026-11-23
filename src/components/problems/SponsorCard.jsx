import React from 'react';
import Card from '../ui/Card';
import { describePledge } from '../../utils/pledges';

/** Accepted industry support. */
export default function SponsorCard({ supporters }) {
  return (
    <Card
      header={
        <h3 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-1.5">
          <span>💼</span> Industry / CSR Partners
        </h3>
      }
    >
      {supporters.length === 0 ? (
        <p className="text-xs text-slate-500">No industry support yet.</p>
      ) : (
        <ul className="space-y-3 text-xs">
          {supporters.map((s, index) => (
            <li key={index}>
              <p className="font-heading font-bold text-slate-900 text-sm break-words">
                {s.sponsor}
              </p>
              <p className="text-emerald-700 font-semibold">{describePledge(s)}</p>
              <p className="text-slate-600 break-words">{s.description}</p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
