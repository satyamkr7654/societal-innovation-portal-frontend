import React from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';

export default function MyProblems() {
  const mockItems = [
    {
      id: 'JH-2026-WTR-01',
      title: 'Contaminated drinking water pipeline near Ward 12, Ranchi',
      status: 'assigned',
      university: 'BIT Mesra Innovation Lab',
      date: 'Sep 24, 2026',
    },
    {
      id: 'JH-2026-RDS-04',
      title: 'Deep potholes causing waterlogging on Main Road, Dhanbad',
      status: 'progress',
      university: 'IIT (ISM) Dhanbad Civic Cell',
      date: 'Sep 20, 2026',
    },
    {
      id: 'JH-2026-SAN-09',
      title: 'Open drainage overflow near community health center, Bokaro',
      status: 'solved',
      university: 'Bokaro Steel City Polytechnic',
      date: 'Sep 12, 2026',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-slate-900">
            My Reported Problems
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Track real-time progress and milestone updates for your lodged grievances.
          </p>
        </div>
        <Link to="/citizen/submit">
          <Button variant="primary" size="sm">
            + New Problem
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {mockItems.map((item) => (
          <Card key={item.id} hover={true}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-400">
                    {item.id}
                  </span>
                  <Badge status={item.status} size="sm" />
                </div>
                <h3 className="font-heading font-bold text-slate-900 text-sm sm:text-base">
                  {item.title}
                </h3>
                <div className="text-xs text-slate-500 flex items-center gap-3">
                  <span>Assigned: <strong>{item.university}</strong></span>
                  <span>•</span>
                  <span>Reported: {item.date}</span>
                </div>
              </div>
              <div>
                <Link to={`/citizen/problems/${item.id}`}>
                  <Button variant="outline" size="sm">
                    View Tracker &rarr;
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
