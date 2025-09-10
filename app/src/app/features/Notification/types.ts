export interface NotificationType {
  code: string;
  name: string;
  unread_count: number;
}

export interface Notification {
  id: string;
  occurred_at: string;
  content: string;
  ship_code: string;
  report: boolean;
  type: string;
  formatted_message?: string;
}
