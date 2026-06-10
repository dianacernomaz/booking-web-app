import { axiosClient } from '../axios/axiosClient';

export type NotificationType = 'Reservation' | 'Promotional' | 'System';

export interface NotificationRecord {
    id: number;
    userId: number;
    title: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    createdAt: string;
}

interface UnreadNotificationsCount {
    count: number;
}

const NOTIFICATIONS_CHANGED_EVENT = 'sb_notifications_changed';

export async function getNotifications() {
    const { data } = await axiosClient.get<NotificationRecord[]>('/notifications');
    return data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getUnreadNotificationsCount() {
    const { data } = await axiosClient.get<UnreadNotificationsCount>('/notifications/unread-count');
    return data;
}

export async function markNotificationAsRead(id: number) {
    await axiosClient.patch(`/notifications/${id}/read`);
    window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED_EVENT));
}

export async function markAllNotificationsAsRead() {
    await axiosClient.patch('/notifications/read-all');
    window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED_EVENT));
}

export async function deleteNotification(id: number) {
    await axiosClient.delete(`/notifications/${id}`);
    window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED_EVENT));
}

export const notificationsChangedEvent = NOTIFICATIONS_CHANGED_EVENT;
