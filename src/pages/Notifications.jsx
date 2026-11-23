import React from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

export default function Notifications() {
  const mockNotifications = [
    {
      id: 'N-01',
      title: 'Problem JH-2026-WTR-01 Validated by Government Officer',
      desc: 'Your reported contaminated water pipeline in Ranchi has been verified and routed to BIT Mesra.',
      time: '10 minutes ago',
      type: 'validated',
      unread: true,
    },
    {
      id: 'N-02',
      title: 'New Milestone Reached: Prototype Deployed',
      desc: 'University engineering team submitted Milestone 2 verification photos.',
      time: '2 hours ago',
      type: 'progress',
      unread: true,
    },
    {
      id: 'N-03',
      title: 'Support Offer Received from Tata Steel CSR',
      desc: '₹2.5 Lakhs pledged for IoT Water Sensor procurement.',
      time: 'Yesterday',
      type: 'assigned',
      unread: false,
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-slate-900">
            System Notifications
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Automated alerts triggered on every problem status change and milestone
            update.
          </p>
        </div>
        <Button variant="outline" size="sm">
          Mark All as Read
        </Button>
      </div>

      <div className="space-y-3">
        {mockNotifications.map((notif) => (
          <Card
            key={notif.id}
            hover={true}
            className={notif.unread ? 'border-primary/40 bg-slate-50/70' : ''}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge status={notif.type} size="sm" />
                  <span className="text-xs text-slate-400 font-mono">{notif.time}</span>
                  {notif.unread && (
                    <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
                  )}
                </div>
                <h3 className="font-heading font-semibold text-slate-900 text-sm">
                  {notif.title}
                </h3>
                <p className="text-xs text-slate-600 font-sans">{notif.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
