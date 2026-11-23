import React from 'react';
import Card from '../ui/Card';
import { formatRupees } from '../../utils/money';
import { PROPOSAL_STATUS } from '../../utils/proposal';

const title = (text) => (
  <h3 className="font-heading font-bold text-sm text-slate-900">{text}</h3>
);

/** Milestones for everyone; the proposal only when the server includes it. */
export default function ProjectCard({ project }) {
  const { milestones, proposal } = project;
  return (
    <>
      {milestones.length > 0 && (
        <Card
          header={
            <div className="flex items-center justify-between">
              {title('Project Milestones')}
              <span className="text-xs text-slate-500">
                {milestones.filter((m) => m.done).length} of {milestones.length} complete
              </span>
            </div>
          }
        >
          <ol className="space-y-3">
            {milestones.map((m, index) => (
              <li key={m.id} className="flex gap-3 text-sm">
                <span
                  aria-hidden="true"
                  className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                    m.done
                      ? 'bg-emerald-600 text-white'
                      : 'border-2 border-slate-300 text-slate-500'
                  }`}
                >
                  {m.done ? '✓' : index + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">
                    {m.title}{' '}
                    <span className="font-normal text-xs text-slate-500">
                      {m.done
                        ? `completed ${new Date(m.completedAt).toLocaleDateString('en-IN')}`
                        : 'not complete'}
                    </span>
                  </p>
                  {m.note && <p className="text-slate-600 break-words">{m.note}</p>}
                </div>
              </li>
            ))}
          </ol>
        </Card>
      )}

      {proposal && (
        <Card
          header={
            <div className="flex items-center justify-between gap-3">
              {title('Proposal')}
              <span className="text-xs font-semibold text-slate-600">
                {PROPOSAL_STATUS[proposal.status]}
              </span>
            </div>
          }
        >
          <div className="space-y-4 text-sm text-slate-700">
            <div>
              <h4 className="font-semibold text-slate-900">Summary</h4>
              <p className="whitespace-pre-line break-words">{proposal.summary}</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">Technical approach</h4>
              <p className="whitespace-pre-line break-words">{proposal.approach}</p>
            </div>
            <p>
              <strong className="text-slate-900">Duration:</strong>{' '}
              {proposal.durationWeeks} weeks
            </p>
            <table className="w-full">
              <caption className="text-left font-semibold text-slate-900 pb-1">
                Budget
              </caption>
              <tbody className="divide-y divide-slate-100">
                {proposal.items.map((item, index) => (
                  <tr key={index}>
                    <td className="py-1.5 break-words">{item.label}</td>
                    <td className="py-1.5 text-right whitespace-nowrap">
                      {formatRupees(item.amount)}
                    </td>
                  </tr>
                ))}
                <tr className="font-bold text-slate-900">
                  <td className="py-1.5">Total</td>
                  <td className="py-1.5 text-right whitespace-nowrap">
                    {formatRupees(proposal.total)}
                  </td>
                </tr>
              </tbody>
            </table>
            {proposal.reviewNote && (
              <p>
                <strong className="text-slate-900">Admin remarks:</strong>{' '}
                {proposal.reviewNote}
              </p>
            )}
          </div>
        </Card>
      )}
    </>
  );
}
