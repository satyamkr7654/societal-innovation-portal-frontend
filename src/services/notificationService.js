import { request } from './apiClient';

export const listNotifications = () => request('/notifications');
export const getUnreadCount = async () =>
  (await request('/notifications/unread-count')).count;
export const markRead = (id) => request(`/notifications/${id}/read`, { method: 'POST' });
export const markAllRead = () => request('/notifications/read-all', { method: 'POST' });
