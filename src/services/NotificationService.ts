import { NotificationCore } from '@/core/notifications/NotificationCore';
import { NotificationData } from '@/types/NotificationTypes';

export class NotificationService extends NotificationCore {
  // Example specialized method
  showHighPriority(notification: NotificationData) {
    notification.priority = 'high';
    this.addNotification(notification);
  }
}
