export const NOTIFICATION_STATUS = {
  QUEUED: 0,
  SENDING: 1,
  SENT: 2,
  DELIVERED: 3,
  FAILED: 4,
} as const;

export type NotificationStatus =
  (typeof NOTIFICATION_STATUS)[keyof typeof NOTIFICATION_STATUS];

export interface INotificationType {
  id: string;
  code: string;
  name: string;
  form_type?: string;
  icon?: string;
  color?: string;
  background_color?: string;
  title?: string;
  template_message?: string;
  next_action?: string;
  priority?: number | null;
  created_at: Date;
  updated_at: Date;
  unread_count?: number;
}

export interface ICreateNotificationType {
  code: string;
  name: string;
  form_type?: string;
  icon?: string;
  color?: string;
  background_color?: string;
  title?: string;
  template_message?: string;
  next_action?: string;
  priority?: number | null;
}

export interface INotificationTypeFilterVariables {
  q?: string;
  ship_code?: string;
}
