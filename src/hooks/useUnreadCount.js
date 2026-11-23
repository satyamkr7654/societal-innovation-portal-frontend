import { useEffect, useState } from 'react';
import { getUnreadCount } from '../services/notificationService';

const POLL_MS = 60_000;
const CHANGED = 'notifications-changed';

/** Tells the bell that something was read. */
export const announceNotificationChange = () => window.dispatchEvent(new Event(CHANGED));

/** Unread notifications, refreshed on navigation and every minute while visible. */
export function useUnreadCount(pathname) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let isActive = true;
    const refresh = () => {
      if (document.hidden) return;
      getUnreadCount().then(
        (value) => isActive && setCount(value),
        () => {} // the bell is optional; keep the last known count
      );
    };
    refresh();
    const timer = setInterval(refresh, POLL_MS);
    window.addEventListener(CHANGED, refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      isActive = false;
      clearInterval(timer);
      window.removeEventListener(CHANGED, refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [pathname]);

  return count;
}
