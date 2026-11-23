import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import LoadState from '../components/ui/LoadState';
import { useAsync } from '../hooks/useAsync';
import { useAuth } from '../hooks/useAuth';
import { announceNotificationChange } from '../hooks/useUnreadCount';
import {
  listNotifications,
  markAllRead,
  markRead,
} from '../services/notificationService';

/** Where a notification leads, for this role. */
function targetFor(notification, role) {
  if (notification.problemId) return `/${role}/problems/${notification.problemId}`;
  return role === 'admin' ? '/admin/accounts' : null;
}

export default function Notifications() {
  const { role } = useAuth();
  const navigate = useNavigate();
  const { data, error, isLoading, reload, setData } = useAsync(listNotifications);
  const [actionError, setActionError] = useState('');

  const update = async (action, isAffected) => {
    setActionError('');
    try {
      await action();
      setData(data.map((n) => (isAffected(n) ? { ...n, read: true } : n)));
      announceNotificationChange();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const open = async (notification) => {
    if (!notification.read) {
      await update(
        () => markRead(notification.id),
        (n) => n.id === notification.id
      );
    }
    const target = targetFor(notification, role);
    if (target) navigate(target);
  };

  if (isLoading || error) return <LoadState error={error} onRetry={reload} />;
  const unread = data.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-slate-900">
            Notifications
          </h2>
          <p className="text-sm text-slate-500">
            {unread === 0 ? 'You are up to date.' : `${unread} unread`} Showing the latest
            50.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={unread === 0}
          onClick={() => update(markAllRead, () => true)}
        >
          Mark All as Read
        </Button>
      </div>

      {actionError && (
        <p role="alert" className="text-sm text-red-600 font-medium">
          {actionError}
        </p>
      )}

      {data.length === 0 ? (
        <p className="bg-white rounded-xl border border-slate-200 p-10 text-center text-sm text-slate-500">
          No notifications yet.
        </p>
      ) : (
        <ul className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
          {data.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => open(n)}
                className={`w-full text-left p-4 flex gap-3 items-start hover:bg-slate-50 ${
                  n.read ? '' : 'bg-primary-50'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                    n.read ? 'bg-slate-200' : 'bg-accent'
                  }`}
                />
                <span className="min-w-0">
                  {!n.read && <span className="sr-only">Unread: </span>}
                  <span
                    className={`block text-sm text-slate-900 break-words ${
                      n.read ? '' : 'font-semibold'
                    }`}
                  >
                    {n.message}
                  </span>
                  <span className="block text-xs text-slate-500">
                    {new Date(n.createdAt).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
