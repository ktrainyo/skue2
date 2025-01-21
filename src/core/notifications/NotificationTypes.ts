// ...existing code...

export type NotificationType = 'info' | 'error' | 'warning' | 'success';
export type NotificationPriority = 'low' | 'medium' | 'high';

export interface NotificationData {
  id: string;
  message: string;
  type: NotificationType;
  priority?: NotificationPriority;
  duration?: number;
  // ...existing code...
}
