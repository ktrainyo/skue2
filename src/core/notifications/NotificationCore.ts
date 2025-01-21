import { NotificationData } from './NotificationTypes';

export class NotificationCore {
  protected notifications: NotificationData[] = [];

  addNotification(notification: NotificationData) {
    this.notifications.push(notification);
  }

  removeNotification(notificationId: string) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
  }

  getNotifications() {
    return this.notifications;
  }
}
