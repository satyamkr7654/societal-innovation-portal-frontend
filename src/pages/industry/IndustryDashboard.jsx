import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import LoadState from '../../components/ui/LoadState';
import { useAsync } from '../../hooks/useAsync';
import { listMyPledges, listOpenProposals } from '../../services/pledgeService';
import { formatRupees } from '../../utils/money';

const loadDashboard = async () => {
  const [proposals, pledges] = await Promise.all([listOpenProposals(), listMyPledges()]);
  return { proposals, pledges };
};

export default function IndustryDashboard() {
  const { data, error, isLoading, reload } = useAsync(loadDashboard);
  if (isLoading || error) return <LoadState error={error} onRetry={reload} />;

  const withStatus = (status) => data.pledges.filter((p) => p.pledge.status === status);
  const accepted = withStatus('ACCEPTED');
  const funding = accepted.reduce((sum, p) => sum + (p.pledge.amount || 0), 0);
  const projects = new Set(accepted.map((p) => p.problemId)).size;
  const tiles = [
    ['Open proposals', data.proposals.length, 'Approved by an admin'],
    ['Offers waiting', withStatus('PENDING').length, 'For a university answer'],
    ['Projects supported', projects, 'With an accepted offer'],
    ['Funding committed', formatRupees(funding), 'In accepted offers'],
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-slate-900">
            Industry Dashboard
          </h2>
          <p className="text-sm text-slate-500">Your organisation&apos;s support.</p>
        </div>
        <Link to="/industry/proposals">
          <Button size="sm">Browse Proposals &rarr;</Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {tiles.map(([label, value, note]) => (
          <Card key={label} padding="sm">
            <span className="text-xs font-semibold text-slate-500">{label}</span>
            <div className="text-2xl font-heading font-bold text-primary mt-1 break-words">
              {value}
            </div>
            <p className="text-xs text-slate-500 mt-1">{note}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
