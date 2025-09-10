export interface INotificationType {
  id: string;
  code: string;
  name: string;
  form_type?: string;
  icon?: string;
  color?: string;
  background_color?: string;
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
}

export interface INotificationTypeFilterVariables {
  q?: string;
  ship_code?: string;
}
